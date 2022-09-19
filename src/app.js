const {Pool} = require('pg');
const validationSchema = require('./validator/validator-shcema');
const api = require('./api');
const {ClientError} = require('./exception/client-error');
// Service
const {AlbumService} = require('./service/album-service');
const {SongService} = require('./service/song-service');
const {UserService} = require('./service/user-service');
const {PlaylistService} = require('./service/playlist-service');
const {AuthenticationService} = require('./service/authentication-service');
// validator
const {UserValidator} = require('./validator/user/user-validator');
const {SongValidator} = require('./validator/song/song-validator');
const {AlbumValidator} = require('./validator/album/album-validator');
const {
  AuthenticationValidator,
} = require('./validator/authentication/authentication-validator');
const {PlaylistValidator} = require('./validator/playlist/playlist-validator');
const {TokenManager} = require('./tokenize/token-manager');

/**
 * App server
 * @param {any} server Hapi server
 */
async function appServer(server) {
  // Plugin api for route
  const {
    albumApi,
    songApi,
    userApi,
    playlistApi,
    authenticationApi,
  } = api();

  // Database pool
  const pool = new Pool();

  // Service
  const albumService = new AlbumService(pool);
  const songService = new SongService(pool);
  const userService = new UserService(pool);
  const playlistService = new PlaylistService(pool);
  const authService = new AuthenticationService(pool);

  // Validator
  const userValidator = new UserValidator(validationSchema);
  const songValidator = new SongValidator(validationSchema);
  const albumValidator = new AlbumValidator(validationSchema);
  const authValidator = new AuthenticationValidator(validationSchema);
  const playlistValidator = new PlaylistValidator(validationSchema);

  // Token manager
  const tokenManager = new TokenManager();

  /**
   * On handle pre response
   * @param {any} request Reques from user
   * @param {any} h Hapi handler
   * @return {any} retun response
   */
  function handleOnPreResponse(request, h) {
    const {response} = request;

    if (response instanceof Error) {
      if (response instanceof ClientError) {
        const _response = h.response({
          status: 'fail',
          message: response.message,
        });

        _response.code(response.statusCode);
        return _response;
      }

      if (!response.isServer) return h.continue;

      const _response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server.',
      });

      _response.code(500);
      return _response;
    }

    return h.continue || response;
  }

  // Regis local plugin
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
        service: {albumService},
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
        service: {playlistService},
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
  ]);

  server.ext('onPreResponse', handleOnPreResponse);
}

module.exports = {appServer};
