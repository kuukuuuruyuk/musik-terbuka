const {InvariantError} = require('../../exception/invariant-error');

/**
 * Authemtication validator
 */
class AuthenticationValidator {
  /**
   * Authentication validator construktor
   * @param {any} schema Schema join object
   */
  constructor(schema) {
    this._schema = schema;
  }

  /**
   * Validate post auth
   * @param {any} payload payload request
   */
  validatePostAuthPayload(payload) {
    const {postAuthPayloadSchema} = this._schema;
    const validationResult = postAuthPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  }

  /**
   * Validate update payload
   * @param {any} payload Payload request
   */
  validatePutAuthPayload(payload) {
    const {putAuthPayloadSchema} = this._schema;
    const validationResult = putAuthPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  }

  /**
   * Validate delete payload
   * @param {any} payload Payload request
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
