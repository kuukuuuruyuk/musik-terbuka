const {InvariantError} = require('../../exception/invariant-error');

/**
 * Album validator
 */
class AlbumValidator {
  /**
   * Album construktor
   * @param {any} schema Schema joi object
   */
  constructor(schema) {
    this._schema = schema;
  }
  /**
   * VAlidate album payload
   * @param {any} payload requesty payload
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
