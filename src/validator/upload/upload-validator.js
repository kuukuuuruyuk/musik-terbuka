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
    const validationResult = this._schema.uploadHeaderSchema.validate(header);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  }
}

module.exports = {UploadValidator};
