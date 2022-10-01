const {ClientError} = require('./client-error');

/**
 * Invariant exception
 */
class InvariantError extends ClientError {
  /**
   * Invariant error
   *
   * @param {string} message Error message
   */
  constructor(message) {
    super(message);
    this.name = 'Invariant Error';
  }
}

module.exports = {InvariantError};
