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
    const {collaborationValidator} = this._validator;

    collaborationValidator.validatePostCollaboration(request.payload);

    const {payload, auth} = request;
    const {playlistId, userId} = payload;
    const credentialId = auth.credentials?.id;
    const {playlistService, userService, collaborationService} = this._service;
    const [,, collaborationId] = await Promise.all([
      playlistService.verifyPlaylistOwner(playlistId, credentialId),
      userService.verifyExistingUserWithUserId(userId),
      collaborationService.storeCollaboration(playlistId, userId),
    ]);

    return h.response({
      status: 'success',
      message: 'Kolaborasi berhasil ditambahkan',
      data: {collaborationId},
    }).code(201);
  }

  /**
   * Delete collaboration
   *
   * @param {Request} request Request payload
   * @param {any} h Hapi handler
   * @return {any} Collaboration data
   */
  async deleteCollaborationHandler(request, h) {
    const collabValidator = this._validator.collaborationValidator;

    collabValidator.validateDeleteCollaboration(request.payload);

    const {payload, auth} = request;
    const {playlistId, userId} = payload;
    const credentialId = auth.credentials?.id;
    const {playlistService, collaborationService} = this._service;

    await Promise.all([
      playlistService.verifyPlaylistOwner(playlistId, credentialId),
      collaborationService.deleteCollaboration(playlistId, userId),
    ]);

    return h.response({
      status: 'success',
      message: 'Kolaborasi berhasil dihapus',
    });
  }
}

module.exports = {CollaborationHandler};
