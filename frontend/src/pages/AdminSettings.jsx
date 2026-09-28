import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useEvent } from '../context/EventContext';
import Button from '../components/Button';
import Loader from '../components/Loader';
import Modal from '../components/Modal';
import DataTable from '../components/DataTable';
import { showToast } from '../components/Toast';
import { Settings, Bell, Shield, Plus, Trash2, Calendar, Save } from 'lucide-react';

export default function AdminSettings() {
  const { config: globalConfig, refreshConfig } = useEvent();
  const [activeTab, setActiveTab] = useState('config'); // 'config' | 'announcements' | 'audit'

  // Config Form State
  const [formData, setFormData] = useState({
    eventName: '',
    eventDescription: '',
    contactEmail: '',
    registrationFee: 100,
    registrationOpen: true,
    registrationDeadline: '',
    submissionOpen: true,
    submissionDeadline: '',
    venue: '',
  });
  const [configSaving, setConfigSaving] = useState(false);

  // Announcements State
  const [announcements, setAnnouncements] = useState([]);
  const [announcementModalOpen, setAnnouncementModalOpen] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '', priority: 'normal', category: 'general' });
  const [announcementSaving, setAnnouncementSaving] = useState(false);

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState([]);
  const [logsLoading, setLogsLoading] = useState(false);

  useEffect(() => {
    if (globalConfig) {
      setFormData({
        eventName: globalConfig.eventName || '',
        eventDescription: globalConfig.eventDescription || '',
        contactEmail: globalConfig.contactEmail || '',
        registrationFee: globalConfig.registrationFee || 100,
        registrationOpen: globalConfig.registrationOpen !== false,
        registrationDeadline: globalConfig.registrationDeadline ? globalConfig.registrationDeadline.slice(0, 16) : '',
        submissionOpen: globalConfig.submissionOpen !== false,
        submissionDeadline: globalConfig.submissionDeadline ? globalConfig.submissionDeadline.slice(0, 16) : '',
        venue: globalConfig.venue || '',
      });
    }
    fetchAnnouncements();
  }, [globalConfig]);

  const fetchAnnouncements = async () => {
    try {
      const res = await api.get('/api/event/announcements');
      if (res?.data?.announcements) {
        setAnnouncements(res.data.announcements);
      }
    } catch (err) {
      console.warn('Announcements error:', err);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      setLogsLoading(true);
      const res = await api.get('/api/admin/audit-logs?limit=50');
      if (res?.data?.logs) {
        setAuditLogs(res.data.logs);
      }
    } catch (err) {
      showToast('Failed to load audit logs.', 'error');
    } finally {
      setLogsLoading(false);
    }
  };

  const handleConfigSubmit = async (e) => {
    e.preventDefault();
    setConfigSaving(true);
    try {
      await api.put('/api/admin/event-config', {
        ...formData,
        registrationFee: Number(formData.registrationFee),
        registrationDeadline: formData.registrationDeadline ? new Date(formData.registrationDeadline).toISOString() : null,
        submissionDeadline: formData.submissionDeadline ? new Date(formData.submissionDeadline).toISOString() : null,
      });
      showToast('Event configuration updated successfully!', 'success');
      refreshConfig();
    } catch (err) {
      showToast(err.message || 'Failed to update event configuration.', 'error');
    } finally {
      setConfigSaving(false);
    }
  };

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    if (!newAnnouncement.title || !newAnnouncement.content) {
      showToast('Title and content are required.', 'error');
      return;
    }

    setAnnouncementSaving(true);
    try {
      await api.post('/api/admin/announcements', newAnnouncement);
      showToast('Announcement published successfully!', 'success');
      setAnnouncementModalOpen(false);
      setNewAnnouncement({ title: '', content: '', priority: 'normal', category: 'general' });
      fetchAnnouncements();
    } catch (err) {
      showToast(err.message || 'Failed to post announcement.', 'error');
    } finally {
      setAnnouncementSaving(false);
    }
  };

  const handleDeleteAnnouncement = async (id) => {
    if (!window.confirm('Delete this announcement?')) return;
    try {
      await api.delete(`/api/admin/announcements/${id}`);
      showToast('Announcement removed.', 'info');
      fetchAnnouncements();
    } catch (err) {
      showToast(err.message || 'Failed to delete announcement.', 'error');
    }
  };

  const auditColumns = [
    {
      header: 'Action',
      key: 'action',
      render: (act) => <span className="badge badge-info">{act}</span>,
    },
    {
      header: 'Admin / Operator',
      key: 'adminUid',
      render: (uid) => <span style={{ fontSize: '0.8rem', fontFamily: 'monospace' }}>{uid}</span>,
    },
    {
      header: 'Target ID',
      key: 'targetUid',
      render: (uid) => <span style={{ fontSize: '0.8rem', fontFamily: 'monospace' }}>{uid || '—'}</span>,
    },
    {
      header: 'Timestamp (UTC)',
      key: 'timestamp',
      render: (ts) => <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{ts ? new Date(ts).toLocaleString() : '—'}</span>,
    },
  ];

  return (
    <div className="container animate-fade-in" style={{ padding: '3.5rem 1.5rem 5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <div className="eyebrow">
            <span className="eyebrow-dot" />
            <span>Event Management</span>
          </div>
          <h1 style={{ margin: 0, fontSize: '2rem' }}>Settings & Audit Log</h1>
        </div>

        {/* Tab switchers */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setActiveTab('config')}
            className={`btn btn-sm ${activeTab === 'config' ? 'btn-primary' : 'btn-outline'}`}
          >
            <Settings size={14} />
            <span>Event Configuration</span>
          </button>
          <button
            onClick={() => setActiveTab('announcements')}
            className={`btn btn-sm ${activeTab === 'announcements' ? 'btn-primary' : 'btn-outline'}`}
          >
            <Bell size={14} />
            <span>Announcements ({announcements.length})</span>
          </button>
          <button
            onClick={() => { setActiveTab('audit'); fetchAuditLogs(); }}
            className={`btn btn-sm ${activeTab === 'audit' ? 'btn-primary' : 'btn-outline'}`}
          >
            <Shield size={14} />
            <span>Audit Trail</span>
          </button>
        </div>
      </div>

      {/* TAB 1: EVENT CONFIGURATION */}
      {activeTab === 'config' && (
        <div className="card" style={{ maxWidth: '780px', padding: '2.5rem' }}>
          <h3 style={{ marginBottom: '1.5rem', color: '#fff' }}>Dynamic Event Parameters</h3>
          <form onSubmit={handleConfigSubmit}>
            <div className="grid-2" style={{ gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">Event Name</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={formData.eventName}
                  onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Contact Email</label>
                <input
                  type="email"
                  required
                  className="form-input"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Event Tagline / Subtitle</label>
              <input
                type="text"
                className="form-input"
                value={formData.eventDescription}
                onChange={(e) => setFormData({ ...formData, eventDescription: e.target.value })}
              />
            </div>

            <div className="grid-2" style={{ gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">Registration Fee (INR ₹)</label>
                <input
                  type="number"
                  min="0"
                  required
                  className="form-input"
                  value={formData.registrationFee}
                  onChange={(e) => setFormData({ ...formData, registrationFee: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Conference Venue</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                />
              </div>
            </div>

            <div className="grid-2" style={{ gap: '1.25rem', marginTop: '0.5rem', padding: '1.25rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: '#fff', marginBottom: '0.5rem' }}>
                  <input
                    type="checkbox"
                    checked={formData.registrationOpen}
                    onChange={(e) => setFormData({ ...formData, registrationOpen: e.target.checked })}
                  />
                  <span>Registrations Open</span>
                </label>
                <label className="form-label" style={{ fontSize: '0.8rem' }}>Registration Deadline (UTC / Local)</label>
                <input
                  type="datetime-local"
                  className="form-input"
                  value={formData.registrationDeadline}
                  onChange={(e) => setFormData({ ...formData, registrationDeadline: e.target.value })}
                />
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: '#fff', marginBottom: '0.5rem' }}>
                  <input
                    type="checkbox"
                    checked={formData.submissionOpen}
                    onChange={(e) => setFormData({ ...formData, submissionOpen: e.target.checked })}
                  />
                  <span>Submissions Open</span>
                </label>
                <label className="form-label" style={{ fontSize: '0.8rem' }}>Submission Deadline (UTC / Local)</label>
                <input
                  type="datetime-local"
                  className="form-input"
                  value={formData.submissionDeadline}
                  onChange={(e) => setFormData({ ...formData, submissionDeadline: e.target.value })}
                />
              </div>
            </div>

            <div style={{ marginTop: '2rem' }}>
              <Button type="submit" variant="primary" loading={configSaving}>
                <Save size={16} />
                <span>Save Event Configuration</span>
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: ANNOUNCEMENTS */}
      {activeTab === 'announcements' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
            <Button variant="primary" size="sm" onClick={() => setAnnouncementModalOpen(true)}>
              <Plus size={16} />
              <span>Post Announcement</span>
            </Button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {announcements.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                <p>No active announcements posted.</p>
              </div>
            ) : (
              announcements.map((a) => (
                <div key={a.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '1.5rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                      <span className={`badge badge-${a.priority === 'urgent' ? 'error' : 'info'}`}>{a.priority}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(a.createdAt).toLocaleString()}</span>
                    </div>
                    <h3 style={{ margin: '0 0 0.4rem', color: '#fff' }}>{a.title}</h3>
                    <p style={{ margin: 0, fontSize: '0.9rem' }}>{a.content}</p>
                  </div>
                  <Button variant="danger" size="sm" onClick={() => handleDeleteAnnouncement(a.id)}>
                    <Trash2 size={14} />
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 3: AUDIT TRAIL */}
      {activeTab === 'audit' && (
        <div>
          <DataTable
            columns={auditColumns}
            data={auditLogs}
            loading={logsLoading}
            emptyMessage="No audit logs recorded yet."
          />
        </div>
      )}

      {/* Post Announcement Modal */}
      <Modal
        isOpen={announcementModalOpen}
        onClose={() => setAnnouncementModalOpen(false)}
        title="Post New Announcement"
        maxWidth="500px"
      >
        <form onSubmit={handleCreateAnnouncement}>
          <div className="form-group">
            <label className="form-label">Title <span className="required">*</span></label>
            <input
              type="text"
              required
              className="form-input"
              placeholder="e.g. Deadline extended for Track 2"
              value={newAnnouncement.title}
              onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
            />
          </div>

          <div className="grid-2" style={{ gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Priority</label>
              <select
                className="form-select"
                value={newAnnouncement.priority}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, priority: e.target.value })}
              >
                <option value="normal">Normal</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={newAnnouncement.category}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, category: e.target.value })}
              >
                <option value="general">General</option>
                <option value="deadline">Deadline</option>
                <option value="schedule">Schedule</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Message Content <span className="required">*</span></label>
            <textarea
              required
              rows={4}
              className="form-textarea"
              placeholder="Details of the announcement visible to all delegates..."
              value={newAnnouncement.content}
              onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <Button variant="outline" size="sm" onClick={() => setAnnouncementModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" loading={announcementSaving}>
              Post Announcement
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
