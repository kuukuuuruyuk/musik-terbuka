// Handler
const {AlbumHandler} = require('./album/album-handler');
const {
  AuthenticationHandler,
} = require('./authentication/authentication-handler');
const {CollaborationHandler} = require('./collaboration/collaborator-handler');
const {PlaylistHandler} = require('./playlist/playlist-handler');
const {SongHandler} = require('./song/song-handler');
const {UserHandler} = require('./user/user-handler');
// Routes
const {AuthenticationRoute} = require('./authentication/authentication-routes');
const {CollaborationRoute} = require('./collaboration/collaborator-routes');
const {PlaylistRoute} = require('./playlist/playlist-routes');
const {AlbumRoute} = require('./album/album-routes');
const {SongRoute} = require('./song/song-routes');
const {UserRoute} = require('./user/user-routes');
const {JWT_APP_KEY} = require('../utils/key-token');

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
        const options = {auth: JWT_APP_KEY};
        const serverHandler = new PlaylistHandler(service, validator);
        const serverRoute = new PlaylistRoute(serverHandler);
        server.route(serverRoute.routes(options));
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
    collaborationApi: {
      name: 'collaborations',
      version: '1.0.0',
      register: async function(server, {service, validator}) {
        const options = {auth: JWT_APP_KEY};
        const serverHandler = new CollaborationHandler(service, validator);
        const serverRoute = new CollaborationRoute(serverHandler);
        server.route(serverRoute.routes(options));
      },
    },
  };

  return {...pluginApi};
}

module.exports = api;
