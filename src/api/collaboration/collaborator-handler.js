const {failedWebResponse} = require('../../utils/web-response');

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
    try {
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
    } catch (error) {
      console.log(error);
      return failedWebResponse(error, h);
    }
  }

  /**
   * Delete collaborator
   * @param {Request} request Request user
   * @param {any} h Hapi handler
   * @return {any}
   */
  async deleteCollaborationHandler(request, h) {
    try {
      const {payload, auth} = request;
      const {collaborationValidator} = this._validator;

      collaborationValidator.validateDeleteCollaboration(payload);

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
    } catch (error) {
      return failedWebResponse(error, h);
    }
  }
}

module.exports = {CollaborationHandler};
