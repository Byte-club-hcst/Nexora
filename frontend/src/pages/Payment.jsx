import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEvent } from '../context/EventContext';
import { api } from '../services/api';
import Button from '../components/Button';
import Loader from '../components/Loader';
import FileUploader from '../components/FileUploader';
import { showToast } from '../components/Toast';
import { QrCode, CheckCircle, AlertCircle, Clock, ShieldAlert, ArrowRight, ExternalLink } from 'lucide-react';

export default function Payment() {
  const { currentUser, loading: authLoading } = useAuth();
  const { config } = useEvent();

  const [registration, setRegistration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const fetchRegistration = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/registration/me');
      if (res?.data?.registration) {
        setRegistration(res.data.registration);
      }
    } catch (err) {
      console.warn('Registration fetch:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchRegistration();
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  const handleUploadProof = async (e) => {
    e.preventDefault();
    setError('');

    if (!uploadFile) {
      setError('Please choose a payment proof screenshot.');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('proof', uploadFile);

    try {
      await api.upload('/api/registration/payment-proof', formData);
      showToast('Payment screenshot uploaded! Pending verification by admin.', 'success');
      setUploadFile(null);
      await fetchRegistration();
    } catch (err) {
      console.error('[Payment] Upload error:', err);
      setError(err.message || 'Failed to upload screenshot. Only PNG/JPEG under 5MB allowed.');
    } finally {
      setUploading(false);
    }
  };

  if (authLoading || loading) {
    return <Loader fullScreen message="Loading payment portal..." />;
  }

  if (!currentUser) {
    return (
      <div className="container animate-fade-in" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
        <div className="card" style={{ maxWidth: '500px', margin: '0 auto', padding: '3rem 2rem' }}>
          <h2 style={{ marginBottom: '1rem' }}>Sign In Required</h2>
          <p style={{ marginBottom: '2rem' }}>Please log in to complete your conference fee payment.</p>
          <Link to="/login" className="btn btn-primary">
            Sign In Now
          </Link>
        </div>
      </div>
    );
  }

  if (!registration) {
    return (
      <div className="container animate-fade-in" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
        <div className="card" style={{ maxWidth: '540px', margin: '0 auto', padding: '3rem 2rem' }}>
          <ShieldAlert size={48} color="var(--accent-amber)" style={{ marginBottom: '1rem' }} />
          <h2 style={{ marginBottom: '1rem' }}>No Active Registration Found</h2>
          <p style={{ marginBottom: '2rem' }}>
            You need to complete your conference registration before uploading payment proof.
          </p>
          <Link to="/register" className="btn btn-primary">
            Proceed to Registration →
          </Link>
        </div>
      </div>
    );
  }

  const { paymentStatus, paymentProofSignedUrl, rejectionReason } = registration;

  return (
    <div className="container animate-fade-in" style={{ padding: '3.5rem 1.5rem 5rem' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <div className="eyebrow">
          <span className="eyebrow-dot" />
          <span>Step 2 of 3</span>
        </div>
        <h1 style={{ marginBottom: '0.5rem' }}>
          Registration <span className="heading-gradient">Fee Payment</span>
        </h1>
        <p style={{ marginBottom: '2rem' }}>
          Registration fee is <strong>₹{registration.feeAmount || 100}</strong>. Scan the official UPI QR code, complete payment, and upload your confirmation screenshot.
        </p>

        {/* Current Payment Status Card */}
        <div
          className="card"
          style={{
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            background: paymentStatus === 'Verified' ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg-card)',
            borderColor: paymentStatus === 'Verified' ? 'var(--status-success)' : paymentStatus === 'Rejected' ? 'var(--status-error)' : 'var(--border)',
          }}
        >
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Payment Status:</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
              <span className={`badge badge-${paymentStatus === 'Verified' ? 'success' : paymentStatus === 'Rejected' ? 'error' : 'pending'}`} style={{ fontSize: '0.95rem' }}>
                {paymentStatus}
              </span>
            </div>
            {rejectionReason && (
              <p style={{ margin: '0.5rem 0 0', color: '#f87171', fontSize: '0.85rem' }}>
                Reason: {rejectionReason}
              </p>
            )}
          </div>

          {paymentProofSignedUrl && (
            <a
              href={paymentProofSignedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-sm"
            >
              <ExternalLink size={14} />
              <span>View Uploaded Proof</span>
            </a>
          )}
        </div>

        {paymentStatus === 'Verified' ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
            <CheckCircle size={56} color="var(--status-success)" style={{ marginBottom: '1rem' }} />
            <h2 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Payment Verified!</h2>
            <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>
              Your registration fee has been successfully verified by the organizing team. You are now cleared for abstract submission.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
              <Link to="/submission" className="btn btn-primary">
                <span>Submit Abstract & Poster</span>
                <ArrowRight size={16} />
              </Link>
              <Link to="/dashboard" className="btn btn-secondary">
                Go to Dashboard
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Payment QR and Upload Card */}
            <div className="card" style={{ marginBottom: '2rem', padding: '2rem' }}>
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Scan & Pay via UPI</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  Pay ₹{registration.feeAmount || 100} using Google Pay, PhonePe, Paytm, or BHIM
                </p>

                <div
                  style={{
                    display: 'inline-block',
                    padding: '1rem',
                    background: '#ffffff',
                    borderRadius: 'var(--radius-md)',
                    margin: '1.25rem 0',
                    border: '1px solid var(--border)',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <img
                    src="/images/payment-qr.png"
                    alt="Official UPI QR Code"
                    style={{ width: '220px', height: '220px', display: 'block', objectFit: 'contain' }}
                  />
                </div>

                <div style={{ background: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', maxWidth: '340px', margin: '0 auto' }}>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--accent-teal)', fontWeight: 600, fontFamily: 'monospace' }}>
                    UPI ID: byte.hcst@upi (or scan QR code)
                  </p>
                </div>
              </div>

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

              <form onSubmit={handleUploadProof}>
                <FileUploader
                  label="Upload Payment Screenshot (JPEG / PNG, max 5MB) *"
                  accept="image/jpeg,image/png"
                  maxSizeMB={5}
                  helperText="Ensure transaction ID and amount are clearly visible"
                  selectedFile={uploadFile}
                  onFileSelect={(file) => setUploadFile(file)}
                />

                <Button
                  type="submit"
                  variant="primary"
                  loading={uploading}
                  disabled={!uploadFile}
                  style={{ width: '100%', marginTop: '1.5rem' }}
                >
                  {paymentStatus === 'Pending Verification' ? 'Re-upload Payment Proof' : 'Upload Proof & Submit for Verification'}
                </Button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
