const {ClientError} = require('./client-error');

/**
 * Authentication exception
 */
class AuthenticationError extends ClientError {
  /**
   * Authentication error
   *
   * @param {string} message Error message
   */
  constructor(message) {
    super(message, 401);
    this.name = 'AuthenticationError';
  }
}

module.exports = {AuthenticationError};
