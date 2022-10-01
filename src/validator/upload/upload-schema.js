const Joi = require('joi');

const uploadHeaderSchema = Joi.object({
  'content-type': Joi.string()
      .valid(
          'image/apng',
          'image/avif',
          'image/gif',
          'image/jpeg',
          'image/png',
          'image/svg+xml',
          'image/webp',
      )
      .required(),
}).unknown();

const imageHeadersSchema = Joi.object({
  'content-type': Joi.string()
      .valid(
          'image/apng',
          'image/avif',
          'image/gif',
          'image/jpeg',
          'image/png',
          'image/svg+xml',
          'image/webp',
          'image/jpg',
      ).required(),
}).unknown();

module.exports = {uploadHeaderSchema, imageHeadersSchema};
