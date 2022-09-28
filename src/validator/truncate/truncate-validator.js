const {InvariantError} = require('../../exception/invariant-error');

/**
 * Truncate
 */
class TruncateValidator {
  /**
   * Truncate validator
   *
   * @param {any} schema Joi schema
   */
  constructor(schema) {
    this._schema = schema;
  }

  /**
   * Validate truncate payload
   *
   * @param {any} payload Request payload
   */
  validatePayload(payload) {
    const validation = this._schema.truncatePayloadSchema.validate(payload);

    if (validation.error) {
      throw new InvariantError(validation.error.message);
    }
  }
}

module.exports = {TruncateValidator};
