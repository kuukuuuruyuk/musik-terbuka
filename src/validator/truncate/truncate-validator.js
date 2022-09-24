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
    const {truncatePayloadSchema} = this._schema;
    const validationResult = truncatePayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  }
}

module.exports = {TruncateValidator};
