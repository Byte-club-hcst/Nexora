import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEvent } from '../context/EventContext';
import { api } from '../services/api';
import Button from '../components/Button';
import Loader from '../components/Loader';
import { showToast } from '../components/Toast';
import { UserCheck, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Registration() {
  const { currentUser, userProfile, loading: authLoading } = useAuth();
  const { config, formatIST } = useEvent();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    college: '',
    phone: '',
    track: '',
    agreeTerms: false,
  });
  const [existingRegistration, setExistingRegistration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Check if caller already has a registration
  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const checkExisting = async () => {
      try {
        const res = await api.get('/api/registration/me');
        if (res?.data?.registration) {
          setExistingRegistration(res.data.registration);
        }
      } catch (err) {
        // 404 is normal if not yet registered
      } finally {
        setLoading(false);
      }
    };

    checkExisting();

    if (userProfile) {
      setFormData((prev) => ({
        ...prev,
        name: userProfile.name || '',
        college: userProfile.college || '',
        phone: userProfile.phone || '',
      }));
    }
  }, [currentUser, userProfile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.track) {
      setError('Please select a research track.');
      return;
    }
    if (!formData.agreeTerms) {
      setError('You must accept the conference terms and code of conduct.');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/api/registration', {
        name: formData.name.trim(),
        college: formData.college.trim(),
        phone: formData.phone.trim(),
        track: formData.track,
      });

      showToast('Registration submitted successfully! Please proceed to fee payment.', 'success');
      navigate('/payment');
    } catch (err) {
      console.error('[Registration] Error:', err);
      setError(err.message || 'Registration failed. You may have already registered.');
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return <Loader fullScreen message="Loading registration form..." />;
  }

  if (!currentUser) {
    return (
      <div className="container animate-fade-in" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
        <div className="card" style={{ maxWidth: '500px', margin: '0 auto', padding: '3rem 2rem' }}>
          <h2 style={{ marginBottom: '1rem' }}>Authentication Required</h2>
          <p style={{ marginBottom: '2rem' }}>
            Please sign in or create an account to register for NEXORA 2026.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <Link to="/login" className="btn btn-outline">
              Sign In
            </Link>
            <Link to="/signup" className="btn btn-primary">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (existingRegistration) {
    return (
      <div className="container animate-fade-in" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <div className="card" style={{ maxWidth: '580px', margin: '0 auto', padding: '3rem 2.5rem' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.15)',
              color: 'var(--status-success)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem',
            }}
          >
            <CheckCircle2 size={36} />
          </div>
          <h1 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Registration Active</h1>
          <p style={{ marginBottom: '1.5rem' }}>
            You have already registered for NEXORA 2026 under the <strong>{existingRegistration.track}</strong> track.
          </p>

          <div
            style={{
              background: 'var(--bg-secondary)',
              padding: '1.25rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              textAlign: 'left',
              marginBottom: '2rem',
              fontSize: '0.9rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Registered Name:</span>
              <strong style={{ color: 'var(--text-primary)' }}>{existingRegistration.name}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Registered Email:</span>
              <strong style={{ color: 'var(--text-primary)' }}>{existingRegistration.email}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Payment Status:</span>
              <span className={`badge badge-${existingRegistration.paymentStatus === 'Verified' ? 'success' : existingRegistration.paymentStatus === 'Rejected' ? 'error' : 'pending'}`}>
                {existingRegistration.paymentStatus}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/dashboard" className="btn btn-primary">
              View Participant Dashboard
            </Link>
            {existingRegistration.paymentStatus !== 'Verified' && (
              <Link to="/payment" className="btn btn-secondary">
                View / Upload Payment Proof
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ padding: '3.5rem 1.5rem 5rem' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <div className="eyebrow">
          <span className="eyebrow-dot" />
          <span>Conference Participation</span>
        </div>
        <h1 style={{ marginBottom: '0.5rem' }}>
          Conference <span className="heading-gradient">Registration</span>
        </h1>
        <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>
          Registration fee is ₹{config?.registrationFee || 100} per participant. Complete the form below to initiate your registration.
        </p>

        {error && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              padding: '0.85rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--status-error-bg)',
              border: '1px solid rgba(179, 38, 30, 0.3)',
              color: 'var(--status-error)',
              fontSize: '0.875rem',
              marginBottom: '1.5rem',
            }}
          >
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="card" style={{ padding: '2.5rem' }}>
          <div className="form-group">
            <label className="form-label">Full Name <span className="required">*</span></label>
            <input
              type="text"
              required
              className="form-input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Verified Email (Derived from Account)</label>
            <input
              type="email"
              disabled
              className="form-input"
              value={currentUser.email}
              style={{ opacity: 0.8, cursor: 'not-allowed', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
            />
            <span style={{ fontSize: '0.78rem', color: 'var(--accent-teal)', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <ShieldCheck size={14} /> Verified Firebase Identity Token
            </span>
          </div>

          <div className="form-group">
            <label className="form-label">College / University <span className="required">*</span></label>
            <input
              type="text"
              required
              className="form-input"
              value={formData.college}
              onChange={(e) => setFormData({ ...formData, college: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Mobile Number <span className="required">*</span></label>
            <input
              type="tel"
              required
              className="form-input"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Research Track <span className="required">*</span></label>
            <select
              required
              className="form-select"
              value={formData.track}
              onChange={(e) => setFormData({ ...formData, track: e.target.value })}
            >
              <option value="">-- Choose Research Track --</option>
              <option value="AI/ML">Track 1: AI/ML</option>
              <option value="Data Science">Track 2: Data Science</option>
              <option value="Emerging Tech">Track 3: Emerging Tech</option>
              <option value="Sustainable Tech">Track 4: Sustainable Tech</option>
              <option value="Interdisciplinary Innovation">Track 5: Interdisciplinary Innovation</option>
            </select>
          </div>

          <div className="form-group" style={{ marginTop: '1.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', cursor: 'pointer', fontSize: '0.875rem' }}>
              <input
                type="checkbox"
                required
                checked={formData.agreeTerms}
                onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                style={{ marginTop: '0.2rem' }}
              />
              <span>
                I agree to the conference participation guidelines and confirm that all submitted details and research will be authentic and original.
              </span>
            </label>
          </div>

          <Button type="submit" variant="primary" loading={submitting} style={{ width: '100%', marginTop: '1rem' }}>
            <span>Submit Registration & Proceed to Payment</span>
            <ArrowRight size={16} />
          </Button>
        </form>
      </div>
    </div>
  );
}
