const test = require('node:test');
const assert = require('node:assert/strict');
const { requireAuth } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/admin');

test('Auth Middleware: rejects requests without Authorization header', async () => {
  let statusSet = null;
  let jsonSent = null;

  const req = { headers: {} };
  const res = {
    status: (s) => {
      statusSet = s;
      return {
        json: (j) => {
          jsonSent = j;
        },
      };
    },
  };
  let nextCalled = false;
  const next = () => {
    nextCalled = true;
  };

  await requireAuth(req, res, next);
  assert.equal(nextCalled, false);
  assert.equal(statusSet, 401);
  assert.equal(jsonSent.success, false);
  assert.match(jsonSent.message, /token missing/i);
});

test('Admin Middleware: blocks non-admin users with 403', () => {
  let statusSet = null;
  let jsonSent = null;

  const req = { user: { uid: 'user-1', role: 'participant' } };
  const res = {
    status: (s) => {
      statusSet = s;
      return {
        json: (j) => {
          jsonSent = j;
        },
      };
    },
  };
  let nextCalled = false;
  const next = () => {
    nextCalled = true;
  };

  requireAdmin(req, res, next);
  assert.equal(nextCalled, false);
  assert.equal(statusSet, 403);
  assert.equal(jsonSent.success, false);
});

test('Admin Middleware: allows verified admin user', () => {
  const req = { user: { uid: 'admin-1', role: 'admin' } };
  const res = {};
  let nextCalled = false;
  const next = () => {
    nextCalled = true;
  };

  requireAdmin(req, res, next);
  assert.equal(nextCalled, true);
});
