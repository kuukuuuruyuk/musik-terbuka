/**
 * Album
 */
class AlbumRoute {
  /**
   * Album route
   *
   * @param {any} handler Hapi handler
   */
  constructor(handler) {
    this._h = handler;
  }

  /**
   * for handler route
   *
   * @param {any} options Options hapi handler
   * @return {ServerRoute[]} route data
   */
  routes(options) {
    const h = this._h;

    return [
      {
        method: 'POST',
        path: '/albums',
        handler: h.postAlbumHandler,
      },
      {
        method: 'GET',
        path: '/albums/{id}',
        handler: h.getAlbumByIdHandler,
      },
      {
        method: 'PUT',
        path: '/albums/{id}',
        handler: h.putAlbumByIdHandler,
      },
      {
        method: 'DELETE',
        path: '/albums/{id}',
        handler: h.deleteAlbumByIdHandler,
      },
      {
        path: '/albums/{id}/covers',
        method: 'POST',
        handler: h.postAlbumCoverHandler,
        options: {
          payload: {
            allow: 'multipart/form-data',
            multipart: true,
            // parse: true,
            output: 'stream',
            maxBytes: 512000,
          },
        },
      },
      {
        method: 'GET',
        path: '/albums/cover/{param*}',
        handler: {
          directory: {
            path: options.handler.path,
          },
        },
      },
      {
        path: '/albums/{id}/likes',
        method: 'POST',
        handler: h.postAlbumLikeHandler,
        options: {auth: options.auth},
      },
      {
        path: '/albums/{id}/likes',
        method: 'GET',
        handler: h.getAlbumLikesHandler,
      },
    ];
  }
}

module.exports = {AlbumRoute};
