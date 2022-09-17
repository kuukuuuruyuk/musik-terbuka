/**
 * Class fr handler client error
 */
class ClientError extends Error {
  /**
   * method constructor client error
   * @param {any} message show message error
   * @param {number} statusCode number status code
   */
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ClientError';
  }
}

module.exports = {ClientError};
