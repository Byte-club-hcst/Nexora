const { db } = require('../config/firebase');
const auditService = require('./audit.service');

const DEFAULT_CONFIG = {
  eventName: 'NEXORA 2026',
  eventDescription: 'Emerging Technology & Interdisciplinary Innovation Student Conference',
  contactEmail: 'nexora2026@hcst.edu.in',
  registrationFee: 100, // INR
  currency: 'INR',
  registrationOpen: true,
  // UTC Timestamps
  registrationDeadline: '2026-10-05T18:29:59.000Z', // 23:59:59 IST
  paymentDeadline: '2026-10-07T18:29:59.000Z',
  submissionOpen: true,
  submissionDeadline: '2026-09-30T18:29:59.000Z',
  eventStart: '2026-10-14T04:30:00.000Z', // 10:00 AM IST
  eventEnd: '2026-10-14T11:30:00.000Z',   // 5:00 PM IST
  venue: 'APJ Abdul Kalam Auditorium, HCST Mathura',
  updatedAt: new Date().toISOString(),
};

class EventService {
  /**
   * Retrieve dynamic event configuration from Firestore
   */
  async getEventConfig() {
    try {
      const configDoc = await db.collection('eventConfig').doc('default').get();
      if (!configDoc.exists) {
        // Initialize default config if not already created
        await db.collection('eventConfig').doc('default').set(DEFAULT_CONFIG);
        return { id: 'default', ...DEFAULT_CONFIG };
      }
      return { id: configDoc.id, ...configDoc.data() };
    } catch (err) {
      console.error('[EventService] getEventConfig error:', err);
      return { id: 'default', ...DEFAULT_CONFIG };
    }
  }

  /**
   * Admin updates event configuration
   */
  async updateEventConfig(adminUid, updates) {
    const docRef = db.collection('eventConfig').doc('default');
    const existing = await docRef.get();
    const prevData = existing.exists ? existing.data() : DEFAULT_CONFIG;

    const allowedFields = [
      'eventName',
      'eventDescription',
      'contactEmail',
      'registrationFee',
      'currency',
      'registrationOpen',
      'registrationDeadline',
      'paymentDeadline',
      'submissionOpen',
      'submissionDeadline',
      'eventStart',
      'eventEnd',
      'venue',
    ];

    const cleanUpdates = {};
    for (const key of allowedFields) {
      if (updates[key] !== undefined) {
        cleanUpdates[key] = updates[key];
      }
    }
    cleanUpdates.updatedAt = new Date().toISOString();
    cleanUpdates.updatedBy = adminUid;

    await docRef.set(cleanUpdates, { merge: true });

    await auditService.logAction({
      adminUid,
      action: 'EVENT_CONFIG_UPDATED',
      previousValue: prevData,
      newValue: cleanUpdates,
    });

    const updated = await docRef.get();
    return { id: 'default', ...updated.data() };
  }

  /**
   * Public list of active announcements
   */
  async getAnnouncements() {
    try {
      const snapshot = await db
        .collection('announcements')
        .orderBy('createdAt', 'desc')
        .get();

      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      const snapshot = await db.collection('announcements').get();
      return snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  }

  /**
   * Create an announcement
   */
  async createAnnouncement(adminUid, { title, content, priority = 'normal', category = 'general' }) {
    const docRef = await db.collection('announcements').add({
      title: title.trim(),
      content: content.trim(),
      priority,
      category,
      createdBy: adminUid,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    await auditService.logAction({
      adminUid,
      action: 'ANNOUNCEMENT_CREATED',
      targetUid: docRef.id,
      newValue: { title, priority, category },
    });

    return { id: docRef.id, title, content, priority, category };
  }

  /**
   * Delete an announcement
   */
  async deleteAnnouncement(adminUid, id) {
    const docRef = db.collection('announcements').doc(id);
    const doc = await docRef.get();
    if (!doc.exists) return null;

    const data = doc.data();
    await docRef.delete();

    await auditService.logAction({
      adminUid,
      action: 'ANNOUNCEMENT_DELETED',
      targetUid: id,
      previousValue: data,
    });

    return true;
  }
}

module.exports = new EventService();
