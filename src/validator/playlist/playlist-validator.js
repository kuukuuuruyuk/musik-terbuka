const {InvariantError} = require('../../exception/invariant-error');

/**
 * Playlist validator
 */
class PlaylistValidator {
  /**
   * Playlist validator constructor
   * @param {any} schema Schema joi object
   */
  constructor(schema) {
    this._schema = schema;
  }

  /**
   * Validate playlist payload
   * @param {any} payload Request payload
   */
  validatePlaylistPayload(payload) {
    const {playlistPayloadSchema} = this._schema;
    const validationResult = playlistPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  }
}

module.exports = {PlaylistValidator};
