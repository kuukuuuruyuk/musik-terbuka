/**
 * Collab routes
 */
class CollaborationRoute {
  /**
   * Collaboration route
   * @param {any} handler hapi handler
   */
  constructor(handler) {
    this._h = handler;
  }

  /**
   * Route handler
   * @param {any} options handler option param
   * @return {Array}
   */
  routes(options) {
    const h = this._h;
    const auth = options.auth;

    return [
      {
        method: 'POST',
        path: '/collaborations',
        handler: h.postCollaborationHandler,
        options: {auth},
      },
      {
        method: 'DELETE',
        path: '/collaborations',
        handler: h.deleteCollaborationHandler,
        options: {auth},
      },
    ];
  }
}

module.exports = {CollaborationRoute};
