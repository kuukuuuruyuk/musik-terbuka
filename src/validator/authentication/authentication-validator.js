const {InvariantError} = require('../../exception/invariant-error');
const {authenticationPayloadSchema} = require('./authentication-schema');

const authenticationValidator = {
  validateSongPayload: (payload) => {
    const validationResult = authenticationPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = {authenticationValidator};
