/**
 * NEXORA 2026 - Authentication & Service Layer
 * 
 * Standalone Local Engine:
 * All external API keys and third-party network connections are disconnected for now.
 * A self-contained, offline authentication system runs locally without requiring
 * external Firebase, Google Identity, or cloud infrastructure.
 */

// Simple deterministic hash for local offline UIDs
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

// Build standardized offline user object compatible with Firebase User interface
function createOfflineUser({ uid, email, role, displayName }) {
  const cleanEmail = (email || 'user@nexora.local').trim();
  const assignedRole = role || (cleanEmail.toLowerCase().includes('admin') ? 'admin' : 'participant');
  const assignedUid = uid || (assignedRole === 'admin' ? 'mock-admin-id' : `part-${hashString(cleanEmail)}`);
  const token = `local-token:${assignedUid}:${encodeURIComponent(cleanEmail)}:${assignedRole}`;

  return {
    uid: assignedUid,
    email: cleanEmail,
    displayName: displayName || cleanEmail.split('@')[0],
    emailVerified: true,
    isAnonymous: false,
    role: assignedRole,
    async getIdToken() {
      return token;
    },
    async getIdTokenResult() {
      return {
        token,
        claims: {
          role: assignedRole,
          email_verified: true,
        },
      };
    },
  };
}

// Persistent storage key
const STORAGE_KEY = 'nexora_local_auth_session';

// Active listeners for onAuthStateChanged
const authListeners = new Set();

function loadPersistedUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    return createOfflineUser(data);
  } catch (err) {
    console.warn('[LocalAuth] Session recovery notice:', err);
    return null;
  }
}

// Global Auth State
const localAuth = {
  currentUser: loadPersistedUser(),
};

function notifyListeners() {
  authListeners.forEach((listener) => {
    try {
      listener(localAuth.currentUser);
    } catch (e) {
      console.error('[LocalAuth] Listener error:', e);
    }
  });
}

// Mock Firebase App
export const app = {
  name: '[DEFAULT]',
  options: {},
};

// Mock Firebase Auth
export const auth = localAuth;

/**
 * Offline signInWithEmailAndPassword
 */
export async function signInWithEmailAndPassword(_auth, email, password) {
  if (!email || !password) {
    const err = new Error('Please enter both email and password.');
    err.code = 'auth/invalid-credential';
    throw err;
  }

  const role = email.toLowerCase().includes('admin') ? 'admin' : 'participant';
  const uid = role === 'admin' ? 'mock-admin-id' : `part-${hashString(email.trim())}`;
  const user = createOfflineUser({ uid, email: email.trim(), role });

  localAuth.currentUser = user;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ uid: user.uid, email: user.email, role: user.role }));
  } catch (e) {
    // Storage quota or private browsing
  }

  notifyListeners();
  return { user };
}

/**
 * Offline createUserWithEmailAndPassword
 */
export async function createUserWithEmailAndPassword(_auth, email, password) {
  if (!email || !password) {
    const err = new Error('Please enter both email and password.');
    err.code = 'auth/invalid-credential';
    throw err;
  }

  if (password.length < 6) {
    const err = new Error('Password must be at least 6 characters.');
    err.code = 'auth/weak-password';
    throw err;
  }

  const role = email.toLowerCase().includes('admin') ? 'admin' : 'participant';
  const uid = `part-${hashString(email.trim())}`;
  const user = createOfflineUser({ uid, email: email.trim(), role });

  localAuth.currentUser = user;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ uid: user.uid, email: user.email, role: user.role }));
  } catch (e) {
    // Storage quota or private browsing
  }

  notifyListeners();
  return { user };
}

/**
 * Offline signOut
 */
export async function signOut(_auth) {
  localAuth.currentUser = null;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    // Storage quota or private browsing
  }
  notifyListeners();
}

/**
 * Offline sendPasswordResetEmail
 */
export async function sendPasswordResetEmail(_auth, email) {
  console.log(`[LocalAuth] Password reset email simulated for: ${email}`);
  return true;
}

/**
 * Offline sendEmailVerification
 */
export async function sendEmailVerification(user) {
  console.log(`[LocalAuth] Email verification simulated for: ${user?.email}`);
  return true;
}

/**
 * Offline onAuthStateChanged
 */
export function onAuthStateChanged(_auth, callback) {
  authListeners.add(callback);
  // Dispatch current state asynchronously so listeners initialize correctly
  setTimeout(() => {
    callback(localAuth.currentUser);
  }, 0);

  return () => {
    authListeners.delete(callback);
  };
}
