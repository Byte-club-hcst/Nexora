const test = require('node:test');
const assert = require('node:assert/strict');
const submissionService = require('../services/submission.service');

test('Submission Service: rejects submission with less than 1 or more than 4 authors', async () => {
  // Test with 0 authors
  await assert.rejects(
    async () => {
      await submissionService.createSubmission(
        'mock-uid-sub-1',
        {
          title: 'Quantum Edge Computing in Healthcare',
          track: 'Emerging Tech',
          abstract: 'A deep analysis of quantum edge algorithms.',
          keywords: 'quantum, edge, IoT',
          authors: JSON.stringify([]),
        },
        null
      );
    },
    (err) => {
      assert.ok(err.status === 400 || err.status === 403);
      return true;
    }
  );

  // Test with 5 authors
  await assert.rejects(
    async () => {
      await submissionService.createSubmission(
        'mock-uid-sub-2',
        {
          title: 'Quantum Edge Computing in Healthcare',
          track: 'Emerging Tech',
          abstract: 'A deep analysis of quantum edge algorithms.',
          keywords: 'quantum, edge, IoT',
          authors: JSON.stringify([
            { name: 'A1', course: 'B.Tech', branch: 'CSE', year: '3' },
            { name: 'A2', course: 'B.Tech', branch: 'CSE', year: '3' },
            { name: 'A3', course: 'B.Tech', branch: 'CSE', year: '3' },
            { name: 'A4', course: 'B.Tech', branch: 'CSE', year: '3' },
            { name: 'A5', course: 'B.Tech', branch: 'CSE', year: '3' },
          ]),
        },
        null
      );
    },
    (err) => {
      assert.ok(err.status === 400 || err.status === 403);
      return true;
    }
  );
});
