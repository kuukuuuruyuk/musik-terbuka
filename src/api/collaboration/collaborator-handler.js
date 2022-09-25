/**
 * Api plugin collaboration
 */
class CollaborationHandler {
  /**
   * Collaborator handler
   *
   * @param {any} service Service provider
   * @param {any} validator Joi validator
   */
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postCollaborationHandler = this.postCollaborationHandler.bind(this);
    this.deleteCollaborationHandler =
      this.deleteCollaborationHandler.bind(this);
  }

  /**
   * Create collaborator
   *
   * @param {Request} request Request payload
   * @param {any} h Hapi handler
   * @return {any} Collaborator data
   */
  async postCollaborationHandler(request, h) {
    const {payload, auth} = request;
    const {collaborationValidator} = this._validator;

    collaborationValidator.validatePostCollaboration(payload);

    const {id: credentialId} = auth.credentials;
    const {playlistId, userId} = payload;
    const {
      playlistService,
      userService,
      collaborationService,
    } = this._service;
    await playlistService.verifyPlaylistOwner(playlistId, credentialId);
    await userService.verifyExistingUserWithUserId(userId);
    const id =
      await collaborationService.storeCollaboration(playlistId, userId);

    const _response = h.response({
      status: 'success',
      message: 'Kolaborasi berhasil ditambahkan',
      data: {collaborationId: id},
    });

    _response.code(201);
    return _response;
  }

  /**
   * Delete collaboration
   *
   * @param {Request} request Request payload
   * @param {any} h Hapi handler
   * @return {any} Collaboration data
   */
  async deleteCollaborationHandler(request, h) {
    const {payload, auth} = request;

    this._validator.collaborationValidator.validateDeleteCollaboration(payload);

    const {id: credentialId} = auth.credentials;
    const {playlistId, userId} = payload;
    const {playlistService, collaborationService} = this._service;

    await playlistService.verifyPlaylistOwner(playlistId, credentialId);
    await collaborationService.deleteCollaboration(playlistId, userId);

    const _response = h.response({
      status: 'success',
      message: 'Kolaborasi berhasil dihapus',
    });

    return _response;
  }
}

module.exports = {CollaborationHandler};
