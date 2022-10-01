const {nanoid} = require('nanoid');
const fs = require('fs');

/**
 * Upload service
 */
class UploadService {
  /**
   * Upload service
   *
   * @param {any} config Folder apa ini
   */
  constructor(config) {
    this._folder = config.path;
    this._coverUploadFolder = config.album;

    // Url
    this._coverUrl = config.coverUrl;

    if (!fs.existsSync(config.path)) {
      fs.mkdirSync(config.path, {recursive: true});
    }

    if (!fs.existsSync(config.album)) {
      fs.mkdirSync(config.album, {recursive: true});
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
   * Handle upload file
   *
   * @param {any} file File apa
   * @return {Promise} Upload file success data
   */
  uploadCover(file) {
    const filename = `cover-${nanoid(12)}-${file.hapi.filename}`;
    const fileStream =
      fs.createWriteStream(`${this._coverUploadFolder}\\${filename}`);

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

  /**
   * Cover
   *
   * @param {string} filename Cover
   * @return {string} Cover location
   */
  coverDir(filename) {
    return `${this._coverUploadFolder}\\${filename}`;
  }

  /**
   * Set cover url
   *
   * @param {string} cover Album cover
   * @return {string} Album cover url
   */
  coverUrl(cover) {
    return `${this._coverUrl}/${cover}`;
  }

  /**
   * Hapus file cover album
   *
   * @param {string} cover Album cover
   */
  unlinkCover(cover) {
    this.getFilesInDirectory();
    fs.unlink(`${this._coverUploadFolder}\\${cover}`, (error) => {
      if (error) {
        console.log(error);
      } else {
        console.log(`\nDeleted file cover ${cover}`);
        // Get the files in current directory
        // after deletion
        this.getFilesInDirectory();
      }
    });
  }

  /**
   * Get dir
   */
  getFilesInDirectory() {
    console.log('\nFiles present in directory:');
    const files = fs.readdirSync(this._coverUploadFolder);
    files.forEach((file) => {
      console.log(file);
    });
  }
}

module.exports = {UploadService};
