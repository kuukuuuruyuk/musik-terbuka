const {InvariantError} = require('../../exception/invariant-error');

/**
 * Upload validator
 */
class UploadValidator {
  /**
   * Upload validator
   *
   * @param {any} schema Validator schema
   */
  constructor(schema) {
    this._schema = schema;
  }

  /**
   * validate upload hader
   * @param {any} header Header request
   */
  validateUploadHeaderSchema(header) {
    const validation = this._schema.uploadHeaderSchema.validate(header);

    if (validation.error) {
      throw new InvariantError(validation.error.message);
    }
  }
}

module.exports = {UploadValidator};
