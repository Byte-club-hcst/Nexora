const { db } = require('../config/firebase');
const eventService = require('./event.service');
const storageService = require('./storage.service');
const { validateFile, generateStorageKey } = require('../validators/file.validator');
const { VALID_TRACKS } = require('./registration.service');

class SubmissionService {
  /**
   * Submit abstract & poster with atomic transaction to prevent duplicates
   */
  async createSubmission(uid, { title, track, abstract, keywords, authors }, files) {
    // 1. Dynamic event config check
    const eventConfig = await eventService.getEventConfig();
    if (!eventConfig.submissionOpen) {
      const err = new Error('Submissions are currently closed.');
      err.status = 403;
      throw err;
    }

    if (eventConfig.submissionDeadline && new Date() > new Date(eventConfig.submissionDeadline)) {
      const err = new Error('Submission deadline has passed.');
      err.status = 403;
      throw err;
    }

    // 2. Validate registration existence
    const regDoc = await db.collection('registrations').doc(uid).get();
    if (!regDoc.exists) {
      const err = new Error('You must complete registration before submitting an abstract.');
      err.status = 403;
      throw err;
    }

    // 3. Field validation
    if (!title || !title.trim()) {
      const err = new Error('Paper title is required.');
      err.status = 400;
      throw err;
    }

    if (!track || !VALID_TRACKS.includes(track)) {
      const err = new Error(`Valid track is required (${VALID_TRACKS.join(', ')}).`);
      err.status = 400;
      throw err;
    }

    if (!abstract || !abstract.trim()) {
      const err = new Error('Abstract text is required.');
      err.status = 400;
      throw err;
    }

    if (!keywords || !keywords.trim()) {
      const err = new Error('Keywords are required.');
      err.status = 400;
      throw err;
    }

    // 4. Validate authors (1 to 4)
    let parsedAuthors = authors;
    if (typeof authors === 'string') {
      try {
        parsedAuthors = JSON.parse(authors);
      } catch (e) {
        const err = new Error('Invalid authors payload format.');
        err.status = 400;
        throw err;
      }
    }

    if (!Array.isArray(parsedAuthors) || parsedAuthors.length < 1 || parsedAuthors.length > 4) {
      const err = new Error('Submissions must have between 1 and 4 authors.');
      err.status = 400;
      throw err;
    }

    const cleanAuthors = [];
    for (let i = 0; i < parsedAuthors.length; i++) {
      const a = parsedAuthors[i];
      if (!a.name?.trim() || !a.course?.trim() || !a.branch?.trim() || !a.year?.trim()) {
        const err = new Error(`Author #${i + 1} must include Name, Course, Branch, and Year.`);
        err.status = 400;
        throw err;
      }
      cleanAuthors.push({
        name: a.name.trim(),
        course: a.course.trim(),
        branch: a.branch.trim(),
        year: a.year.trim(),
      });
    }

    // 5. Validate files
    const abstractFile = files?.abstractFile?.[0];
    const posterFile = files?.posterFile?.[0] || files?.poster?.[0];

    if (!abstractFile) {
      const err = new Error('Abstract PDF file is required.');
      err.status = 400;
      throw err;
    }
    if (!posterFile) {
      const err = new Error('Poster file is required.');
      err.status = 400;
      throw err;
    }

    const abstractValidation = validateFile(abstractFile, 'abstractFile');
    if (!abstractValidation.valid) {
      const err = new Error(abstractValidation.error);
      err.status = 400;
      throw err;
    }

    const posterValidation = validateFile(posterFile, 'posterFile');
    if (!posterValidation.valid) {
      const err = new Error(posterValidation.error);
      err.status = 400;
      throw err;
    }

    // 6. Check existing submission doc
    const subRef = db.collection('submissions').doc(uid);
    const existing = await subRef.get();
    if (existing.exists) {
      const err = new Error('You have already submitted an abstract.');
      err.status = 409;
      throw err;
    }

    // 7. Upload to Cloudflare R2
    const abstractKey = generateStorageKey('abstract', uid, '.pdf');
    const posterKey = generateStorageKey('poster', uid, posterValidation.ext);

    await storageService.upload({
      buffer: abstractFile.buffer,
      key: abstractKey,
      contentType: abstractValidation.detectedType,
      metadata: { uid, type: 'abstract' },
    });

    await storageService.upload({
      buffer: posterFile.buffer,
      key: posterKey,
      contentType: posterValidation.detectedType,
      metadata: { uid, type: 'poster' },
    });

    // 8. Atomic save to Firestore
    const now = new Date().toISOString();
    const submissionData = {
      id: uid,
      userId: uid,
      registrationId: uid,
      title: title.trim(),
      authors: cleanAuthors,
      track,
      abstract: abstract.trim(),
      keywords: keywords.trim(),
      abstractKey,
      posterKey,
      status: 'Under Review',
      round2Eligible: false,
      createdAt: now,
      updatedAt: now,
    };

    await db.runTransaction(async (transaction) => {
      const checkDoc = await transaction.get(subRef);
      if (checkDoc.exists) {
        const err = new Error('You have already submitted an abstract.');
        err.status = 409;
        throw err;
      }
      transaction.set(subRef, submissionData);
    });

    return submissionData;
  }

  /**
   * Get caller's own submission with signed download URLs
   */
  async getMySubmission(uid) {
    const doc = await db.collection('submissions').doc(uid).get();
    if (!doc.exists) {
      return null;
    }

    const data = doc.data();
    let abstractSignedUrl = null;
    let posterSignedUrl = null;

    if (data.abstractKey) {
      abstractSignedUrl = await storageService.generateSignedUrl({
        key: data.abstractKey,
        expiresIn: 3600,
      });
    }
    if (data.posterKey) {
      posterSignedUrl = await storageService.generateSignedUrl({
        key: data.posterKey,
        expiresIn: 3600,
      });
    }

    return {
      ...data,
      abstractSignedUrl,
      posterSignedUrl,
    };
  }
}

module.exports = new SubmissionService();
