const test = require('node:test');
const assert = require('node:assert/strict');
const {
  detectMagicBytes,
  validateFile,
  generateStorageKey,
} = require('../validators/file.validator');

test('File Validator: detectMagicBytes accurately identifies valid headers', () => {
  // Valid PNG header (89 50 4E 47 ...)
  const pngBuffer = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  assert.equal(detectMagicBytes(pngBuffer), 'image/png');

  // Valid JPEG header (FF D8 FF ...)
  const jpegBuffer = Buffer.from([0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10]);
  assert.equal(detectMagicBytes(jpegBuffer), 'image/jpeg');

  // Valid PDF header (%PDF -> 25 50 44 46)
  const pdfBuffer = Buffer.from([0x25, 0x50, 0x44, 0x46, 0x2D, 0x31, 0x2E, 0x37]);
  assert.equal(detectMagicBytes(pdfBuffer), 'application/pdf');

  // Spoofed file (text file disguised as image)
  const fakeBuffer = Buffer.from('GIF89a this is not a real image');
  assert.equal(detectMagicBytes(fakeBuffer), null);
});

test('File Validator: validateFile rejects file size exceeding limits', () => {
  const hugeBuffer = Buffer.alloc(6 * 1024 * 1024); // 6MB
  hugeBuffer[0] = 0x89;
  hugeBuffer[1] = 0x50;
  hugeBuffer[2] = 0x4E;
  hugeBuffer[3] = 0x47;

  const result = validateFile(
    { originalname: 'proof.png', buffer: hugeBuffer },
    'paymentProof'
  );
  assert.equal(result.valid, false);
  assert.match(result.error, /exceeds maximum allowed size/i);
});

test('File Validator: validateFile accepts valid PDF for abstract', () => {
  const validPdf = Buffer.concat([
    Buffer.from([0x25, 0x50, 0x44, 0x46]),
    Buffer.from(' valid abstract content here'),
  ]);

  const result = validateFile(
    { originalname: 'research_abstract.pdf', buffer: validPdf },
    'abstractFile'
  );
  assert.equal(result.valid, true);
  assert.equal(result.detectedType, 'application/pdf');
  assert.equal(result.ext, '.pdf');
});

test('File Validator: generateStorageKey generates sanitized UUID keys', () => {
  const uid = 'user-test-123';
  const key = generateStorageKey('payment-proof', uid, '.png');
  assert.match(key, /^payment-proofs\/user-test-123\/[a-f0-9-]+\.png$/);

  const abstractKey = generateStorageKey('abstract', uid, '.pdf');
  assert.match(abstractKey, /^submissions\/user-test-123\/abstracts\/[a-f0-9-]+\.pdf$/);
});
