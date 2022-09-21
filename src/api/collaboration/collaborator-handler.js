/**
 * Collaboration handler
 */
class CollaborationHandler {
  /**
   * Collaborator handler
   * @param {any} service Service provider
   * @param {any} validator Join validator
   */
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postCollaborationHandler = this.postCollaborationHandler.bind(this);
    this.deleteCollaborationHandler =
      this.deleteCollaborationHandler.bind(this);
  }

  /**
   * post collaborator hand;ler
   * @param {Request} request Request client
   * @param {any} h
   * @return {any}
   */
  async postCollaborationHandler(request, h) {
    const {payload, auth} = request;
    this._validator.validatePostCollaborationSchema(payload);

    const {id: credentialId} = auth.credentials;
    const {playlistId, userId} = payload;

    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    await this._usersServices.verifyExistingUserWithUserId(userId);
    const id =
      await this._collaborationsService.addCollaboration(playlistId, userId);

    const _response = h.response({
      status: 'success',
      message: 'Kolaborasi berhasil ditambahkan',
      data: {
        collaborationId: id,
      },
    });

    _response.code(201);
    return _response;
  }

  /**
   * Delete collaborator
   * @param {Request} request Request user
   * @param {any} h Hapi handler
   * @return {any}
   */
  async deleteCollaborationHandler(request, h) {
    const {payload, auth} = request;
    this._validator.validateDeleteCollaborationSchema(payload);

    const {id: credentialId} = auth.credentials;
    const {playlistId, userId} = payload;

    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    await this._collaborationsService.deleteCollaboration(playlistId, userId);

    const _response = h.response({
      status: 'success',
      message: 'Kolaborasi berhasil dihapus',
    });

    return _response;
  }
}

module.exports = {CollaborationHandler};
