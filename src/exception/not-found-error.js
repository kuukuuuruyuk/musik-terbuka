const {ClientError} = require('./client-error');

/**
 * Not found error exception
 */
class NotFoundError extends ClientError {
  /**
   * Not found error
   *
   * @param {string} message Error message
   */
  constructor(message) {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

module.exports = {NotFoundError};
