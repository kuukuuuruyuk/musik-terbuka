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
   * @return {Array}
   */
  routes() {
    const h = this._h;

    return [
      {
        method: 'POST',
        path: '/playlists',
        handler: h.postPlaylistHandler,
      },
      {
        method: 'GET',
        path: '/playlists',
        handler: h.getPlaylistsHandler,
      },
      {
        method: 'DELETE',
        path: '/playlists',
        handler: h.deletePlaylistHandler,
      },
      {
        method: 'POST',
        path: '/playlists/{id}/song',
        handler: h.postPlaylistSongHandler,
      },
      {
        method: 'DELETE',
        path: '/playlists/{id}/song',
        handler: h.deletePlaylistSonghandler,
      },
    ];
  }
}

module.exports = {PlaylistRoute};
