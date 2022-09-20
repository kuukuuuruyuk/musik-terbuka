const Joi = require('joi');

const truncatePayloadSchema = Joi.object({
  token: Joi.string().required(),
});

module.exports = {truncatePayloadSchema};
