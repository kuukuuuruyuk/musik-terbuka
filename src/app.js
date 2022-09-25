const {Pool} = require('pg');
const validationSchema = require('./validator/validator-shcema');
const api = require('./api');
// Service
const {AlbumService} = require('./service/album-service');
const {SongService} = require('./service/song-service');
const {UserService} = require('./service/user-service');
const {PlaylistService} = require('./service/playlist-service');
const {AuthenticationService} = require('./service/authentication-service');
const {DBService} = require('./service/db-service');
const {CollaborationService} = require('./service/collaboration-service');
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
// Exceptions
const {ClientError} = require('./exception/client-error');
const {NotFoundError} = require('./exception/not-found-error');
const {AuthorizationError} = require('./exception/authorization-error');
const {AuthenticationError} = require('./exception/authentication-error');
const {InvariantError} = require('./exception/invariant-error');

/**
 * App
 * @param {any} server Hapi server
 */
async function appServer(server) {
  // Plugin api for register routes
  const {
    albumApi,
    songApi,
    userApi,
    playlistApi,
    authenticationApi,
    collaborationApi,
  } = api();

  // Database pool
  const pool = new Pool();

  // Services
  const albumService = new AlbumService(pool);
  const songService = new SongService(pool);
  const userService = new UserService(pool);
  const collaborationService = new CollaborationService(pool);
  const playlistService = new PlaylistService(pool, {
    songService,
    collaborationService,
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

  // Token manager
  const tokenManager = new TokenManager();

  /**
   * On handle pre response
   *
   * @param {Request} request Request payload
   * @param {any} h Hapi handler
   * @return {any} Hapi response
   */
  function onPreResponseHandler(request, h) {
    const {response: _response} = request;

    if (_response instanceof Error) {
      if (_response instanceof ClientError) {
        return h.response({
          status: 'fail',
          message: _response.message,
        }).code(_response.statusCode);
      }

      if (_response instanceof NotFoundError) {
        return h.response({
          status: 'error',
          message: _response.message,
        }).code(404);
      }

      if (_response instanceof AuthorizationError) {
        return h.response({
          status: 'error',
          message: _response.message,
        }).code(403);
      }

      if (_response instanceof AuthenticationError) {
        return h.response({
          status: 'error',
          message: _response.message,
        }).code(401);
      }

      if (_response instanceof InvariantError) {
        const {statusCode} = _response.output;

        return h.response({
          status: 'error',
          message: _response.message,
        }).code(statusCode);
      }

      if (!_response.isServer) {
        return h.continue;
      }

      return h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server.',
      }).code(500);
    }

    return h.continue || _response;
  }

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

        const {token} = request.payload;

        if (token !== process.env.MYTRUNCATE_TOKEN) {
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
      plugin: songApi,
      options: {
        service: {songService},
        validator: {songValidator},
      },
    },
    {
      plugin: albumApi,
      options: {
        service: {albumService, songService},
        validator: {albumValidator},
      },
    },
    {
      plugin: userApi,
      options: {
        service: {userService},
        validator: {userValidator},
      },
    },
    {
      plugin: playlistApi,
      options: {
        service: {playlistService, songService},
        validator: {playlistValidator},
      },
    },
    {
      plugin: authenticationApi,
      options: {
        service: {authService, userService, tokenManager},
        validator: {authValidator},
      },
    },
    {
      plugin: collaborationApi,
      options: {
        service: {
          userService,
          playlistService,
          collaborationService,
        },
        validator: {collaborationValidator},
      },
    },
  ]);

  server.ext('onPreResponse', onPreResponseHandler);
}

module.exports = {appServer};
