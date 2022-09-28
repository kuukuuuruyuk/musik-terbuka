const {InvariantError} = require('../../exception/invariant-error');

/**
 * Playlist
 */
class PlaylistValidator {
  /**
   * Playlist validator
   *
   * @param {any} schema Joi schema object
   */
  constructor(schema) {
    this._schema = schema;
  }

  /**
   * Validate post playlist
   *
   * @param {any} payload Request payload
   */
  validatePostPlaylist(payload) {
    const validation = this._schema.postPlaylistSchema.validate(payload);

    if (validation.error) {
      throw new InvariantError(validation.error.message);
    }
  }

  /**
   * Validate post song to playlist
   *
   * @param {any} payload Request payload
   */
  validatePostSongToPlaylist(payload) {
    const validation = this._schema.postSongToPlaylistSchema.validate(payload);

    if (validation.error) {
      throw new InvariantError(validation.error.message);
    }
  }

  /**
   * Validate delete song from playlist
   *
   * @param {any} payload Request payload
   */
  validateDeleteSongFromPlaylist(payload) {
    const validation =
      this._schema.deleteSongFromPlaylistSchema.validate(payload);

    if (validation.error) {
      throw new InvariantError(validation.error.message);
    }
  }
}

module.exports = {PlaylistValidator};
