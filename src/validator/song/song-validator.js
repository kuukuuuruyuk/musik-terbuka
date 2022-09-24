const {InvariantError} = require('../../exception/invariant-error');

/**
 * Song
 */
class SongValidator {
  /**
   * Song validator
   *
   * @param {any} schema Joi schema
   */
  constructor(schema) {
    this._schema = schema;
  }

  /**
   * Validate song payload
   *
   * @param {any} payload Request payload
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
