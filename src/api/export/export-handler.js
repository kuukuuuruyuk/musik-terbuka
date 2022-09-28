/**
 * Export song handler
 */
class ExportSongsHandler {
  /**
   * Export song validator
   *
   * @param {any} service Export service
   * @param {any} validator Export validator
   */
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postExportSongsHandler = this.postExportSongsHandler.bind(this);
  }

  /**
   * Cerate export
   *
   * @param {Request} request Request payload
   * @param {any} h Hapi handler
   * @return {any} Export data
   */
  async postExportSongsHandler(request, h) {
    this._validator.exportValidator.validateExportSongsPayload(request.payload);

    const {params, auth} = request;
    const playlistId = params?.playlistId;
    const {playlistsService, exportService} = this._service;

    await Promise.all([
      playlistsService.verifyPlaylistAccess(playlistId, auth.credentials?.id),
      exportService.sendMessage('export:playlists', JSON.stringify({
        playlistId,
        targetEmail: payload.targetEmail,
      })),
    ]);

    return h.response({
      status: 'success',
      message: 'Permintaan Anda sedang kami proses',
    }).code(201);
  }
}

module.exports = {ExportSongsHandler};
