const {exportSongPayloadSchema} = require('./export/export-schema');
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
  deleteSongFromPlaylistSchema,
} = require('./playlist/playlist-schema');
const {songPayloadSchema} = require('./song/song-schema');
const {truncatePayloadSchema} = require('./truncate/truncate-schema');
const {userPayloadSchema} = require('./user/user-schema');
const {uploadHeaderSchema} = require('./upload/upload-schema');

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
  truncatePayloadSchema,
  deleteSongFromPlaylistSchema,
  exportSongPayloadSchema,
  uploadHeaderSchema,
};

module.exports = validatorSchema;
