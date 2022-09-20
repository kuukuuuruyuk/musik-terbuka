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
   * Validate post playlist
   * @param {any} payload Request payload
   */
  validatePostPlaylist(payload) {
    const {postPlaylistSchema} = this._schema;
    const validationResult = postPlaylistSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  }

  /**
   * Validate post song to playlist
   * @param {any} payload payload request
   */
  validatePostSongToPlaylist(payload) {
    const {postSongToPlaylistSchema} = this._schema;
    const validationResult = postSongToPlaylistSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  }

  /**
   * validate delete song from playlist
   * @param {any} payload Request payload
   */
  validateDeleteSongFromPlaylist(payload) {
    const {deleteSongFromPlaylistSchema} = this._schema;
    const validationResult = deleteSongFromPlaylistSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  }
}

module.exports = {PlaylistValidator};
