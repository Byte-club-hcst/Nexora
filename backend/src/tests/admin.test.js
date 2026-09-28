const test = require('node:test');
const assert = require('node:assert/strict');
const adminService = require('../services/admin.service');
const auditService = require('../services/audit.service');

test('Admin Service: verifyRegistration rejects invalid status string', async () => {
  await assert.rejects(
    async () => {
      await adminService.verifyRegistration('admin-123', 'reg-456', 'InvalidStatus');
    },
    (err) => {
      assert.equal(err.status, 400);
      assert.match(err.message, /Status must be Verified or Rejected/i);
      return true;
    }
  );
});

test('Audit Service: sanitize successfully strips sensitive tokens and secrets', () => {
  const sensitivePayload = {
    apiKey: 'mockSecretApiKey123',
    password: 'superSecretPassword',
    authToken: 'Bearer eyJhbGciOi...',
    nested: {
      privateKey: 'BEGIN PRIVATE KEY...',
      publicName: 'NEXORA Admin',
    },
  };

  const sanitized = auditService.sanitize(sensitivePayload);
  assert.equal(sanitized.apiKey, '[REDACTED]');
  assert.equal(sanitized.password, '[REDACTED]');
  assert.equal(sanitized.authToken, '[REDACTED]');
  assert.equal(sanitized.nested.privateKey, '[REDACTED]');
  assert.equal(sanitized.nested.publicName, 'NEXORA Admin');
});
