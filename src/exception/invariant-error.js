const {ClientError} = require('./client-error');

/**
 * Invariant exception
 */
class InvariantError extends ClientError {
  /**
   * Invarian error
   *
   * @param {any} message Error message
   */
  constructor(message) {
    super(message);
    this.name = 'InvariantError';
  }
}

module.exports = {InvariantError};
