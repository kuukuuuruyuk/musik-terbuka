const path = require('path');

/**
 * UploadRoute
 */
class UploadRoute {
  /**
   * Upload route
   *
   * @param {any} handler Hapi handler
   */
  constructor(handler) {
    this._h = handler;
  }

  /**
   * Routes collection
   *
   * @return {Array} Hapi Route
   */
  routes() {
    const handler = this._h;

    return [
      {
        method: 'POST',
        path: '/upload/pictures',
        handler: handler.postUploadImagesHandler,
        options: {
          payload: {
            allow: 'multipart/form-data',
            multipart: true,
            maxBytes: 500000,
            output: 'stream',
          },
        },
      },
      {
        method: 'GET',
        path: '/upload/{param*}',
        handler: {
          directory: {
            path: path.resolve(__dirname, '/../public/storage'),
          },
        },
      },
    ];
  }
}

module.exports = {UploadRoute};
