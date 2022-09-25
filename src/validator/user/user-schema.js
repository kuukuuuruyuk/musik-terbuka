const Joi = require('joi');

const userPayloadSchema = Joi.object({
  username: Joi.string()
      .max(150)
      .required(),
  password: Joi.string().required(),
  fullname: Joi.string()
      .max(255)
      .required(),
});

module.exports = {userPayloadSchema};
