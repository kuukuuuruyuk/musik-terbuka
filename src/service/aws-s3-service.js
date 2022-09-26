/**
 * S3 Storage service
 */
class AWSSimpleStorageService {
  /**
   * Storage service
   *
   * @param {any} aws Aws sdk
   */
  constructor(aws) {
    this._S3 = aws.s3;
    this._bucketName = aws.bucketName;
  }

  /**
   * Write file
   *
   * @param {any} file File description
   * @param {any} meta Meta data
   * @return {Promise} Upload data
   */
  writeFile(file, meta) {
    const parameter = {
      Bucket: this._bucketName,
      Key: +new Date() + meta.filename,
      Body: file._data,
      ContentType: meta.headers['content-type'],
    };

    const uploadLocation = new Promise((resolve, reject) => {
      this._S3.upload(parameter, (error, data) => {
        if (error) {
          return reject(error);
        }
        return resolve(data.Location);
      });
    });

    return uploadLocation;
  }
}

module.exports = {AWSSimpleStorageService};
