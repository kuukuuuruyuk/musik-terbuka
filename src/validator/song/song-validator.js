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
    const validation = this._schema.songPayloadSchema.validate(payload);

    if (validation.error) {
      throw new InvariantError(validation.error.message);
    }
  }
}

module.exports = {SongValidator};
