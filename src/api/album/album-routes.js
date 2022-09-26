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
   * @return {ServerRoute[]} route data
   */
  routes() {
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
        handler: h.postAlbumCover,
      },
      {
        path: '/albums/{id}/likes',
        method: 'POST',
        handler: h.postAlbumLikes,
      },
      {
        path: '/albums/{id}/likes',
        method: 'GET',
        handler: h.showAlbumLikes,
      },
    ];
  }
}

module.exports = {AlbumRoute};
