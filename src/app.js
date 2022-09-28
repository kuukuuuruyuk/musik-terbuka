const {Pool} = require('pg');
const appPlugin = require('./api');
const amqp = require('amqplib');
const redis = require('redis');
const AWS = require('aws-sdk');
const path = require('path');
const validationSchema = require('./validator/validator-shcema');
const config = require('./utils/config');
// Service
const {AlbumService} = require('./service/album-service');
const {SongService} = require('./service/song-service');
const {UserService} = require('./service/user-service');
const {PlaylistService} = require('./service/playlist-service');
const {AuthenticationService} = require('./service/authentication-service');
const {DBService} = require('./service/db-service');
const {CollaborationService} = require('./service/collaboration-service');
const {ProducerService} = require('./service/export/producer-service');
const {UploadService} = require('./service/upload-service');
const {CacheControlService} = require('./service/cache-control-service');
const {AWSSimpleStorageService} = require('./service/aws-s3-service');
// validator
const {UserValidator} = require('./validator/user/user-validator');
const {SongValidator} = require('./validator/song/song-validator');
const {AlbumValidator} = require('./validator/album/album-validator');
const {
  AuthenticationValidator,
} = require('./validator/authentication/authentication-validator');
const {PlaylistValidator} = require('./validator/playlist/playlist-validator');
const {TokenManager} = require('./tokenize/token-manager');
const {TruncateValidator} = require('./validator/truncate/truncate-validator');
const {CollaborationValidator} =
  require('./validator/collaboration/collaboration-validator');
const {ExportValidator} = require('./validator/export/export-validator');
const {UploadValidator} = require('./validator/upload/upload-validator');

const JWT_APP_KEY = 'musicterbuka_jwt';

/**
 * App
 * @param {any} server Hapi server
 */
async function appServer(server) {
  const options = {auth: JWT_APP_KEY};
  // Database pool
  const pool = new Pool();

  // Init redis
  clientRedis = () => {
    const client = redis.createClient({
      socket: {host: config.redis.host},
    });

    client.on('error', (error) => {
      console.log(error);
    });

    client.connect();

    return client;
  };

  // Redis cache control
  const cacheControlService = new CacheControlService({client: clientRedis()});
  // Upload service
  const uploadService = new UploadService({
    path: path.resolve(__dirname, config.app.storage),
  });

  // Services
  const albumService = new AlbumService(pool, {
    uploadService,
    cacheControlService,
  });
  const songService = new SongService(pool, {cacheControlService});
  const userService = new UserService(pool);
  const collaborationService =
    new CollaborationService(pool, {cacheControlService});
  const playlistService = new PlaylistService(pool, {
    songService,
    collaborationService,
    cacheControlService,
  });
  const authService = new AuthenticationService(pool);
  const dbService = new DBService(pool);

  // Validator
  const userValidator = new UserValidator(validationSchema);
  const songValidator = new SongValidator(validationSchema);
  const albumValidator = new AlbumValidator(validationSchema);
  const authValidator = new AuthenticationValidator(validationSchema);
  const playlistValidator = new PlaylistValidator(validationSchema);
  const truncateValidator = new TruncateValidator(validationSchema);
  const collaborationValidator =
    new CollaborationValidator(validationSchema);
  const exportValidator = new ExportValidator(validationSchema);
  const uploadValidator = new UploadValidator(validationSchema);

  // RabbitMQ producer service
  const rabbitMqOpt = (error, _connection) => {
    if (error) {
      console.log('amq error');
      console.log(error);
      throw error;
    }

    const queue = 'hello';
    const msg = 'Hello world';

    channel.assertQueue(queue, {
      durable: false,
    });

    channel.sendToQueue(queue, Buffer.from(msg));
    console.log(' [x] Sent %s', msg);
  };

  const rabbitMqUrl = config.rabbitMq.server;
  const rabbitMqConn = await amqp.connect(rabbitMqUrl, rabbitMqOpt);
  const producerService = new ProducerService({connection: rabbitMqConn});

  // Token manager
  const tokenManager = new TokenManager();
  // s3 service
  const s3Service = new AWS.S3();
  const awsService = new AWSSimpleStorageService({s3: s3Service});

  // Routes
  server.route([
    {
      method: 'GET',
      path: '/',
      handler: (_request, h) => {
        return h.response({
          data: {
            app_name: 'Musik terbuka',
            version: 'v3',
          },
        });
      },
    },
    {
      method: 'DELETE',
      path: '/truncate',
      handler: async (request, h) => {
        truncateValidator.validatePayload(request.payload);

        const token = request.payload?.token;

        if (token !== config.app.truncateToken) {
          throw new InvariantError('Token is invalid man');
        }

        await dbService.truncateDB();

        return h.response({
          status: 'success',
          message: 'berhasil mentruncate semua data table',
        });
      },
    },
  ]);

  // Register local api plugin
  await server.register([
    {
      plugin: appPlugin.songs(),
      options: {
        service: {songService},
        validator: {songValidator},
      },
    },
    {
      plugin: appPlugin.albums(),
      options: {
        service: {albumService, songService},
        validator: {albumValidator},
      },
    },
    {
      plugin: appPlugin.users(),
      options: {
        service: {userService},
        validator: {userValidator},
      },
    },
    {
      plugin: appPlugin.playlists(options),
      options: {
        service: {playlistService, songService},
        validator: {playlistValidator},
      },
    },
    {
      plugin: appPlugin.authentications(),
      options: {
        service: {authService, userService, tokenManager},
        validator: {authValidator},
      },
    },
    {
      plugin: appPlugin.collaborations(options),
      options: {
        service: {
          userService,
          playlistService,
          collaborationService,
        },
        validator: {collaborationValidator},
      },
    },
    {
      plugin: appPlugin.uploadFile(),
      options: {
        service: {uploadService, awsService},
        validator: {uploadValidator},
      },
    },
    {
      plugin: appPlugin.exportSongs(options),
      options: {
        service: {
          playlistService,
          exportService: producerService,
        },
        validator: {exportValidator},
      },
    },
    {plugin: appPlugin.errorPlugin()},
  ]);
}

module.exports = {appServer, JWT_APP_KEY};
