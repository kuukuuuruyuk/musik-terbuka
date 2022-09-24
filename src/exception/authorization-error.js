const {ClientError} = require('./client-error');

/**
 * Authorization exception
 */
class AuthorizationError extends ClientError {
  /**
   * Authorization error
   * @param {string} message Error message
   */
  constructor(message) {
    super(message, 403);
    this.name = 'AuthorizationError';
  }
}

module.exports = {AuthorizationError};
