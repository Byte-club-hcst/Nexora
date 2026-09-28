import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEvent } from '../context/EventContext';
import { api } from '../services/api';
import { CheckCircle2, Clock, XCircle, ArrowRight, UploadCloud, CreditCard, Sparkles, ExternalLink } from 'lucide-react';
import Loader from '../components/Loader';
import ErrorState from '../components/ErrorState';

export default function ParticipantDashboard() {
  const { currentUser } = useAuth();
  const { formatIST } = useEvent();
  const [registration, setRegistration] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchParticipantData = async () => {
      try {
        setLoading(true);
        const [regRes, subRes] = await Promise.all([
          api.get('/api/registration/me').catch(() => ({ data: { registration: null } })),
          api.get('/api/submission/me').catch(() => ({ data: { submission: null } })),
        ]);
        setRegistration(regRes.data?.registration || null);
        setSubmission(subRes.data?.submission || null);
      } catch (err) {
        setError(err.message || 'Failed to load participant status');
      } finally {
        setLoading(false);
      }
    };

    fetchParticipantData();
  }, []);

  if (loading) return <Loader fullScreen text="Loading your conference portal..." />;
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;

  const name = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Participant';

  return (
    <div className="container animate-fade-in" style={{ padding: '3.5rem 1.5rem 5rem' }}>
      {/* Welcome Banner */}
      <div
        className="card"
        style={{
          padding: '2.25rem',
          marginBottom: '2.5rem',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
        }}
      >
        <div>
          <div className="eyebrow" style={{ marginBottom: '0.4rem' }}>
            <span className="eyebrow-dot" />
            <span>Participant Portal</span>
          </div>
          <h1 style={{ fontSize: '2rem', margin: 0, color: 'var(--text-primary)' }}>Welcome, {name}</h1>
          <p style={{ margin: '0.35rem 0 0', color: 'var(--text-secondary)' }}>
            Track your registration, payment verification, and paper evaluation in one place.
          </p>
        </div>

        {submission?.round2Eligible && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              background: 'var(--status-success-bg)',
              border: '1px solid var(--status-success)',
              padding: '0.85rem 1.25rem',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <Sparkles size={24} color="var(--status-success)" />
            <div>
              <h4 style={{ margin: 0, color: 'var(--status-success)', fontSize: '0.95rem' }}>Shortlisted Finalist</h4>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-primary)' }}>Round 2 Presentation on 14 Oct 2026</p>
            </div>
          </div>
        )}
      </div>

      {/* 3 Step Progress Grid */}
      <h2 style={{ fontSize: '1.4rem', marginBottom: '1.25rem', color: 'var(--dark-teal)' }}>
        Participation Milestones
      </h2>

      <div className="grid-3" style={{ marginBottom: '2.5rem' }}>
        {/* Step 1: Registration */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--text-primary)' }}>1. Registration</h3>
            <span className={`badge badge-${registration ? 'success' : 'pending'}`}>
              {registration ? 'Registered' : 'Action Required'}
            </span>
          </div>
          <p style={{ flex: 1, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            {registration ? (
              <>
                Registered for <strong>{registration.track}</strong> track on {new Date(registration.createdAt).toLocaleDateString()}.
              </>
            ) : (
              'Complete your participant registration to choose your research track.'
            )}
          </p>
          <div style={{ marginTop: '1.25rem' }}>
            {registration ? (
              <span style={{ fontSize: '0.85rem', color: 'var(--status-success)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <CheckCircle2 size={16} /> Completed
              </span>
            ) : (
              <Link to="/register" className="btn btn-primary btn-sm">
                <span>Register Now</span>
                <ArrowRight size={14} />
              </Link>
            )}
          </div>
        </div>

        {/* Step 2: Payment */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--text-primary)' }}>2. Fee Payment</h3>
            <span
              className={`badge badge-${
                registration?.paymentStatus === 'Verified'
                  ? 'success'
                  : registration?.paymentStatus === 'Rejected'
                  ? 'error'
                  : 'pending'
              }`}
            >
              {registration?.paymentStatus || 'Not Initiated'}
            </span>
          </div>
          <p style={{ flex: 1, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            {registration?.paymentStatus === 'Verified'
              ? 'Registration fee of ₹100 verified by organizing desk.'
              : registration?.paymentStatus === 'Pending Verification'
              ? 'Proof screenshot uploaded. Desk verification underway.'
              : registration?.paymentStatus === 'Rejected'
              ? `Verification rejected: ${registration.rejectionReason || 'Please re-upload clear proof.'}`
              : 'Scan UPI QR code and submit payment proof screenshot.'}
          </p>
          <div style={{ marginTop: '1.25rem' }}>
            {registration?.paymentStatus === 'Verified' ? (
              <span style={{ fontSize: '0.85rem', color: 'var(--status-success)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <CheckCircle2 size={16} /> Verified
              </span>
            ) : (
              <Link to="/payment" className="btn btn-primary btn-sm">
                <span>{registration?.paymentStatus === 'Rejected' ? 'Re-upload Proof' : 'Go to Payment'}</span>
                <ArrowRight size={14} />
              </Link>
            )}
          </div>
        </div>

        {/* Step 3: Submission */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--text-primary)' }}>3. Abstract & Poster</h3>
            <span
              className={`badge badge-${
                submission?.status === 'Accepted'
                  ? 'success'
                  : submission?.status === 'Rejected'
                  ? 'error'
                  : submission
                  ? 'pending'
                  : 'info'
              }`}
            >
              {submission?.status || 'Not Submitted'}
            </span>
          </div>
          <p style={{ flex: 1, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            {submission
              ? `Paper: "${submission.title.slice(0, 50)}..." submitted for peer evaluation.`
              : 'Upload your 150-word abstract PDF and research poster.'}
          </p>
          <div style={{ marginTop: '1.25rem' }}>
            {submission ? (
              <Link to="/submission" className="btn btn-outline btn-sm">
                <span>View Submission</span>
                <ExternalLink size={14} />
              </Link>
            ) : (
              <Link to="/submission" className="btn btn-primary btn-sm">
                <span>Submit Research</span>
                <ArrowRight size={14} />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Submission Details & Evaluation Card */}
      {submission && (
        <div className="card" style={{ marginBottom: '2.5rem', padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <span className="badge badge-info" style={{ marginBottom: '0.5rem' }}>{submission.track}</span>
              <h2 style={{ fontSize: '1.5rem', margin: 0, color: 'var(--text-primary)' }}>{submission.title}</h2>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {submission.abstractSignedUrl && (
                <a href={submission.abstractSignedUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
                  <ExternalLink size={14} />
                  <span>Abstract PDF</span>
                </a>
              )}
              {submission.posterSignedUrl && (
                <a href={submission.posterSignedUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
                  <ExternalLink size={14} />
                  <span>Poster File</span>
                </a>
              )}
            </div>
          </div>

          <div style={{ background: 'var(--bg-secondary)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', marginBottom: '1.5rem' }}>
            <h4 style={{ color: 'var(--dark-teal)', marginBottom: '0.5rem', fontSize: '0.95rem' }}>Abstract Summary:</h4>
            <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.7, color: 'var(--text-secondary)' }}>{submission.abstract}</p>
          </div>

          {submission.adminFeedback && (
            <div style={{ background: 'var(--status-pending-bg)', border: '1px solid rgba(201, 134, 31, 0.3)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
              <strong style={{ color: 'var(--status-pending)', fontSize: '0.85rem' }}>Committee Evaluation Feedback:</strong>
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.9rem', color: 'var(--text-primary)' }}>{submission.adminFeedback}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
