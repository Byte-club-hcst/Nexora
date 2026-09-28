import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  onAuthStateChanged,
} from '../services/firebase';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [role, setRole] = useState('participant');
  const [loading, setLoading] = useState(true);

  // Sync session with Firebase and backend
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          // Check claims first
          const tokenResult = await user.getIdTokenResult(true);
          const userRole = tokenResult.claims.role || 'participant';
          setRole(userRole);

          // Fetch profile from backend
          const res = await api.get('/api/auth/me');
          if (res?.data?.user) {
            setUserProfile(res.data.user);
            if (res.data.user.role) {
              setRole(res.data.user.role);
            }
          }
        } catch (err) {
          console.warn('[AuthContext] Profile fetch notice:', err.message);
        }
      } else {
        setUserProfile(null);
        setRole('participant');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const tokenResult = await cred.user.getIdTokenResult(true);
    const userRole = tokenResult.claims.role || 'participant';
    setRole(userRole);
    return { user: cred.user, role: userRole };
  };

  const signup = async ({ name, email, password, college, phone }) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    try {
      await sendEmailVerification(cred.user);
    } catch (e) {
      console.warn('Verification email could not be sent:', e.message);
    }

    // Complete profile on backend
    await api.post('/api/auth/complete-signup', { name, college, phone });
    return cred.user;
  };

  const logout = async () => {
    await signOut(auth);
    setCurrentUser(null);
    setUserProfile(null);
    setRole('participant');
  };

  const resetPassword = async (email) => {
    return await sendPasswordResetEmail(auth, email);
  };

  const resendVerification = async () => {
    if (currentUser) {
      return await sendEmailVerification(currentUser);
    }
  };

  const value = {
    currentUser,
    userProfile,
    role,
    isAdmin: role === 'admin',
    loading,
    login,
    signup,
    logout,
    resetPassword,
    resendVerification,
    refreshProfile: async () => {
      if (currentUser) {
        const res = await api.get('/api/auth/me');
        if (res?.data?.user) setUserProfile(res.data.user);
      }
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
