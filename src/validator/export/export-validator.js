const {InvariantError} = require('../../exception/invariant-error');

/**
 * Export validator
 */
class ExportValidator {
  /**
   * Export validator
   *
   * @param {any} schema Schema payload
   */
  constructor(schema) {
    this._schema = schema;
  }

  /**
   * Validate export playlist
   *
   * @param {any} payload Request payload
   */
  validateExportSongsPayload(payload) {
    const validation = this._shema.exportSongPayloadSchema.validate(payload);

    if (validation.error) {
      throw new InvariantError(validation.error.message);
    }
  }
};

module.exports = {ExportValidator};
