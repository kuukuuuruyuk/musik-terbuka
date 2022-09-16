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
    return [
      {
        method: 'POST',
        path: '/songs',
        handler: this._h.postSongHandler,
      },
      {
        method: 'GET',
        path: '/songs',
        handler: this._h.getSongsHandler,
      },
      {
        method: 'GET',
        path: '/songs/{id}',
        handler: this._h.getSongByIdHandler,
      },
      {
        method: 'PUT',
        path: '/songs/{id}',
        handler: this._h.putSongByIdHandler,
      },
      {
        method: 'DELETE',
        path: '/songs/{id}',
        handler: this._h.deleteSongByIdHandler,
      },
    ];
  }
}

module.exports = {SongRoute};
