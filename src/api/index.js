const {AlbumHandler} = require('./album/album-handler');
const {AlbumRoute} = require('./album/album-routes');
const {
  AuthenticationHandler,
} = require('./authentication/authentication-handler');
const {AuthenticationRoute} = require('./authentication/authentication-routes');
const {PlaylistHandler} = require('./playlist/playlist-handler');
const {PlaylistRoute} = require('./playlist/playlist-routes');
const {SongHandler} = require('./song/song-handler');
const {SongRoute} = require('./song/song-routes');
const {UserHandler} = require('./user/user-handler');
const {UserRoute} = require('./user/user-routes');

/**
 * Api handler
 * @return {any}
 */
function api() {
  const pluginApi = {
    albumApi: {
      name: 'albums',
      version: '1.0.0',
      register: async function(server, {service, validator}) {
        const serverHandler = new AlbumHandler(service, validator);
        const serverRoute = new AlbumRoute(serverHandler);
        server.route(serverRoute.routes());
      },
    },
    songApi: {
      name: 'songs',
      version: '1.0.0',
      register: async function(server, {service, validator}) {
        const serverHandler = new SongHandler(service, validator);
        const serverRoute = new SongRoute(serverHandler);
        server.route(serverRoute.routes());
      },
    },
    userApi: {
      name: 'users',
      version: '1.0.0',
      register: function(server, {service, validator}) {
        const serverHandler = new UserHandler(service, validator);
        const serverRoute = new UserRoute(serverHandler);
        server.route(serverRoute.routes());
      },
    },
    playlistApi: {
      name: 'playlists',
      version: '1.0.0',
      register: async function(server, {service, validator}) {
        const serverHandler = new PlaylistHandler(service, validator);
        const serverRoute = new PlaylistRoute(serverHandler);
        server.route(serverRoute.routes());
      },
    },
    authenticationApi: {
      name: 'authentications',
      version: '1.0.0',
      register: async function(server, {service, validator}) {
        const serverHandler = new AuthenticationHandler(service, validator);
        const serverRoute = new AuthenticationRoute(serverHandler);
        server.route(serverRoute.routes());
      },
    },
  };

  return {...pluginApi};
}

module.exports = api;
