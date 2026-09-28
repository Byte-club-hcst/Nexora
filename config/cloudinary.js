// Cloudinary Configuration - External connections disabled for offline/standalone mode
if (process.env.USE_LIVE_CLOUDINARY === 'true' && process.env.CLOUDINARY_CLOUD_NAME) {
  const cloudinary = require('cloudinary').v2;
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  module.exports = cloudinary;
} else {
  // Local standalone mock uploader
  const { Writable } = require('stream');
  module.exports = {
    config: () => {},
    uploader: {
      upload_stream: (options, callback) => {
        const stream = new Writable({
          write(_chunk, _encoding, next) {
            next();
          },
        });
        stream.on('finish', () => {
          callback(null, {
            secure_url: `/mock-files/${options?.folder || 'uploads'}/${options?.public_id || 'file'}.png`,
            public_id: options?.public_id || 'mock-id',
          });
        });
        return stream;
      },
    },
  };
}