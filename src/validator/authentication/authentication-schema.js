const Joi = require('joi');

const postAuthPayloadSchema = Joi.object({
  username: Joi.string()
      .max(150)
      .required(),
  password: Joi.string().required(),
});

const putAuthPayloadSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

const deleteAuthPayloadSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

module.exports = {
  postAuthPayloadSchema,
  putAuthPayloadSchema,
  deleteAuthPayloadSchema,
};
