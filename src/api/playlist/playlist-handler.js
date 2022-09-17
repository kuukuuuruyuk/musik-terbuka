/**
 * Playlist handler
 */
class PlaylistHandler {
  /**
   * Playlist constructor
   * @param {any} service Servis dep injesi
   * @param {any} validator validator dep injeksi
   */
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  /**
   * Menambahakan playlist
   */
  postPlaylistHandler() {}

  /**
   * Melihat daftar playlist yang dimiliki
   */
  getPlaylistsHandler() {}

  /**
   * Menghapus playlist
   */
  deletePlaylistHandler() {}

  /**
   * Menambahkan lagu ke playlist
   */
  postPlaylistSongHandler() {}

  /**
   * Menghapus lagu dari playlist
   */
  deletePlaylistSonghandler() {}
}

module.exports = {PlaylistHandler};
