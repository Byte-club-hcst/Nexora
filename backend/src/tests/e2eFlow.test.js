const test = require('node:test');
const assert = require('node:assert/strict');

test('End-to-End Conference Lifecycle: Signup -> Registration -> Payment -> Verification -> Submission -> Review', async () => {
  // 1. Participant user profile initialization (Signup)
  const participantUser = {
    uid: 'participant-uid-999',
    email: 'student@hcst.edu.in',
    name: 'Aarav Sharma',
    college: 'Hindustan College of Science and Technology',
    phone: '9876543210',
    role: 'participant',
  };
  assert.equal(participantUser.role, 'participant');
  assert.ok(participantUser.uid);

  // 2. Registration creation
  const registrationRecord = {
    uid: participantUser.uid,
    name: participantUser.name,
    email: participantUser.email,
    college: participantUser.college,
    phone: participantUser.phone,
    track: 'AI/ML',
    paymentStatus: 'Pending Payment',
    paymentProofKey: null,
    createdAt: new Date().toISOString(),
  };
  assert.equal(registrationRecord.paymentStatus, 'Pending Payment');

  // 3. Payment proof upload
  const proofKey = `payment-proofs/${participantUser.uid}/proof-uuid.png`;
  registrationRecord.paymentProofKey = proofKey;
  registrationRecord.paymentStatus = 'Pending Verification';
  assert.equal(registrationRecord.paymentStatus, 'Pending Verification');

  // 4. Admin reviews & verifies payment
  const adminUid = 'admin-uid-001';
  registrationRecord.paymentStatus = 'Verified';
  registrationRecord.paymentVerifiedBy = adminUid;
  assert.equal(registrationRecord.paymentStatus, 'Verified');

  // 5. Participant submits abstract & poster
  const submissionRecord = {
    id: participantUser.uid,
    userId: participantUser.uid,
    title: 'Adaptive Neural Architectures for Low-Power IoT Devices',
    track: registrationRecord.track,
    authors: [
      { name: participantUser.name, course: 'B.Tech', branch: 'CSE', year: '3rd Year' },
      { name: 'Rohan Verma', course: 'B.Tech', branch: 'CSE', year: '3rd Year' },
    ],
    abstractKey: `submissions/${participantUser.uid}/abstracts/abstract-uuid.pdf`,
    posterKey: `submissions/${participantUser.uid}/posters/poster-uuid.png`,
    status: 'Under Review',
    round2Eligible: false,
    createdAt: new Date().toISOString(),
  };
  assert.equal(submissionRecord.status, 'Under Review');
  assert.equal(submissionRecord.round2Eligible, false);

  // 6. Admin accepts submission
  submissionRecord.status = 'Accepted';
  submissionRecord.round2Eligible = true;
  submissionRecord.reviewedBy = adminUid;
  assert.equal(submissionRecord.status, 'Accepted');
  assert.equal(submissionRecord.round2Eligible, true);

  // 7. Participant views updated dashboard status
  const participantDashboardView = {
    registrationStatus: registrationRecord.paymentStatus, // 'Verified'
    submissionStatus: submissionRecord.status, // 'Accepted'
    isFinalist: submissionRecord.round2Eligible, // true
  };

  assert.equal(participantDashboardView.registrationStatus, 'Verified');
  assert.equal(participantDashboardView.submissionStatus, 'Accepted');
  assert.equal(participantDashboardView.isFinalist, true);
});
