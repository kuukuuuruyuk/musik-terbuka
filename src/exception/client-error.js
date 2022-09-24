/**
 * Client exception
 */
class ClientError extends Error {
  /**
   * Client error
   *
   * @param {string} message Error message
   * @param {number} statusCode Status code
   */
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ClientError';
  }
}

module.exports = {ClientError};
