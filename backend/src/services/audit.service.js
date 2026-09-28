const { db } = require('../config/firebase');

const VALID_ACTIONS = [
  'PAYMENT_VERIFIED',
  'PAYMENT_REJECTED',
  'SUBMISSION_ACCEPTED',
  'SUBMISSION_REJECTED',
  'EVENT_CONFIG_UPDATED',
  'ANNOUNCEMENT_CREATED',
  'ANNOUNCEMENT_UPDATED',
  'ANNOUNCEMENT_DELETED',
  'PARTICIPANT_UPDATED',
  'FILE_ACCESSED',
];

class AuditService {
  /**
   * Log an administrative action to auditLogs collection
   */
  async logAction({
    adminUid,
    action,
    targetUid = null,
    previousValue = null,
    newValue = null,
    metadata = {},
  }) {
    if (!VALID_ACTIONS.includes(action)) {
      console.warn(`[AuditService] Unknown action: ${action}`);
    }

    try {
      const logRecord = {
        adminUid: adminUid || 'SYSTEM',
        action,
        targetUid,
        previousValue: previousValue ? this.sanitize(previousValue) : null,
        newValue: newValue ? this.sanitize(newValue) : null,
        metadata: this.sanitize(metadata),
        timestamp: new Date().toISOString(),
      };

      await db.collection('auditLogs').add(logRecord);
      return logRecord;
    } catch (err) {
      console.error('[AuditService] Failed to write audit log:', err);
      // We do not fail the main request if audit logging encounters an error, but we log to console
    }
  }

  /**
   * Fetch paginated audit logs
   */
  async getLogs({ limit = 50, offset = 0 } = {}) {
    try {
      const snapshot = await db
        .collection('auditLogs')
        .orderBy('timestamp', 'desc')
        .limit(Math.min(limit, 100))
        .offset(offset)
        .get();

      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      // If index is pending or fallback needed:
      const snapshot = await db.collection('auditLogs').limit(Math.min(limit, 100)).get();
      return snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }
  }

  /**
   * Strip sensitive fields from audit payload
   */
  sanitize(obj) {
    if (!obj || typeof obj !== 'object') return obj;
    const sanitized = Array.isArray(obj) ? [...obj] : { ...obj };
    const sensitiveKeys = ['password', 'token', 'secret', 'privatekey', 'authorization', 'apikey', 'credential'];
    for (const key of Object.keys(sanitized)) {
      if (sensitiveKeys.some(s => key.toLowerCase().includes(s))) {
        sanitized[key] = '[REDACTED]';
      } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
        sanitized[key] = this.sanitize(sanitized[key]);
      }
    }
    return sanitized;
  }
}

module.exports = new AuditService();
