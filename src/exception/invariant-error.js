const {ClientError} = require('./client-error');

/**
 * Invariant exception
 */
class InvariantError extends ClientError {
  /**
   * Invarian error
   *
   * @param {string} message Error message
   */
  constructor(message) {
    super(message);
    this.name = 'InvariantError';
  }
}

module.exports = {InvariantError};
