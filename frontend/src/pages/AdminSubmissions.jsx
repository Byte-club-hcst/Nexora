import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import DataTable from '../components/DataTable';
import Pagination from '../components/Pagination';
import Modal from '../components/Modal';
import Button from '../components/Button';
import { showToast } from '../components/Toast';
import { Search, CheckCircle, XCircle, ExternalLink, FileText, Filter } from 'lucide-react';

export default function AdminSubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, limit: 15, offset: 0 });
  const [loading, setLoading] = useState(true);

  const [trackFilter, setTrackFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');

  // Review Dialog State
  const [reviewTarget, setReviewTarget] = useState(null);
  const [reviewStatus, setReviewStatus] = useState('Accepted');
  const [feedback, setFeedback] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);

  const fetchSubmissions = async (offset = 0) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        limit: pagination.limit,
        offset,
      });
      if (trackFilter) params.append('track', trackFilter);
      if (statusFilter) params.append('status', statusFilter);
      if (search.trim()) params.append('search', search.trim());

      const res = await api.get(`/api/admin/submissions?${params.toString()}`);
      if (res?.data) {
        setSubmissions(res.data.submissions || []);
        setPagination(res.data.pagination || { total: 0, limit: 15, offset: 0 });
      }
    } catch (err) {
      console.error('[AdminSubmissions] Error:', err);
      showToast(err.message || 'Failed to fetch submissions.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions(0);
  }, [trackFilter, statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchSubmissions(0);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewTarget) return;

    setReviewLoading(true);
    try {
      await api.patch(`/api/admin/submissions/${reviewTarget.id}/review`, {
        status: reviewStatus,
        feedback: feedback.trim(),
      });
      showToast(`Submission marked as ${reviewStatus}!`, 'success');
      setReviewTarget(null);
      setFeedback('');
      fetchSubmissions(pagination.offset);
    } catch (err) {
      showToast(err.message || 'Failed to update submission review.', 'error');
    } finally {
      setReviewLoading(false);
    }
  };

  const openFile = async (uid, fileType) => {
    try {
      const res = await api.get(`/api/admin/participant/${uid}/file-url?fileType=${fileType}`);
      if (res?.data?.signedUrl) {
        window.open(res.data.signedUrl, '_blank');
      } else {
        showToast('File URL not found.', 'error');
      }
    } catch (err) {
      showToast(err.message || 'Failed to retrieve file.', 'error');
    }
  };

  const columns = [
    {
      header: 'Paper Title',
      key: 'title',
      render: (title, row) => (
        <div style={{ maxWidth: '280px' }}>
          <strong style={{ color: '#fff', fontSize: '0.9rem' }}>{title}</strong>
          <p style={{ margin: '0.2rem 0 0', fontSize: '0.78rem', color: 'var(--accent-cream)' }}>
            Keywords: {row.keywords || '—'}
          </p>
        </div>
      ),
    },
    {
      header: 'Authors',
      key: 'authors',
      render: (authors) => {
        const list = Array.isArray(authors) ? authors : [];
        return (
          <div style={{ fontSize: '0.8rem', lineHeight: 1.4 }}>
            {list.map((a, i) => (
              <div key={i} style={{ color: i === 0 ? 'var(--accent-teal-light)' : 'var(--text-secondary)' }}>
                {a.name} ({a.branch || a.course})
              </div>
            ))}
          </div>
        );
      },
    },
    {
      header: 'Track',
      key: 'track',
      render: (t) => <span className="badge badge-info">{t}</span>,
    },
    {
      header: 'Files',
      key: 'id',
      render: (id, row) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          {row.abstractKey && (
            <button
              onClick={() => openFile(id, 'abstract')}
              style={{ background: 'none', border: 'none', color: 'var(--accent-teal-light)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem' }}
            >
              <ExternalLink size={12} /> Abstract PDF
            </button>
          )}
          {row.posterKey && (
            <button
              onClick={() => openFile(id, 'poster')}
              style={{ background: 'none', border: 'none', color: 'var(--accent-teal-light)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem' }}
            >
              <ExternalLink size={12} /> Poster
            </button>
          )}
        </div>
      ),
    },
    {
      header: 'Status',
      key: 'status',
      render: (status) => (
        <span className={`badge badge-${status === 'Accepted' ? 'success' : status === 'Rejected' ? 'error' : 'pending'}`}>
          {status}
        </span>
      ),
    },
    {
      header: 'Review Action',
      key: 'id',
      align: 'right',
      render: (id, row) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setReviewTarget(row);
            setReviewStatus(row.status === 'Accepted' ? 'Accepted' : 'Accepted');
            setFeedback(row.adminFeedback || '');
          }}
        >
          <span>Evaluate</span>
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
            <span>Academic Committee</span>
          </div>
          <h1 style={{ margin: 0, fontSize: '2rem' }}>Abstract Submissions Review</h1>
        </div>

        {/* Filter Controls */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Search title, author..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '200px', padding: '0.5rem 0.85rem', fontSize: '0.85rem' }}
            />
            <Button type="submit" variant="secondary" size="sm">
              <Search size={14} />
            </Button>
          </form>

          <select
            className="form-select"
            value={trackFilter}
            onChange={(e) => setTrackFilter(e.target.value)}
            style={{ width: '160px', padding: '0.5rem 0.85rem', fontSize: '0.85rem' }}
          >
            <option value="">All Tracks</option>
            <option value="AI/ML">AI/ML</option>
            <option value="Data Science">Data Science</option>
            <option value="Emerging Tech">Emerging Tech</option>
            <option value="Sustainable Tech">Sustainable Tech</option>
            <option value="Interdisciplinary Innovation">Interdisciplinary</option>
          </select>

          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ width: '150px', padding: '0.5rem 0.85rem', fontSize: '0.85rem' }}
          >
            <option value="">All Statuses</option>
            <option value="Under Review">Under Review</option>
            <option value="Accepted">Accepted</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={submissions}
        loading={loading}
        emptyMessage="No paper submissions match the current filter."
      />

      <Pagination
        total={pagination.total}
        limit={pagination.limit}
        offset={pagination.offset}
        onPageChange={(newOffset) => fetchSubmissions(newOffset)}
      />

      {/* Evaluation Modal */}
      <Modal
        isOpen={!!reviewTarget}
        onClose={() => setReviewTarget(null)}
        title="Review Research Abstract"
        maxWidth="600px"
      >
        <form onSubmit={handleReviewSubmit}>
          <div style={{ marginBottom: '1.25rem' }}>
            <h4 style={{ color: '#fff', margin: '0 0 0.25rem' }}>{reviewTarget?.title}</h4>
            <span className="badge badge-info">{reviewTarget?.track}</span>
          </div>

          <div className="form-group">
            <label className="form-label">Decision <span className="required">*</span></label>
            <select
              className="form-select"
              value={reviewStatus}
              onChange={(e) => setReviewStatus(e.target.value)}
            >
              <option value="Accepted">Accept (Shortlist for Round 2 Oral Defense)</option>
              <option value="Rejected">Reject (Does not meet conference criteria)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Review Committee Feedback / Comments</label>
            <textarea
              className="form-textarea"
              rows={4}
              placeholder="Constructive feedback to be shared with the authors..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <Button variant="outline" size="sm" onClick={() => setReviewTarget(null)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" loading={reviewLoading}>
              Save Evaluation
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
