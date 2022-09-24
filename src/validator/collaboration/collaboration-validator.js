const {InvariantError} = require('../../exception/invariant-error');

/**
 * Collaboration
 */
class CollaborationValidator {
  /**
   * Collaboration validator
   *
   * @param {any} schema Joi schema
   */
  constructor(schema) {
    this._schema = schema;
  }

  /**
   * Validate post collaboration
   *
   * @param {any} payload Request payload
   */
  validatePostCollaboration(payload) {
    const {postCollaborationSchema} = this._schema;
    const validationResult = postCollaborationSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  }

  /**
   * Validate delete collaboration
   *
   * @param {any} payload Request Payload
   */
  validateDeleteCollaboration(payload) {
    const {deleteCollaborationSchema} = this._schema;
    const validationResult = deleteCollaborationSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  }
}

module.exports = {CollaborationValidator};
