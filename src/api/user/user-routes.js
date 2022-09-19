/**
 * User routes
 */
class UserRoute {
  /**
   * User routes constructor
   * @param {any} handler handler param
   */
  constructor(handler) {
    this._h = handler;
  }

  /**
   * Routes
   * @return {Array}
   */
  routes() {
    const h = this._h;

    return [
      {
        method: 'POST',
        path: '/users',
        handler: h.postUserHandler,
      },
    ];
  }
}

module.exports = {UserRoute};
