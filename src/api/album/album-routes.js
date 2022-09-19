/**
 * Album routes
 */
class AlbumRoute {
  /**
   * Method construcktor for album route
   * @param {any} handler props handler param
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
    ];
  }
}

module.exports = {AlbumRoute};
