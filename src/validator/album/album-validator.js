const {InvariantError} = require('../../exception/invariant-error');

/**
 * Album
 */
class AlbumValidator {
  /**
   * Album validator
   *
   * @param {any} schema Schema joi
   */
  constructor(schema) {
    this._schema = schema;
  }
  /**
   * Validate album payload
   *
   * @param {any} payload Request payload
   */
  validateAlbumPayload(payload) {
    const validator = this._schema.albumPayloadSchema.validate(payload);

    if (validator.error) {
      throw new InvariantError(validator.error.message);
    }
  }
}

module.exports = {AlbumValidator};
