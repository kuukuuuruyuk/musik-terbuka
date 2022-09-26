const {nanoid} = require('nanoid');
const fs = require('fs');

/**
 * Upload service
 */
class UploadService {
  /**
   * Upload service
   *
   * @param {any} folder Folder apa ini
   */
  constructor(folder) {
    this._folder = folder.path;

    if (!fs.existsSync(folder.path)) {
      fs.mkdirSync(folder.path, {recursive: true});
    }
  }

  /**
   * Handle upload file
   *
   * @param {any} file File apa
   * @param {any} meta Meta apa
   * @return {Promise} Upload file success data
   */
  uploadFile(file, meta) {
    const filename = nanoid(10) + meta.filename;
    const directory = `${this._folder}/${filename}`;

    const fileStream = fs.createWriteStream(directory);

    return new Promise((resolve, reject) => {
      fileStream.on('error', (error) => reject(error));

      file.pipe(fileStream);
      file.on('end', () => resolve(filename));
    });
  }

  /**
   * Get upload path
   * @return {string} Folder direktori
   */
  uploadDir() {
    return this._folder;
  }
}

module.exports = {UploadService};
