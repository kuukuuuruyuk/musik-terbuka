const {AlbumRoute} = require('./album/album-routes');
const {AlbumHandler} = require('./album/album-handler');

const {SongRoute} = require('./song/song-routes');
const {SongHandler} = require('./song/song-handler');

/**
 * Api handler
 * @return {any}
 */
function api() {
  return {
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
  };
}

module.exports = api;
