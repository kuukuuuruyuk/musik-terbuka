// menginpor dotend dan menjalankan konfigurasinya
require('dotenv').config();

const {Pool} = require('pg');
const Hapi = require('@hapi/hapi');
const hapiAuthJwt = require('@hapi/jwt');

// Plugin api hapi server register
const api = require('./api');

// Services
const {AlbumService} = require('./service/album-service');
const {albumValidator} = require('./validator/album/album-validator');

const {SongService} = require('./service/song-service');
const {songValidator} = require('./validator/song/song-validator');

/**
 * Method for handle starting the app
 */
async function bootstrap() {
  const {
    albumApi,
    songApi,
    userApi,
    playlistApi,
    authenticationApi,
  } = api();
  const pool = new Pool();
  const albumService = new AlbumService(pool);
  const songService = new SongService(pool);
  const _server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {origin: ['*']},
    },
  });

  // Regis eksternal plugin
  await _server.register([
    {
      plugin: hapiAuthJwt,
    },
  ]);

  // mendefinisikan strategy autentikasi jwt
  _server.auth.strategy('musikterbuka_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  // Regis local plugin
  await _server.register([
    {
      plugin: {...songApi},
      options: {
        service: {songService, albumService},
        validator: {songValidator, albumValidator},
      },
    },
    {
      plugin: {...albumApi},
      options: {
        service: {songService, albumService},
        validator: {songValidator, albumValidator},
      },
    },
    {
      plugin: {...userApi},
      options: {
        service: {},
        validator: {},
      },
    },
    {
      plugin: {...playlistApi},
      options: {
        service: {},
        validator: {},
      },
    },
    {
      plugin: {...authenticationApi},
      options: {
        service: {},
        validator: {},
      },
    },
  ]);

  await _server.start();
  console.log({
    info: `Server berjalan pada ${_server.info.uri} ${process.env.NODE_ENV}`,
  });
}

// Starting app
bootstrap();
