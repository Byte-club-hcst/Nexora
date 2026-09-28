const { S3Client } = require('@aws-sdk/client-s3');
const env = require('./env');

let s3Client = null;

// External S3/R2 connections are disabled for offline/standalone mode
if (process.env.USE_LIVE_R2 === 'true' && env.R2_ACCOUNT_ID && env.R2_ACCESS_KEY_ID && env.R2_SECRET_ACCESS_KEY) {
  s3Client = new S3Client({
    region: 'auto',
    endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: env.R2_ACCESS_KEY_ID,
      secretAccessKey: env.R2_SECRET_ACCESS_KEY,
    },
  });
} else {
  // Local standalone mock storage handler
  s3Client = {
    send: async (command) => {
      return { mock: true, commandName: command?.constructor?.name };
    },
  };
}

module.exports = {
  s3Client,
  bucketName: env.R2_BUCKET_NAME,
};
