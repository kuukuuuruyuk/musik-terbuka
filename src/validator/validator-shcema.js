const {albumPayloadSchema} = require('./album/album-schema');
const {
  putAuthPayloadSchema,
  postAuthPayloadSchema,
  deleteAuthPayloadSchema,
} = require('./authentication/authentication-schema');
const {
  postCollaborationSchema,
  deleteCollaborationSchema,
} = require('./collaboration/collaboration-schema');
const {
  postPlaylistSchema,
  postSongToPlaylistSchema,
} = require('./playlist/playlist-schema');
const {songPayloadSchema} = require('./song/song-schema');
const {userPayloadSchema} = require('./user/user-schema');

const validatorSchema = {
  userPayloadSchema,
  songPayloadSchema,
  albumPayloadSchema,
  postPlaylistSchema,
  postSongToPlaylistSchema,
  putAuthPayloadSchema,
  postAuthPayloadSchema,
  deleteAuthPayloadSchema,
  postCollaborationSchema,
  deleteCollaborationSchema,
};

module.exports = validatorSchema;
