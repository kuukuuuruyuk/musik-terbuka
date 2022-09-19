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
   * Validate auth payload
   * @param {any} payload Request payload
   */
  validateAuthPayload(payload) {
    const {authenticationPayloadSchema} = this._schema;
    const validationResult = authenticationPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  }

  /**
   * Validate token payload
   * @param {any} payload Request payload
   */
  validateAuthTokenPayload(payload) {
    const {authTokenPayloadSchema} = this._schema;
    const validationResult = authTokenPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  }
}

module.exports = {AuthenticationValidator};
