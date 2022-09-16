/**
 * Album routes
 */
class AlbumRoute {
  /**
   * Method construcktor for album route
   * @param {*} handler props handler param
   */
  constructor(handler) {
    this._h = handler;
  }

  /**
   * for handler route
   * @return {ServerRoute[]} route data
   */
  routes() {
    return [
      {
        method: 'POST',
        path: '/albums',
        handler: this._h.postAlbumHandler,
      },
      {
        method: 'GET',
        path: '/albums/{id}',
        handler: this._h.getAlbumByIdHandler,
      },
      {
        method: 'PUT',
        path: '/albums/{id}',
        handler: this._h.putAlbumByIdHandler,
      },
      {
        method: 'DELETE',
        path: '/albums/{id}',
        handler: this._h.deleteAlbumByIdHandler,
      },
    ];
  }
}

module.exports = {AlbumRoute};
