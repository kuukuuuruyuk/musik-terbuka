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

    this.postExportPlaylistHandler = this.postExportPlaylistHandler.bind(this);
  }

  /**
   * Cerate export
   *
   * @param {Request} request Request payload
   * @param {any} h Hapi handler
   * @return {any} Export data
   */
  async postExportPlaylistHandler(request, h) {
    this._validator.exportValidator.validateExportPLPayload(request.payload);

    const {params, auth, payload} = request;
    const playlistId = params?.playlistId;
    const targetEmail = payload?.targetEmail;
    const credentialId = auth.credentials?.id;
    const {playlistService, exportService} = this._service;

    await playlistService.verifyPlaylistAccess(playlistId, credentialId);
    await exportService.sendMessage('export:playlists', JSON.stringify({
      playlistId,
      targetEmail,
    }));

    return h.response({
      status: 'success',
      message: 'Permintaan Anda sedang kami proses',
    }).code(201);
  }
}

module.exports = {ExportSongsHandler};
