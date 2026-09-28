const path = require('path');
const { v4: uuidv4 } = require('uuid');

const FILE_LIMITS = {
  paymentProof: {
    maxBytes: 5 * 1024 * 1024, // 5MB
    allowedMimes: ['image/jpeg', 'image/png'],
    allowedExts: ['.jpg', '.jpeg', '.png'],
  },
  abstractFile: {
    maxBytes: 10 * 1024 * 1024, // 10MB
    allowedMimes: ['application/pdf'],
    allowedExts: ['.pdf'],
  },
  posterFile: {
    maxBytes: 10 * 1024 * 1024, // 10MB
    allowedMimes: ['application/pdf', 'image/jpeg', 'image/png'],
    allowedExts: ['.pdf', '.jpg', '.jpeg', '.png'],
  },
};

/**
 * Detect file type using magic bytes (file signature)
 */
function detectMagicBytes(buffer) {
  if (!buffer || buffer.length < 4) return null;

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4E &&
    buffer[3] === 0x47
  ) {
    return 'image/png';
  }

  // JPEG: FF D8 FF
  if (
    buffer[0] === 0xFF &&
    buffer[1] === 0xD8 &&
    buffer[2] === 0xFF
  ) {
    return 'image/jpeg';
  }

  // PDF: 25 50 44 46 (%PDF)
  if (
    buffer[0] === 0x25 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x44 &&
    buffer[3] === 0x46
  ) {
    return 'application/pdf';
  }

  return null;
}

/**
 * Validate an uploaded file against constraints
 */
function validateFile(file, type) {
  const config = FILE_LIMITS[type];
  if (!config) {
    return { valid: false, error: `Unknown file category: ${type}` };
  }

  if (!file || !file.buffer) {
    return { valid: false, error: 'No file buffer received.' };
  }

  // Size validation
  if (file.buffer.length > config.maxBytes) {
    const maxMb = config.maxBytes / (1024 * 1024);
    return { valid: false, error: `File exceeds maximum allowed size of ${maxMb}MB.` };
  }

  // Extension validation
  const ext = path.extname(file.originalname || '').toLowerCase();
  if (!config.allowedExts.includes(ext)) {
    return { valid: false, error: `Invalid file extension (${ext}). Allowed: ${config.allowedExts.join(', ')}` };
  }

  // Magic bytes inspection
  const detectedType = detectMagicBytes(file.buffer);
  if (!detectedType || !config.allowedMimes.includes(detectedType)) {
    return {
      valid: false,
      error: `File signature mismatch. The file content does not match allowed types (${config.allowedMimes.join(', ')}).`,
    };
  }

  return { valid: true, detectedType, ext };
}

/**
 * Generate a secure, sanitized, UUID-based storage key
 */
function generateStorageKey(category, uid, ext) {
  const cleanExt = ext.startsWith('.') ? ext.toLowerCase() : `.${ext.toLowerCase()}`;
  const fileId = uuidv4();

  switch (category) {
    case 'payment-proof':
      return `payment-proofs/${uid}/${fileId}${cleanExt}`;
    case 'abstract':
      return `submissions/${uid}/abstracts/${fileId}.pdf`;
    case 'poster':
      return `submissions/${uid}/posters/${fileId}${cleanExt}`;
    case 'speaker':
      return `speakers/${fileId}${cleanExt}`;
    case 'gallery':
      return `gallery/${fileId}${cleanExt}`;
    default:
      return `documents/${fileId}${cleanExt}`;
  }
}

module.exports = {
  FILE_LIMITS,
  detectMagicBytes,
  validateFile,
  generateStorageKey,
};
