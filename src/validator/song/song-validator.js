const InvariantError = require('../../exception/invariant-error');
const {songPayloadSchema} = require('./song-schema');

const songValidator = {
  validateSongPayload: (payload) => {
    const validationResult = songPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = {songValidator};
