const InvariantError = require('../../exception/invariant-error');
const {albumPayloadSchema} = require('./album-schema');

const albumValidator = {
  validateAlbumPayload: function(payload) {
    const validationResult = albumPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = {albumValidator};
