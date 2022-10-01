const {ClientError} = require('./client-error');

/**
 * Not found exception
 */
class NotFoundError extends ClientError {
  /**
   * Not founde error
   *
   * @param {string} message Error message
   */
  constructor(message) {
    super(message, 404);
    this.name = 'Not Found Error';
  }
}

module.exports = {NotFoundError};
