const { db } = require('../config/firebase');
const storageService = require('./storage.service');
const auditService = require('./audit.service');
const emailService = require('./email.service');

class AdminService {
  /**
   * Get administrative dashboard metrics
   */
  async getDashboardStats() {
    const [regSnap, subSnap] = await Promise.all([
      db.collection('registrations').get(),
      db.collection('submissions').get(),
    ]);

    const stats = {
      totalRegistrations: regSnap.size,
      payments: {
        pendingPayment: 0,
        pendingVerification: 0,
        verified: 0,
        rejected: 0,
      },
      submissions: {
        total: subSnap.size,
        underReview: 0,
        accepted: 0,
        rejected: 0,
      },
      tracks: {
        'AI/ML': 0,
        'Data Science': 0,
        'Emerging Tech': 0,
        'Sustainable Tech': 0,
        'Interdisciplinary Innovation': 0,
      },
      estimatedRevenue: 0,
    };

    regSnap.forEach((doc) => {
      const data = doc.data();
      const status = data.paymentStatus;
      if (status === 'Pending Payment') stats.payments.pendingPayment++;
      else if (status === 'Pending Verification') stats.payments.pendingVerification++;
      else if (status === 'Verified') {
        stats.payments.verified++;
        stats.estimatedRevenue += data.feeAmount || 100;
      } else if (status === 'Rejected') stats.payments.rejected++;

      if (data.track && stats.tracks[data.track] !== undefined) {
        stats.tracks[data.track]++;
      }
    });

    subSnap.forEach((doc) => {
      const data = doc.data();
      const status = data.status;
      if (status === 'Under Review') stats.submissions.underReview++;
      else if (status === 'Accepted') stats.submissions.accepted++;
      else if (status === 'Rejected') stats.submissions.rejected++;
    });

    return stats;
  }

  /**
   * Paginated and filtered registration list
   */
  async listRegistrations({ status, search, limit = 20, offset = 0 }) {
    const pageLimit = Math.min(parseInt(limit, 10) || 20, 50);
    const pageOffset = parseInt(offset, 10) || 0;

    let query = db.collection('registrations');
    if (status) {
      query = query.where('paymentStatus', '==', status);
    }

    const snapshot = await query.get();
    let all = snapshot.docs.map((doc) => ({ uid: doc.id, ...doc.data() }));

    // In-memory search by name, email, college, phone if query provided
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      all = all.filter(
        (r) =>
          r.name?.toLowerCase().includes(q) ||
          r.email?.toLowerCase().includes(q) ||
          r.college?.toLowerCase().includes(q) ||
          r.phone?.includes(q) ||
          r.track?.toLowerCase().includes(q)
      );
    }

    // Sort by createdAt desc
    all.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    const total = all.length;
    const paginated = all.slice(pageOffset, pageOffset + pageLimit);

    return {
      registrations: paginated,
      pagination: {
        total,
        limit: pageLimit,
        offset: pageOffset,
        hasMore: pageOffset + pageLimit < total,
      },
    };
  }

  /**
   * Verify or reject registration payment
   */
  async verifyRegistration(adminUid, id, status, reason = null) {
    if (!['Verified', 'Rejected'].includes(status)) {
      const err = new Error('Status must be Verified or Rejected.');
      err.status = 400;
      throw err;
    }

    const regRef = db.collection('registrations').doc(id);
    const regDoc = await regRef.get();

    if (!regDoc.exists) {
      const err = new Error('Registration not found.');
      err.status = 404;
      throw err;
    }

    const prevData = regDoc.data();
    if (prevData.paymentStatus !== 'Pending Verification') {
      const err = new Error('This registration is not pending verification.');
      err.status = 409;
      throw err;
    }

    const now = new Date().toISOString();
    await regRef.update({
      paymentStatus: status,
      paymentVerifiedAt: now,
      paymentVerifiedBy: adminUid,
      rejectionReason: status === 'Rejected' ? reason : null,
      updatedAt: now,
    });

    const action = status === 'Verified' ? 'PAYMENT_VERIFIED' : 'PAYMENT_REJECTED';
    await auditService.logAction({
      adminUid,
      action,
      targetUid: id,
      previousValue: { paymentStatus: prevData.paymentStatus },
      newValue: { paymentStatus: status, rejectionReason: reason },
    });

    // Send email notification in background
    if (status === 'Verified') {
      emailService.sendPaymentVerifiedEmail(prevData.email, prevData.name).catch(() => {});
    } else {
      emailService.sendPaymentRejectedEmail(prevData.email, prevData.name, reason).catch(() => {});
    }

    return { id, status, updatedAt: now };
  }

  /**
   * Paginated and filtered submissions list
   */
  async listSubmissions({ track, status, search, limit = 20, offset = 0 }) {
    const pageLimit = Math.min(parseInt(limit, 10) || 20, 50);
    const pageOffset = parseInt(offset, 10) || 0;

    let query = db.collection('submissions');
    if (track) query = query.where('track', '==', track);
    if (status) query = query.where('status', '==', status);

    const snapshot = await query.get();
    let all = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      all = all.filter(
        (s) =>
          s.title?.toLowerCase().includes(q) ||
          s.keywords?.toLowerCase().includes(q) ||
          s.authors?.some((a) => a.name?.toLowerCase().includes(q))
      );
    }

    all.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    const total = all.length;
    const paginated = all.slice(pageOffset, pageOffset + pageLimit);

    return {
      submissions: paginated,
      pagination: {
        total,
        limit: pageLimit,
        offset: pageOffset,
        hasMore: pageOffset + pageLimit < total,
      },
    };
  }

  /**
   * Review submission (Accept / Reject)
   */
  async reviewSubmission(adminUid, id, status, feedback = '') {
    if (!['Accepted', 'Rejected'].includes(status)) {
      const err = new Error('Status must be Accepted or Rejected.');
      err.status = 400;
      throw err;
    }

    const subRef = db.collection('submissions').doc(id);
    const subDoc = await subRef.get();

    if (!subDoc.exists) {
      const err = new Error('Submission not found.');
      err.status = 404;
      throw err;
    }

    const prevData = subDoc.data();
    const now = new Date().toISOString();

    await subRef.update({
      status,
      round2Eligible: status === 'Accepted',
      adminFeedback: feedback ? feedback.trim() : null,
      reviewedBy: adminUid,
      reviewedAt: now,
      updatedAt: now,
    });

    const action = status === 'Accepted' ? 'SUBMISSION_ACCEPTED' : 'SUBMISSION_REJECTED';
    await auditService.logAction({
      adminUid,
      action,
      targetUid: id,
      previousValue: { status: prevData.status },
      newValue: { status, round2Eligible: status === 'Accepted', adminFeedback: feedback },
    });

    // Notify author if user record found
    const userDoc = await db.collection('users').doc(id).get();
    if (userDoc.exists) {
      const user = userDoc.data();
      emailService
        .sendSubmissionReviewedEmail(user.email, user.name, prevData.title, status)
        .catch(() => {});
    }

    return { id, status, round2Eligible: status === 'Accepted', updatedAt: now };
  }

  /**
   * Get full participant details with authorized signed URLs
   */
  async getParticipantDetail(adminUid, uid) {
    const regDoc = await db.collection('registrations').doc(uid).get();
    if (!regDoc.exists) {
      const err = new Error('Registration not found.');
      err.status = 404;
      throw err;
    }

    const regData = regDoc.data();
    let paymentProofSignedUrl = null;
    if (regData.paymentProofKey) {
      paymentProofSignedUrl = await storageService.generateSignedUrl({
        key: regData.paymentProofKey,
        expiresIn: 3600,
      });
    }

    const subDoc = await db.collection('submissions').doc(uid).get();
    let subData = null;
    if (subDoc.exists) {
      const rawSub = subDoc.data();
      let abstractSignedUrl = null;
      let posterSignedUrl = null;

      if (rawSub.abstractKey) {
        abstractSignedUrl = await storageService.generateSignedUrl({
          key: rawSub.abstractKey,
          expiresIn: 3600,
        });
      }
      if (rawSub.posterKey) {
        posterSignedUrl = await storageService.generateSignedUrl({
          key: rawSub.posterKey,
          expiresIn: 3600,
        });
      }

      subData = {
        ...rawSub,
        abstractSignedUrl,
        posterSignedUrl,
      };
    }

    // Log file access in audit trail
    await auditService.logAction({
      adminUid,
      action: 'FILE_ACCESSED',
      targetUid: uid,
      metadata: {
        viewedProof: !!regData.paymentProofKey,
        viewedSubmission: !!subDoc.exists,
      },
    });

    return {
      registration: {
        ...regData,
        paymentProofSignedUrl,
      },
      submission: subData,
    };
  }

  /**
   * Generate authorized signed URL for any registration or submission file
   */
  async getFileSignedUrl(adminUid, fileType, uid) {
    let key = null;

    if (fileType === 'payment-proof') {
      const regDoc = await db.collection('registrations').doc(uid).get();
      if (!regDoc.exists) throw new Error('Registration not found.');
      key = regDoc.data().paymentProofKey;
    } else if (fileType === 'abstract') {
      const subDoc = await db.collection('submissions').doc(uid).get();
      if (!subDoc.exists) throw new Error('Submission not found.');
      key = subDoc.data().abstractKey;
    } else if (fileType === 'poster') {
      const subDoc = await db.collection('submissions').doc(uid).get();
      if (!subDoc.exists) throw new Error('Submission not found.');
      key = subDoc.data().posterKey;
    } else {
      throw new Error('Invalid file type.');
    }

    if (!key) {
      const err = new Error('No file key associated with this record.');
      err.status = 404;
      throw err;
    }

    const signedUrl = await storageService.generateSignedUrl({ key, expiresIn: 3600 });

    await auditService.logAction({
      adminUid,
      action: 'FILE_ACCESSED',
      targetUid: uid,
      metadata: { fileType, key },
    });

    return { signedUrl, key };
  }
}

module.exports = new AdminService();
