const {InvariantError} = require('../../exception/invariant-error');
const {playlistPayloadSchema} = require('./playlist-schema');

const playlistValidator = {
  validateSongPayload: (payload) => {
    const validationResult = playlistPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = {playlistValidator};
