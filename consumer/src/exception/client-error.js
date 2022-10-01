/**
 * Client exception
 */
class ClientError extends Error {
  /**
   * Client error
   *
   * @param {string} message Error message
   * @param {number} statusCode Error code
   */
  constructor(message, statusCode = 400) {
    super(message);
    this.name = 'Client Error';
    this.statusCode = statusCode;
  }
}

module.exports = {ClientError};
