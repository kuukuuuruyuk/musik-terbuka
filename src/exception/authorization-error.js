const {ClientError} = require('./client-error');

/**
 * Authorization error
 */
class AuthorizationError extends ClientError {
  /**
   * Authoriazation constructor
   * @param {string} message Pesan error
   */
  constructor(message) {
    super(message, 403);
    this.name = 'AuthorizationError';
  }
}

module.exports = {AuthorizationError};
