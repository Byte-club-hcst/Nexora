const { db } = require('../config/firebase');
const eventService = require('./event.service');
const storageService = require('./storage.service');
const { validateFile, generateStorageKey } = require('../validators/file.validator');

const VALID_TRACKS = [
  'AI/ML',
  'Data Science',
  'Emerging Tech',
  'Sustainable Tech',
  'Interdisciplinary Innovation',
];

class RegistrationService {
  /**
   * Register participant using Firestore transaction to guarantee no duplicates or race conditions
   */
  async createRegistration(uid, verifiedEmail, { name, college, phone, track }) {
    if (!name || !college || !phone || !track) {
      const err = new Error('Name, college, phone, and track are required.');
      err.status = 400;
      throw err;
    }

    if (!VALID_TRACKS.includes(track)) {
      const err = new Error(`Invalid track selected. Must be one of: ${VALID_TRACKS.join(', ')}`);
      err.status = 400;
      throw err;
    }

    // Check event config deadline
    const eventConfig = await eventService.getEventConfig();
    if (!eventConfig.registrationOpen) {
      const err = new Error('Registrations are currently closed by event administration.');
      err.status = 403;
      throw err;
    }

    if (eventConfig.registrationDeadline && new Date() > new Date(eventConfig.registrationDeadline)) {
      const err = new Error('Registration deadline has passed.');
      err.status = 403;
      throw err;
    }

    const regRef = db.collection('registrations').doc(uid);
    const userRef = db.collection('users').doc(uid);

    // Atomic transaction prevents concurrent duplicate creation
    const result = await db.runTransaction(async (transaction) => {
      const doc = await transaction.get(regRef);
      if (doc.exists) {
        const err = new Error('You have already registered for NEXORA 2026.');
        err.status = 409;
        throw err;
      }

      const now = new Date().toISOString();
      const registrationData = {
        uid,
        name: name.trim(),
        email: verifiedEmail, // Guaranteed authentic from Firebase token
        college: college.trim(),
        phone: phone.trim(),
        track,
        paymentStatus: 'Pending Payment',
        paymentProofKey: null,
        feeAmount: eventConfig.registrationFee || 100,
        createdAt: now,
        updatedAt: now,
      };

      transaction.set(regRef, registrationData);

      // Also ensure users profile exists / is updated
      transaction.set(
        userRef,
        {
          uid,
          name: name.trim(),
          email: verifiedEmail,
          college: college.trim(),
          phone: phone.trim(),
          role: 'participant',
          updatedAt: now,
        },
        { merge: true }
      );

      return registrationData;
    });

    return result;
  }

  /**
   * Get registration for caller with authorized pre-signed URL for payment proof
   */
  async getMyRegistration(uid) {
    const doc = await db.collection('registrations').doc(uid).get();
    if (!doc.exists) {
      return null;
    }

    const data = doc.data();
    let paymentProofSignedUrl = null;
    if (data.paymentProofKey) {
      paymentProofSignedUrl = await storageService.generateSignedUrl({
        key: data.paymentProofKey,
        expiresIn: 3600, // 1 hour
      });
    }

    return {
      ...data,
      paymentProofSignedUrl,
    };
  }

  /**
   * Upload payment proof screenshot to private R2 storage
   */
  async uploadPaymentProof(uid, file) {
    if (!file) {
      const err = new Error('Payment screenshot file is required.');
      err.status = 400;
      throw err;
    }

    // Validate file magic bytes, MIME, size
    const validation = validateFile(file, 'paymentProof');
    if (!validation.valid) {
      const err = new Error(validation.error);
      err.status = 400;
      throw err;
    }

    const regRef = db.collection('registrations').doc(uid);
    const regDoc = await regRef.get();

    if (!regDoc.exists) {
      const err = new Error('You must complete registration before uploading payment proof.');
      err.status = 404;
      throw err;
    }

    const currentStatus = regDoc.data().paymentStatus;
    if (currentStatus === 'Verified') {
      const err = new Error('Your payment has already been verified.');
      err.status = 400;
      throw err;
    }

    // Generate secure UUID-based key in private bucket
    const storageKey = generateStorageKey('payment-proof', uid, validation.ext);

    // Upload to private Cloudflare R2
    await storageService.upload({
      buffer: file.buffer,
      key: storageKey,
      contentType: validation.detectedType,
      metadata: { uid, type: 'payment-proof' },
    });

    // Update registration doc
    const now = new Date().toISOString();
    await regRef.update({
      paymentProofKey: storageKey,
      paymentStatus: 'Pending Verification',
      paymentSubmittedAt: now,
      updatedAt: now,
    });

    const signedUrl = await storageService.generateSignedUrl({
      key: storageKey,
      expiresIn: 3600,
    });

    return {
      paymentStatus: 'Pending Verification',
      paymentProofKey: storageKey,
      paymentProofSignedUrl: signedUrl,
    };
  }
}

module.exports = new RegistrationService();
module.exports.VALID_TRACKS = VALID_TRACKS;
