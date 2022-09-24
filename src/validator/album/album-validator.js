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
    const {albumPayloadSchema} = this._schema;
    const validationResult = albumPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  }
}

module.exports = {AlbumValidator};
