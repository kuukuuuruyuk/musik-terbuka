const {InvariantError} = require('../../exception/invariant-error');

/**
 * User Validator
 */
class UserValidator {
  /**
   * User validator construktor
   * @param {any} schema Joi schema dep injeksi
   */
  constructor(schema) {
    this._schema = schema;
  }

  /**
   * Validate user payload
   * @param {any} payload Request payload
   */
  validateUserPayload(payload) {
    const {userPayloadSchema} = this._schema;
    const validationResult = userPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  }
}

module.exports = {UserValidator};
