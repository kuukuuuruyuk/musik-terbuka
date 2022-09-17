const {InvariantError} = require('../../exception/invariant-error');
const {userPayloadSchema} = require('./user-schema');

const userValidator = {
  validateSongPayload: (payload) => {
    const validationResult = userPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = {userValidator};
