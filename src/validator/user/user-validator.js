const {InvariantError} = require('../../exception/invariant-error');

/**
 * User
 */
class UserValidator {
  /**
   * User validator
   *
   * @param {any} schema Joi schema
   */
  constructor(schema) {
    this._schema = schema;
  }

  /**
   * Validate user payload
   *
   * @param {any} payload Request payload
   */
  validateUserPayload(payload) {
    const validation = this._schema.userPayloadSchema.validate(payload);

    if (validation.error) {
      throw new InvariantError(validation.error.message);
    }
  }
}

module.exports = {UserValidator};
