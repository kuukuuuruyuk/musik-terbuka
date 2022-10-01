const Joi = require('joi');

const exportPLPayloadSchema = Joi.object({
  targetEmail: Joi.string()
      .email({tlds: true})
      .required(),
});

module.exports = {exportPLPayloadSchema};
