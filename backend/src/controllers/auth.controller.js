const { db } = require('../config/firebase');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * POST /api/auth/complete-signup
 */
exports.completeSignup = async (req, res, next) => {
  try {
    const uid = req.user.uid;
    const email = req.user.email || null;
    const { name, college, phone } = req.body;

    if (!name || !college || !phone) {
      return sendError(res, 'Name, college, and phone are required.', 400);
    }

    const userRef = db.collection('users').doc(uid);
    const existing = await userRef.get();

    if (existing.exists) {
      return sendSuccess(res, { user: existing.data() }, 200, 'Profile already exists.');
    }

    const now = new Date().toISOString();
    const userData = {
      uid,
      name: name.trim(),
      email,
      role: req.user.role || 'participant',
      college: college.trim(),
      phone: phone.trim(),
      createdAt: now,
      updatedAt: now,
    };

    await userRef.set(userData);

    return sendSuccess(res, { user: userData }, 201, 'User profile created successfully.');
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/auth/me
 */
exports.getMe = async (req, res, next) => {
  try {
    const uid = req.user.uid;
    const userDoc = await db.collection('users').doc(uid).get();

    const role = req.user.role || 'participant';
    const profile = userDoc.exists
      ? userDoc.data()
      : {
          uid,
          email: req.user.email,
          role,
        };

    return sendSuccess(res, {
      user: {
        ...profile,
        role, // Trust custom claims over document field if claim is set
        emailVerified: !!req.user.email_verified,
      },
    });
  } catch (err) {
    next(err);
  }
};
