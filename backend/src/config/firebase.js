const admin = require('firebase-admin');
const env = require('./env');

// In-memory Firestore & Auth mock for tests or environments without GCP service account credentials
class MockFirestore {
  constructor() {
    this.storage = new Map(); // collectionName -> Map(docId -> data)
  }

  _getCol(name) {
    if (!this.storage.has(name)) {
      this.storage.set(name, new Map());
    }
    return this.storage.get(name);
  }

  collection(colName) {
    const self = this;
    const colMap = self._getCol(colName);

    return {
      doc(id) {
        return {
          id,
          async get() {
            const data = colMap.get(id);
            return {
              id,
              exists: !!data,
              data: () => (data ? { ...data } : undefined),
            };
          },
          async set(data, options = {}) {
            if (options.merge && colMap.has(id)) {
              colMap.set(id, { ...colMap.get(id), ...data });
            } else {
              colMap.set(id, { ...data });
            }
            return { writeTime: new Date() };
          },
          async update(data) {
            if (!colMap.has(id)) {
              throw new Error(`Document ${id} does not exist in collection ${colName}`);
            }
            colMap.set(id, { ...colMap.get(id), ...data });
            return { writeTime: new Date() };
          },
          async delete() {
            colMap.delete(id);
            return { writeTime: new Date() };
          },
        };
      },
      async add(data) {
        const id = 'mock-' + Math.random().toString(36).substring(2, 9);
        colMap.set(id, { ...data });
        return {
          id,
          get: async () => ({ id, exists: true, data: () => ({ ...colMap.get(id) }) }),
        };
      },
      where(field, op, val) {
        return this._query([{ field, op, val }]);
      },
      orderBy(field, direction = 'asc') {
        return this._query([], { field, direction });
      },
      limit(n) {
        return this._query([], null, n);
      },
      offset(n) {
        return this._query([], null, null, n);
      },
      async get() {
        return this._query().get();
      },
      _query(filters = [], order = null, limit = null, offset = null) {
        return {
          where: (f, o, v) => self.collection(colName)._query([...filters, { field: f, op: o, val: v }], order, limit, offset),
          orderBy: (f, d) => self.collection(colName)._query(filters, { field: f, direction: d }, limit, offset),
          limit: (n) => self.collection(colName)._query(filters, order, n, offset),
          offset: (n) => self.collection(colName)._query(filters, order, limit, n),
          async get() {
            let docs = Array.from(colMap.entries()).map(([id, data]) => ({
              id,
              data: () => ({ ...data }),
            }));

            for (const f of filters) {
              docs = docs.filter((d) => {
                const data = d.data();
                if (f.op === '==') return data[f.field] === f.val;
                return true;
              });
            }

            if (order) {
              docs.sort((a, b) => {
                const va = a.data()[order.field];
                const vb = b.data()[order.field];
                if (va < vb) return order.direction === 'asc' ? -1 : 1;
                if (va > vb) return order.direction === 'asc' ? 1 : -1;
                return 0;
              });
            }

            if (offset) docs = docs.slice(offset);
            if (limit) docs = docs.slice(0, limit);

            return {
              docs,
              size: docs.length,
              empty: docs.length === 0,
              forEach: (cb) => docs.forEach(cb),
            };
          },
        };
      },
    };
  }

  async runTransaction(updateFunction) {
    const transaction = {
      get: async (docRef) => docRef.get(),
      set: (docRef, data, options) => docRef.set(data, options),
      update: (docRef, data) => docRef.update(data),
      delete: (docRef) => docRef.delete(),
    };
    return await updateFunction(transaction);
  }
}

class MockAuth {
  constructor() {
    this.customClaims = new Map();
  }

  async verifyIdToken(token) {
    if (!token) throw new Error('Token is missing');

    if (token.startsWith('local-token:')) {
      const parts = token.split(':');
      const uid = parts[1] || 'mock-user-id';
      const email = decodeURIComponent(parts[2] || 'user@nexora.local');
      const role = parts[3] || (email.toLowerCase().includes('admin') ? 'admin' : 'participant');
      return {
        uid,
        email,
        role: this.customClaims.get(uid)?.role || role,
        email_verified: true,
      };
    }
    if (token === 'admin-token') {
      return {
        uid: 'mock-admin-id',
        email: 'admin@nexora.tech',
        role: 'admin',
        email_verified: true,
      };
    }
    if (token.startsWith('participant-')) {
      const uid = token.replace('participant-', '');
      return {
        uid,
        email: uid.includes('@') ? uid : `${uid}@student.hcst.edu.in`,
        role: 'participant',
        email_verified: true,
      };
    }
    return {
      uid: 'mock-user-id',
      email: 'user@example.com',
      role: this.customClaims.get('mock-user-id')?.role || 'participant',
      email_verified: true,
    };
  }

  async setCustomUserClaims(uid, claims) {
    this.customClaims.set(uid, claims);
  }

  async getUserByEmail(email) {
    return { uid: 'user-' + email.split('@')[0], email };
  }
}

let db;
let auth;

// External connections are disabled by default for offline/standalone mode
const hasLiveCredentials = !!(
  process.env.USE_LIVE_FIREBASE === 'true' &&
  env.FIREBASE_CLIENT_EMAIL &&
  env.FIREBASE_PRIVATE_KEY &&
  !env.FIREBASE_PRIVATE_KEY.includes('your_') &&
  !env.FIREBASE_PRIVATE_KEY.includes('MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC6...')
);

if (hasLiveCredentials) {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: env.FIREBASE_PROJECT_ID,
        clientEmail: env.FIREBASE_CLIENT_EMAIL,
        privateKey: env.FIREBASE_PRIVATE_KEY,
      }),
    });
  }
  db = admin.firestore();
  auth = admin.auth();
} else {
  // Use in-memory mock store for tests / local development without live service accounts
  console.log('ℹ️ Running with in-memory Firestore & Auth mock engine (ideal for local testing & development)');
  db = new MockFirestore();
  auth = new MockAuth();
}

module.exports = { admin, db, auth };
