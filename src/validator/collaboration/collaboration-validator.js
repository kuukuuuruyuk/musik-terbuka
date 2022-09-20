const {InvariantError} = require('../../exception/invariant-error');

/**
 * Collaboration validator
 */
class CollaborationValidator {
  /**
   * Collaboration construcktor
   * @param {any} schema schema validator
   */
  constructor(schema) {
    this._schema = schema;
  }

  /**
   * Validate collaboration
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
   * Validate dele collaboration
   * @param {any} payload request payload
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
