/**
 * Playlist handler
 */
class PlaylistRoute {
  /**
   * Playlist constructor
   * @param {any} handler Hapi handler server
   */
  constructor(handler) {
    this._h = handler;
  }

  /**
   * Playlist routes
   * @param {any} options option param handler
   * @return {Array}
   */
  routes(options) {
    const h = this._h;
    const auth = options.auth;

    return [
      {
        method: 'POST',
        path: '/playlists',
        handler: h.postPlaylistHandler,
        options: {auth},
      },
      {
        method: 'GET',
        path: '/playlists',
        handler: h.getPlaylistsHandler,
        options: {auth},
      },
      {
        method: 'DELETE',
        path: '/playlists/{playlistId}',
        handler: h.deletePlaylistHandler,
        options: {auth},
      },
      {
        method: 'POST',
        path: '/playlists/{playlistId}/songs',
        handler: h.postSongToPlaylistHandler,
        options: {auth},
      },
      {
        method: 'GET',
        path: '/playlists/{playlistId}/songs',
        handler: h.getSongsFromPlaylistHandler,
        options: {auth},
      },
      {
        method: 'DELETE',
        path: '/playlists/{playlistId}/songs',
        handler: h.deleteSongFromPlaylistHandler,
        options: {auth},
      },
      {
        method: 'GET',
        path: '/playlists/{playlistId}/activities',
        handler: h.getPlalistActivitiesHandler,
        options: {auth},
      },
    ];
  }
}

module.exports = {PlaylistRoute};
