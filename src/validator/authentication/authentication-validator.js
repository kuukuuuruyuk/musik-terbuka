const {InvariantError} = require('../../exception/invariant-error');

/**
 * Authentication
 */
class AuthenticationValidator {
  /**
   * Authentication validator
   *
   * @param {any} schema Schema joi
   */
  constructor(schema) {
    this._schema = schema;
  }

  /**
   * Validate post auth
   *
   * @param {any} payload Request payload
   */
  validatePostAuthPayload(payload) {
    const validator = this._schema.postAuthPayloadSchema.validate(payload);

    if (validator.error) {
      throw new InvariantError(validator.error.message);
    }
  }

  /**
   * Validate update authentication
   *
   * @param {any} payload Request payload
   */
  validatePutAuthPayload(payload) {
    const validation = this._schema.putAuthPayloadSchema.validate(payload);

    if (validation.error) {
      throw new InvariantError(validation.error.message);
    }
  }

  /**
   * Validate delete
   *
   * @param {any} payload Request payload
   */
  validateDeleteAuthPayload(payload) {
    const validation =
      this._schema.deleteAuthPayloadSchema.validate(payload);

    if (validation.error) {
      throw new InvariantError(validation.error.message);
    }
  }
}

module.exports = {AuthenticationValidator};
