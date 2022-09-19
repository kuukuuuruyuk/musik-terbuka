/**
 * Authentication route
 */
class AuthenticationRoute {
  /**
   * Authentication route constructor
   * @param {any} handler Hapi server handler
   */
  constructor(handler) {
    this._h = handler;
  }

  /**
   * Authentication routes
   * @return {Array}
   */
  routes() {
    const h = this._h;

    return [
      {
        method: 'POST',
        path: '/authentications',
        handler: h.postAuthenticationHandler,
      },
      {
        method: 'PUT',
        path: '/authentications',
        handler: h.putAuthenticationHandler,
      },
      {
        method: 'DELETE',
        path: '/authentications',
        handler: h.deleteAuthenticationHandler,
      },
    ];
  }
}

module.exports = {AuthenticationRoute};
