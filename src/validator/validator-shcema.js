const {albumPayloadSchema} = require('./album/album-schema');
const {
  authenticationPayloadSchema,
  authTokenPayloadSchema,
} = require('./authentication/authentication-schema');
const {playlistPayloadSchema} = require('./playlist/playlist-schema');
const {songPayloadSchema} = require('./song/song-schema');
const {userPayloadSchema} = require('./user/user-schema');

module.exports = {
  userPayloadSchema,
  songPayloadSchema,
  albumPayloadSchema,
  authenticationPayloadSchema,
  authTokenPayloadSchema,
  playlistPayloadSchema,
};
