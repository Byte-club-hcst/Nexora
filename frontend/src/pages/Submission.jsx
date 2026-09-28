import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEvent } from '../context/EventContext';
import { api } from '../services/api';
import Button from '../components/Button';
import Loader from '../components/Loader';
import FileUploader from '../components/FileUploader';
import { showToast } from '../components/Toast';
import { FileUp, Plus, Trash2, CheckCircle2, AlertCircle, FileText, ExternalLink, ArrowRight } from 'lucide-react';

export default function Submission() {
  const { currentUser, userProfile, loading: authLoading } = useAuth();
  const { config, formatIST } = useEvent();
  const [searchParams] = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [registration, setRegistration] = useState(null);
  const [existingSubmission, setExistingSubmission] = useState(null);

  const [title, setTitle] = useState('');
  const [track, setTrack] = useState(searchParams.get('track') || '');
  const [abstractText, setAbstractText] = useState('');
  const [keywords, setKeywords] = useState('');
  const [authors, setAuthors] = useState([
    { name: '', course: 'B.Tech', branch: 'CSE', year: '3rd Year' },
  ]);

  const [abstractFile, setAbstractFile] = useState(null);
  const [posterFile, setPosterFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Check registration and existing submission
  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const [regRes, subRes] = await Promise.all([
          api.get('/api/registration/me').catch(() => null),
          api.get('/api/submission/me').catch(() => null),
        ]);

        if (regRes?.data?.registration) {
          setRegistration(regRes.data.registration);
          if (!track && regRes.data.registration.track) {
            setTrack(regRes.data.registration.track);
          }
        }

        if (subRes?.data?.submission) {
          setExistingSubmission(subRes.data.submission);
        } else if (userProfile) {
          setAuthors([
            {
              name: userProfile.name || '',
              course: 'B.Tech',
              branch: 'CSE',
              year: '3rd Year',
            },
          ]);
        }
      } catch (err) {
        console.warn('Submission fetch:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser, userProfile]);

  const addAuthor = () => {
    if (authors.length >= 4) {
      showToast('Maximum of 4 authors permitted per paper.', 'error');
      return;
    }
    setAuthors([...authors, { name: '', course: 'B.Tech', branch: 'CSE', year: '3rd Year' }]);
  };

  const removeAuthor = (index) => {
    if (authors.length <= 1) {
      showToast('At least one author must be specified.', 'error');
      return;
    }
    setAuthors(authors.filter((_, i) => i !== index));
  };

  const updateAuthor = (index, field, value) => {
    const updated = [...authors];
    updated[index][field] = value;
    setAuthors(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Pre-flight checks
    if (!title.trim()) {
      setError('Paper title is required.');
      return;
    }
    if (!track) {
      setError('Please select a research track.');
      return;
    }
    if (!abstractText.trim()) {
      setError('Abstract summary is required.');
      return;
    }
    if (!keywords.trim()) {
      setError('Keywords are required.');
      return;
    }
    for (let i = 0; i < authors.length; i++) {
      if (!authors[i].name.trim() || !authors[i].course.trim() || !authors[i].branch.trim() || !authors[i].year.trim()) {
        setError(`Please fill in all details for Author #${i + 1}.`);
        return;
      }
    }
    if (!abstractFile) {
      setError('Please attach your Abstract PDF document.');
      return;
    }
    if (!posterFile) {
      setError('Please attach your Research Poster file.');
      return;
    }

    setSubmitting(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('track', track);
    formData.append('abstract', abstractText);
    formData.append('keywords', keywords);
    formData.append('authors', JSON.stringify(authors));
    formData.append('abstractFile', abstractFile);
    formData.append('posterFile', posterFile);

    try {
      const res = await api.upload('/api/submission', formData);
      showToast('Abstract & Poster submitted successfully!', 'success');
      setExistingSubmission(res.data.submission);
    } catch (err) {
      console.error('[Submission] Error:', err);
      setError(err.message || 'Submission failed. Please verify files and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return <Loader fullScreen message="Loading submission portal..." />;
  }

  if (!currentUser) {
    return (
      <div className="container animate-fade-in" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
        <div className="card" style={{ maxWidth: '500px', margin: '0 auto', padding: '3rem 2rem' }}>
          <h2 style={{ marginBottom: '1rem' }}>Authentication Required</h2>
          <p style={{ marginBottom: '2rem' }}>Please log in to submit your abstract and research poster.</p>
          <Link to="/login" className="btn btn-primary">Sign In</Link>
        </div>
      </div>
    );
  }

  if (!registration) {
    return (
      <div className="container animate-fade-in" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
        <div className="card" style={{ maxWidth: '520px', margin: '0 auto', padding: '3rem 2rem' }}>
          <AlertCircle size={48} color="var(--accent-amber)" style={{ marginBottom: '1rem' }} />
          <h2 style={{ marginBottom: '1rem' }}>Complete Registration First</h2>
          <p style={{ marginBottom: '2rem' }}>
            You must complete your participant registration before submitting your abstract.
          </p>
          <Link to="/register" className="btn btn-primary">
            Go to Registration →
          </Link>
        </div>
      </div>
    );
  }

  if (existingSubmission) {
    return (
      <div className="container animate-fade-in" style={{ padding: '4rem 1.5rem' }}>
        <div style={{ maxWidth: '780px', margin: '0 auto' }}>
          <div className="card" style={{ padding: '3rem 2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <CheckCircle2 size={36} color="var(--status-success)" />
              <div>
                <h1 style={{ fontSize: '1.75rem', margin: 0 }}>Abstract Submitted</h1>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  Submission ID: {existingSubmission.id}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', border: '1px solid var(--border)' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Review Status:</span>
                <div style={{ marginTop: '0.2rem' }}>
                  <span className={`badge badge-${existingSubmission.status === 'Accepted' ? 'success' : existingSubmission.status === 'Rejected' ? 'error' : 'pending'}`} style={{ fontSize: '0.95rem' }}>
                    {existingSubmission.status}
                  </span>
                </div>
              </div>

              {existingSubmission.round2Eligible && (
                <span className="badge badge-success">Shortlisted for Round 2 Oral Defense</span>
              )}
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ color: 'var(--text-primary)', fontSize: '1.3rem', marginBottom: '0.5rem' }}>
                {existingSubmission.title}
              </h3>
              <span className="badge badge-info" style={{ marginBottom: '1rem' }}>{existingSubmission.track}</span>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
                {existingSubmission.abstract}
              </p>
              <p style={{ fontSize: '0.85rem', color: 'var(--accent-teal)', fontWeight: 600, marginTop: '0.75rem' }}>
                <strong>Keywords:</strong> {existingSubmission.keywords}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', paddingTop: '1.25rem', borderTop: '1px solid var(--border)' }}>
              {existingSubmission.abstractSignedUrl && (
                <a href={existingSubmission.abstractSignedUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
                  <ExternalLink size={14} />
                  <span>View Abstract PDF</span>
                </a>
              )}
              {existingSubmission.posterSignedUrl && (
                <a href={existingSubmission.posterSignedUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
                  <ExternalLink size={14} />
                  <span>View Research Poster</span>
                </a>
              )}
              <Link to="/dashboard" className="btn btn-secondary btn-sm" style={{ marginLeft: 'auto' }}>
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ padding: '3.5rem 1.5rem 5rem' }}>
      <div style={{ maxWidth: '820px', margin: '0 auto' }}>
        <div className="eyebrow">
          <span className="eyebrow-dot" />
          <span>Step 3 of 3</span>
        </div>
        <h1 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
          Abstract & Poster <span className="heading-gradient">Submission</span>
        </h1>
        <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>
          Submission Deadline: <strong>{formatIST(config?.submissionDeadline || '2026-09-30T18:29:59.000Z')}</strong>.
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
            <label className="form-label">Research Paper Title <span className="required">*</span></label>
            <input
              type="text"
              required
              className="form-input"
              placeholder="e.g. Edge-Optimized Neural Networks for Real-Time Sensor Telemetry"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Research Track <span className="required">*</span></label>
            <select
              required
              className="form-select"
              value={track}
              onChange={(e) => setTrack(e.target.value)}
            >
              <option value="">-- Choose Track --</option>
              <option value="AI/ML">Track 1: AI/ML</option>
              <option value="Data Science">Track 2: Data Science</option>
              <option value="Emerging Tech">Track 3: Emerging Tech</option>
              <option value="Sustainable Tech">Track 4: Sustainable Tech</option>
              <option value="Interdisciplinary Innovation">Track 5: Interdisciplinary Innovation</option>
            </select>
          </div>

          {/* Dynamic Authors Section (1 to 4 authors) */}
          <div style={{ margin: '1.75rem 0', padding: '1.25rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--text-primary)' }}>Authors (1 to 4)</h3>
              {authors.length < 4 && (
                <Button variant="outline" size="sm" onClick={addAuthor}>
                  <Plus size={14} />
                  <span>Add Author</span>
                </Button>
              )}
            </div>

            {authors.map((author, index) => (
              <div
                key={index}
                style={{
                  padding: '1rem',
                  background: '#FFFFFF',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border)',
                  marginBottom: index < authors.length - 1 ? '1rem' : 0,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-teal)' }}>
                    Author #{index + 1} {index === 0 && '(Lead / Submitter)'}
                  </span>
                  {authors.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeAuthor(index)}
                      style={{ background: 'none', border: 'none', color: 'var(--status-error)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>

                <div className="grid-2" style={{ gap: '0.75rem' }}>
                  <div>
                    <label className="form-label" style={{ fontSize: '0.8rem' }}>Name *</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      placeholder="Full Name"
                      value={author.name}
                      onChange={(e) => updateAuthor(index, 'name', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="form-label" style={{ fontSize: '0.8rem' }}>Course *</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      placeholder="e.g. B.Tech / M.Tech / MCA"
                      value={author.course}
                      onChange={(e) => updateAuthor(index, 'course', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="form-label" style={{ fontSize: '0.8rem' }}>Branch *</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      placeholder="e.g. CSE / IT / ECE"
                      value={author.branch}
                      onChange={(e) => updateAuthor(index, 'branch', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="form-label" style={{ fontSize: '0.8rem' }}>Year *</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      placeholder="e.g. 3rd Year"
                      value={author.year}
                      onChange={(e) => updateAuthor(index, 'year', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="form-group">
            <label className="form-label">Abstract Summary (~150 words) <span className="required">*</span></label>
            <textarea
              required
              rows={5}
              className="form-textarea"
              placeholder="State the problem statement, proposed methodology, key observations, and potential applications..."
              value={abstractText}
              onChange={(e) => setAbstractText(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Keywords (comma-separated) <span className="required">*</span></label>
            <input
              type="text"
              required
              className="form-input"
              placeholder="e.g. Artificial Intelligence, Neural Networks, IoT, Cloud"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
            />
          </div>

          <div className="grid-2" style={{ gap: '1.25rem', marginTop: '1.5rem' }}>
            <FileUploader
              label="Abstract Document (PDF only, max 10MB) *"
              accept="application/pdf"
              maxSizeMB={10}
              selectedFile={abstractFile}
              onFileSelect={(file) => setAbstractFile(file)}
            />

            <FileUploader
              label="Research Poster (PDF / PNG / JPEG, max 10MB) *"
              accept="application/pdf,image/png,image/jpeg"
              maxSizeMB={10}
              selectedFile={posterFile}
              onFileSelect={(file) => setPosterFile(file)}
            />
          </div>

          <Button type="submit" variant="primary" loading={submitting} style={{ width: '100%', marginTop: '2rem' }}>
            <span>Submit Abstract & Poster</span>
            <FileUp size={16} />
          </Button>
        </form>
      </div>
    </div>
  );
}
