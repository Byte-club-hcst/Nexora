const test = require('node:test');
const assert = require('node:assert/strict');
const storageService = require('../services/storage.service');

test('R2 Storage Service: upload, download, delete and signed URL generation', async () => {
  const dummyBuffer = Buffer.from('test binary content');
  const testKey = 'payment-proofs/uid-456/test-file.png';

  // Test upload
  const uploadResult = await storageService.upload({
    buffer: dummyBuffer,
    key: testKey,
    contentType: 'image/png',
  });
  assert.equal(uploadResult.key, testKey);

  // Test signed URL generation
  const signedUrl = await storageService.generateSignedUrl({
    key: testKey,
    expiresIn: 1800,
  });
  assert.ok(signedUrl, 'Signed URL should be generated');

  // Test download
  const downloadResult = await storageService.download({ key: testKey });
  assert.ok(downloadResult.Body || downloadResult.mock);

  // Test delete
  const deleteResult = await storageService.delete({ key: testKey });
  assert.ok(deleteResult);
});
