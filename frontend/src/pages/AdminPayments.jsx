import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import DataTable from '../components/DataTable';
import Pagination from '../components/Pagination';
import Modal from '../components/Modal';
import ConfirmationDialog from '../components/ConfirmationDialog';
import Button from '../components/Button';
import { showToast } from '../components/Toast';
import { Check, X, ExternalLink, Image as ImageIcon, AlertCircle } from 'lucide-react';

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, limit: 15, offset: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Pending Verification');

  // Verify Dialog State
  const [verifyTarget, setVerifyTarget] = useState(null);
  const [verifyLoading, setVerifyLoading] = useState(false);

  // Reject Modal State
  const [rejectTarget, setRejectTarget] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectLoading, setRejectLoading] = useState(false);

  // Proof Preview Modal
  const [previewUrl, setPreviewUrl] = useState(null);

  const fetchPayments = async (offset = 0) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        limit: pagination.limit,
        offset,
      });
      if (filter) params.append('status', filter);

      const res = await api.get(`/api/admin/registrations?${params.toString()}`);
      if (res?.data) {
        setPayments(res.data.registrations || []);
        setPagination(res.data.pagination || { total: 0, limit: 15, offset: 0 });
      }
    } catch (err) {
      console.error('[AdminPayments] Error:', err);
      showToast(err.message || 'Failed to fetch payments.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments(0);
  }, [filter]);

  const handleVerify = async () => {
    if (!verifyTarget) return;
    setVerifyLoading(true);
    try {
      await api.patch(`/api/admin/registrations/${verifyTarget.uid}/verify`, {
        status: 'Verified',
      });
      showToast(`Payment for ${verifyTarget.name} verified successfully!`, 'success');
      setVerifyTarget(null);
      fetchPayments(pagination.offset);
    } catch (err) {
      showToast(err.message || 'Verification failed.', 'error');
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleReject = async (e) => {
    e.preventDefault();
    if (!rejectTarget) return;
    setRejectLoading(true);
    try {
      await api.patch(`/api/admin/registrations/${rejectTarget.uid}/verify`, {
        status: 'Rejected',
        reason: rejectReason.trim() || 'Payment proof could not be verified.',
      });
      showToast(`Payment for ${rejectTarget.name} marked as rejected.`, 'info');
      setRejectTarget(null);
      setRejectReason('');
      fetchPayments(pagination.offset);
    } catch (err) {
      showToast(err.message || 'Rejection failed.', 'error');
    } finally {
      setRejectLoading(false);
    }
  };

  const openProof = async (uid) => {
    try {
      const res = await api.get(`/api/admin/participant/${uid}/file-url?fileType=payment-proof`);
      if (res?.data?.signedUrl) {
        window.open(res.data.signedUrl, '_blank');
      } else {
        showToast('No screenshot available.', 'error');
      }
    } catch (err) {
      showToast(err.message || 'Failed to generate signed URL.', 'error');
    }
  };

  const columns = [
    {
      header: 'Participant',
      key: 'name',
      render: (name, row) => (
        <div>
          <strong style={{ color: '#fff' }}>{name}</strong>
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>{row.email} • {row.phone}</p>
        </div>
      ),
    },
    {
      header: 'College',
      key: 'college',
      render: (c) => <span style={{ fontSize: '0.85rem' }}>{c}</span>,
    },
    {
      header: 'Track',
      key: 'track',
      render: (t) => <span className="badge badge-info">{t}</span>,
    },
    {
      header: 'Proof Screenshot',
      key: 'paymentProofKey',
      render: (key, row) => (
        key ? (
          <Button variant="outline" size="sm" onClick={() => openProof(row.uid)}>
            <ImageIcon size={14} />
            <span>View Proof</span>
          </Button>
        ) : (
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>None</span>
        )
      ),
    },
    {
      header: 'Status',
      key: 'paymentStatus',
      render: (status) => (
        <span className={`badge badge-${status === 'Verified' ? 'success' : status === 'Rejected' ? 'error' : 'pending'}`}>
          {status}
        </span>
      ),
    },
    {
      header: 'Verification Actions',
      key: 'uid',
      align: 'right',
      render: (uid, row) => (
        row.paymentStatus === 'Pending Verification' ? (
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setVerifyTarget(row)}
            >
              <Check size={14} />
              <span>Verify</span>
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => setRejectTarget(row)}
            >
              <X size={14} />
              <span>Reject</span>
            </Button>
          </div>
        ) : (
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Completed</span>
        )
      ),
    },
  ];

  return (
    <div className="container animate-fade-in" style={{ padding: '3.5rem 1.5rem 5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <div className="eyebrow">
            <span className="eyebrow-dot" />
            <span>Finance & Accounts</span>
          </div>
          <h1 style={{ margin: 0, fontSize: '2rem' }}>Payment Verification Desk</h1>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['Pending Verification', 'Verified', 'Rejected', ''].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`btn btn-sm ${filter === tab ? 'btn-primary' : 'btn-outline'}`}
            >
              {tab || 'All Records'}
            </button>
          ))}
        </div>
      </div>

      <DataTable
        columns={columns}
        data={payments}
        loading={loading}
        emptyMessage="No payments currently in this status queue."
      />

      <Pagination
        total={pagination.total}
        limit={pagination.limit}
        offset={pagination.offset}
        onPageChange={(newOffset) => fetchPayments(newOffset)}
      />

      {/* Confirmation Dialog for Verifying */}
      <ConfirmationDialog
        isOpen={!!verifyTarget}
        onClose={() => setVerifyTarget(null)}
        onConfirm={handleVerify}
        loading={verifyLoading}
        title="Verify Payment"
        message={`Confirm receipt of ₹100 registration fee for ${verifyTarget?.name}? This will mark their profile Verified and send a confirmation email.`}
        confirmText="Yes, Verify Payment"
        confirmVariant="primary"
      />

      {/* Reject Modal */}
      <Modal
        isOpen={!!rejectTarget}
        onClose={() => { setRejectTarget(null); setRejectReason(''); }}
        title="Reject Payment Proof"
        maxWidth="460px"
      >
        <form onSubmit={handleReject}>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Provide a clear explanation to <strong>{rejectTarget?.name}</strong> regarding why their screenshot was rejected so they can re-upload.
          </p>

          <div className="form-group">
            <label className="form-label">Rejection Reason</label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="e.g. Transaction UTR reference unreadable, amount mismatch, etc."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <Button variant="outline" size="sm" onClick={() => setRejectTarget(null)}>
              Cancel
            </Button>
            <Button type="submit" variant="danger" size="sm" loading={rejectLoading}>
              Reject Proof
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
