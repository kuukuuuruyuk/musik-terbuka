const ClientError = require('./client-error');

/**
 * Clas Form andler invarian error
 */
class InvariantError extends ClientError {
  /**
   * method constructor for Invarian Error
   * @param {any} message param error string
   */
  constructor(message) {
    super(message);
    this.name = 'InvariantError';
  }
}

module.exports = InvariantError;
