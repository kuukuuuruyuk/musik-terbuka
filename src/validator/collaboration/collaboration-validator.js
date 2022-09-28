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
    const validation = this._schema.postCollaborationSchema.validate(payload);

    if (validation.error) {
      throw new InvariantError(validation.error.message);
    }
  }

  /**
   * Validate delete collaboration
   *
   * @param {any} payload Request Payload
   */
  validateDeleteCollaboration(payload) {
    const validation = this._schema.deleteCollaborationSchema.validate(payload);

    if (validation.error) {
      throw new InvariantError(validation.error.message);
    }
  }
}

module.exports = {CollaborationValidator};
