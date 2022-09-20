const {InvariantError} = require('../../exception/invariant-error');

/**
 * Song validator
 */
class SongValidator {
  /**
   * method constructor for song validator
   * @param {any} schema Schema joi obejct
   */
  constructor(schema) {
    this._schema = schema;
  }

  /**
   * Validate song payload
   * @param {any} payload request payload
   */
  validateSongPayload(payload) {
    const {songPayloadSchema} = this._schema;
    const validationResult = songPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  }
}

module.exports = {SongValidator};
