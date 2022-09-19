const {ClientError} = require('./client-error');

/**
 * Class for handle not found errror
 */
class NotFoundError extends ClientError {
  /**
   * Method konstruktor not found error
   * @param {any} message message string
   */
  constructor(message) {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

module.exports = {NotFoundError};
