/**
 * Listener
 */
class Listener {
  /**
   * Listener
   *
   * @param {any} service Playlist servis
   */
  constructor(service) {
    this._playistsService = service.playistsService;
    this._mailSender = service.mailSender;

    this.eventListener = this.eventListener.bind(this);
  }

  /**
   * Evant listener
   *
   * @param {string} message Message content
   */
  async eventListener(message) {
    try {
      const {playlistId, targetEmail} = JSON.parse(message.content.toString());
      const songs =
        await this._playistsService.getSongsFromPlaylistId(playlistId);
      const playlist = await this._playistsService.getPlaylistById(playlistId);
      await this._mailSender.sendEmail(targetEmail, JSON.stringify({
        playlist: {
          ...playlist,
          songs,
        },
      }));
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = {Listener};
