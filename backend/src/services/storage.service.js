const { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { s3Client, bucketName } = require('../config/r2');
const env = require('../config/env');

class StorageService {
  /**
   * Upload buffer to Cloudflare R2
   */
  async upload({ buffer, key, contentType, metadata = {} }) {
    if (!env.R2_ACCOUNT_ID) {
      // Mock upload for local test/dev without active credentials
      return {
        key,
        bucket: bucketName,
        mock: true,
      };
    }

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      Metadata: metadata,
    });

    await s3Client.send(command);
    return { key, bucket: bucketName };
  }

  /**
   * Download / fetch object stream from R2
   */
  async download({ key }) {
    if (!env.R2_ACCOUNT_ID) {
      return { Body: Buffer.from('mock data'), mock: true };
    }

    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    return await s3Client.send(command);
  }

  /**
   * Delete object from R2
   */
  async delete({ key }) {
    if (!env.R2_ACCOUNT_ID) {
      return { deleted: true, mock: true };
    }

    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    return await s3Client.send(command);
  }

  /**
   * Generate short-lived pre-signed URL (default 1 hour / 3600 seconds)
   */
  async generateSignedUrl({ key, expiresIn = 3600 }) {
    if (!key) return null;

    if (!env.R2_ACCOUNT_ID) {
      // Return safe mock signed URL for local/testing
      return `/api/mock-file-view?key=${encodeURIComponent(key)}`;
    }

    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    return await getSignedUrl(s3Client, command, { expiresIn });
  }
}

module.exports = new StorageService();
