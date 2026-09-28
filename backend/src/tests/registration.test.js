const test = require('node:test');
const assert = require('node:assert/strict');
const registrationService = require('../services/registration.service');

test('Registration Service: rejects invalid track selection', async () => {
  await assert.rejects(
    async () => {
      await registrationService.createRegistration('user-invalid-track', 'test@example.com', {
        name: 'Test Student',
        college: 'HCST Mathura',
        phone: '9876543210',
        track: 'Invalid Unknown Track',
      });
    },
    (err) => {
      assert.equal(err.status, 400);
      assert.match(err.message, /invalid track/i);
      return true;
    }
  );
});

test('Registration Service: rejects missing mandatory fields', async () => {
  await assert.rejects(
    async () => {
      await registrationService.createRegistration('user-missing-fields', 'test@example.com', {
        name: '',
        college: 'HCST Mathura',
        phone: '9876543210',
        track: 'AI/ML',
      });
    },
    (err) => {
      assert.equal(err.status, 400);
      assert.match(err.message, /required/i);
      return true;
    }
  );
});
