/**
 * Authentication
 */
class AuthenticationRoute {
  /**
   * Authentication route
   *
   * @param {any} handler Hapi handler
   */
  constructor(handler) {
    this._h = handler;
  }

  /**
   * Routes collections
   *
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
