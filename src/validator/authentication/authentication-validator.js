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
    const {postAuthPayloadSchema} = this._schema;
    const validationResult = postAuthPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  }

  /**
   * Validate update authentication
   *
   * @param {any} payload Request payload
   */
  validatePutAuthPayload(payload) {
    const {putAuthPayloadSchema} = this._schema;
    const validationResult = putAuthPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  }

  /**
   * Validate delete
   *
   * @param {any} payload Request payload
   */
  validateDeleteAuthPayload(payload) {
    const {deleteAuthPayloadSchema} = this._schema;
    const validationResult = deleteAuthPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  }
}

module.exports = {AuthenticationValidator};
