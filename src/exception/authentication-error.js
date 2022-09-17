const {ClientError} = require('./client-error');

/**
 * Authentication error
 */
class AuthenticationError extends ClientError {
  /**
   * Authentication error constructor
   * @param {string} message Message for error
   */
  constructor(message) {
    super(message, 401);
    this.name = 'AuthenticationError';
  }
}

module.exports = {AuthenticationError};
