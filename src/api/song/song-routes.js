/**
 * Song routes
 */
class SongRoute {
  /**
   * method for handler song route construcktor
   * @param {any} handler hapi handeler route
   */
  constructor(handler) {
    this._h = handler;
  }

  /**
   * Method for handler routes
   * @return {any} hapi server route
   */
  routes() {
    const h = this._h;

    return [
      {
        method: 'POST',
        path: '/songs',
        handler: h.postSongHandler,
      },
      {
        method: 'GET',
        path: '/songs',
        handler: h.getSongsHandler,
      },
      {
        method: 'GET',
        path: '/songs/{id}',
        handler: h.getSongByIdHandler,
      },
      {
        method: 'PUT',
        path: '/songs/{id}',
        handler: h.putSongByIdHandler,
      },
      {
        method: 'DELETE',
        path: '/songs/{id}',
        handler: h.deleteSongByIdHandler,
      },
    ];
  }
}

module.exports = {SongRoute};
