import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import DataTable from '../components/DataTable';
import Pagination from '../components/Pagination';
import Modal from '../components/Modal';
import Button from '../components/Button';
import { showToast } from '../components/Toast';
import { Search, Filter, Eye, ExternalLink, ShieldCheck, Download } from 'lucide-react';

export default function AdminParticipants() {
  const [registrations, setRegistrations] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, limit: 15, offset: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Participant Detail Modal State
  const [selectedUid, setSelectedUid] = useState(null);
  const [participantDetail, setParticipantDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchParticipants = async (offset = 0) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        limit: pagination.limit,
        offset,
      });
      if (search.trim()) params.append('search', search.trim());
      if (statusFilter) params.append('status', statusFilter);

      const res = await api.get(`/api/admin/registrations?${params.toString()}`);
      if (res?.data) {
        setRegistrations(res.data.registrations || []);
        setPagination(res.data.pagination || { total: 0, limit: 15, offset: 0 });
      }
    } catch (err) {
      console.error('[AdminParticipants] Error:', err);
      showToast(err.message || 'Failed to fetch participants.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParticipants(0);
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchParticipants(0);
  };

  const openDetailModal = async (uid) => {
    setSelectedUid(uid);
    setDetailLoading(true);
    try {
      const res = await api.get(`/api/admin/participant/${uid}`);
      if (res?.data) {
        setParticipantDetail(res.data);
      }
    } catch (err) {
      showToast(err.message || 'Failed to load participant detail.', 'error');
    } finally {
      setDetailLoading(false);
    }
  };

  const columns = [
    {
      header: 'Name',
      key: 'name',
      render: (name, row) => (
        <div>
          <strong style={{ color: 'var(--text-primary)' }}>{name}</strong>
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>{row.email}</p>
        </div>
      ),
    },
    {
      header: 'College / Institute',
      key: 'college',
      render: (college) => <span style={{ fontSize: '0.85rem' }}>{college}</span>,
    },
    {
      header: 'Track',
      key: 'track',
      render: (track) => <span className="badge badge-info">{track}</span>,
    },
    {
      header: 'Payment Status',
      key: 'paymentStatus',
      render: (status) => (
        <span className={`badge badge-${status === 'Verified' ? 'success' : status === 'Rejected' ? 'error' : 'pending'}`}>
          {status}
        </span>
      ),
    },
    {
      header: 'Registration Date',
      key: 'createdAt',
      render: (d) => <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{d ? new Date(d).toLocaleDateString() : '—'}</span>,
    },
    {
      header: 'Actions',
      key: 'uid',
      align: 'right',
      render: (uid) => (
        <Button variant="outline" size="sm" onClick={() => openDetailModal(uid)}>
          <Eye size={14} />
          <span>View</span>
        </Button>
      ),
    },
  ];

  return (
    <div className="container animate-fade-in" style={{ padding: '3.5rem 1.5rem 5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <div className="eyebrow">
            <span className="eyebrow-dot" />
            <span>Admin Portal</span>
          </div>
          <h1 style={{ margin: 0, fontSize: '2rem' }}>Registered Participants</h1>
        </div>

        {/* Filter & Search Bar */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Search name, email, college..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '220px', padding: '0.5rem 0.85rem', fontSize: '0.85rem' }}
            />
            <Button type="submit" variant="secondary" size="sm">
              <Search size={14} />
            </Button>
          </form>

          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ width: '180px', padding: '0.5rem 0.85rem', fontSize: '0.85rem' }}
          >
            <option value="">All Payment Statuses</option>
            <option value="Verified">Verified</option>
            <option value="Pending Verification">Pending Verification</option>
            <option value="Pending Payment">Pending Payment</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <DataTable
        columns={columns}
        data={registrations}
        loading={loading}
        emptyMessage="No participants match the specified filter criteria."
      />

      <Pagination
        total={pagination.total}
        limit={pagination.limit}
        offset={pagination.offset}
        onPageChange={(newOffset) => fetchParticipants(newOffset)}
      />

      {/* Detail Modal */}
      <Modal
        isOpen={!!selectedUid}
        onClose={() => { setSelectedUid(null); setParticipantDetail(null); }}
        title="Participant Details"
        maxWidth="680px"
      >
        {detailLoading || !participantDetail ? (
          <div style={{ padding: '2rem 0', textAlign: 'center' }}>
            <p>Loading participant dossier...</p>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
              <div>
                <h3 style={{ margin: '0 0 0.25rem', color: 'var(--text-primary)' }}>{participantDetail.registration.name}</h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--accent-teal)' }}>{participantDetail.registration.email}</p>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>{participantDetail.registration.college} • {participantDetail.registration.phone}</p>
              </div>
              <span className={`badge badge-${participantDetail.registration.paymentStatus === 'Verified' ? 'success' : 'pending'}`}>
                {participantDetail.registration.paymentStatus}
              </span>
            </div>

            {/* Payment Proof Section */}
            <div style={{ marginBottom: '1.5rem', background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ margin: 0, fontSize: '0.95rem', color: 'var(--dark-teal)' }}>Payment Screenshot Proof</h4>
                {participantDetail.registration.paymentProofSignedUrl ? (
                  <a
                    href={participantDetail.registration.paymentProofSignedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline btn-sm"
                  >
                    <ExternalLink size={14} />
                    <span>Open Full Image (Authorized Signed URL)</span>
                  </a>
                ) : (
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No screenshot uploaded</span>
                )}
              </div>
            </div>

            {/* Submission Section */}
            <div>
              <h4 style={{ color: 'var(--dark-teal)', marginBottom: '0.75rem' }}>Research Paper Submission</h4>
              {participantDetail.submission ? (
                <div style={{ background: 'var(--bg-secondary)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span className="badge badge-info">{participantDetail.submission.track}</span>
                    <span className={`badge badge-${participantDetail.submission.status === 'Accepted' ? 'success' : 'pending'}`}>
                      {participantDetail.submission.status}
                    </span>
                  </div>
                  <h4 style={{ color: 'var(--text-primary)', margin: '0.5rem 0' }}>{participantDetail.submission.title}</h4>
                  <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    {participantDetail.submission.abstract}
                  </p>

                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    {participantDetail.submission.abstractSignedUrl && (
                      <a href={participantDetail.submission.abstractSignedUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
                        <ExternalLink size={14} /> Abstract PDF
                      </a>
                    )}
                    {participantDetail.submission.posterSignedUrl && (
                      <a href={participantDetail.submission.posterSignedUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
                        <ExternalLink size={14} /> Poster File
                      </a>
                    )}
                  </div>
                </div>
              ) : (
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Participant has not yet submitted an abstract.</p>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
