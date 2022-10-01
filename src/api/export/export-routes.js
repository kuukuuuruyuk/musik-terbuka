/**
 * Export
 */
class ExportRoute {
  /**
   * Export route
   *
   * @param {any} handler Hapi handler
   */
  constructor(handler) {
    this._h = handler;
  }

  /**
   * Routes collection
   *
   * @param {any} options Handler options
   * @return {Array} Export route
   */
  routes(options) {
    return [
      {
        method: 'POST',
        path: '/export/playlists/{playlistId}',
        handler: this._h.postExportPlaylistHandler,
        options: {
          auth: options.auth,
        },
      },
    ];
  }
}

module.exports = {ExportRoute};
