const Joi = require('joi');

const postPlaylistSchema = Joi.object({
  name: Joi.string()
      .max(255)
      .required(),
});

const postSongToPlaylistSchema = Joi.object({
  songId: Joi.string().required(),
  playlistId: Joi.string(),
});

const deleteSongFromPlaylistSchema = Joi.object({
  songId: Joi.string().required(),
});

module.exports = {
  postPlaylistSchema,
  postSongToPlaylistSchema,
  deleteSongFromPlaylistSchema,
};
