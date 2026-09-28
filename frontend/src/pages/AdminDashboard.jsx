import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import Loader from '../components/Loader';
import ErrorState from '../components/ErrorState';
import { Users, CreditCard, FileText, CheckCircle, Clock, XCircle, TrendingUp, Settings, Bell, ExternalLink } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/api/admin/dashboard');
      if (res?.data?.stats) {
        setStats(res.data.stats);
      }
    } catch (err) {
      console.error('[AdminDashboard] Fetch error:', err);
      setError(err.message || 'Failed to load dashboard metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return <Loader fullScreen message="Loading administrative metrics..." />;
  }

  if (error) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem' }}>
        <ErrorState title="Admin Dashboard Error" message={error} onRetry={fetchStats} />
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ padding: '3.5rem 1.5rem 5rem' }}>
      {/* Admin Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2.5rem',
        }}
      >
        <div>
          <div className="eyebrow">
            <span className="eyebrow-dot" />
            <span>Administrative Command</span>
          </div>
          <h1 style={{ margin: 0, fontSize: '2.2rem' }}>Conference Overview</h1>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/admin/payments" className="btn btn-primary btn-sm">
            <CreditCard size={16} />
            <span>Verify Payments ({stats?.payments?.pendingVerification || 0})</span>
          </Link>
          <Link to="/admin/submissions" className="btn btn-secondary btn-sm">
            <FileText size={16} />
            <span>Review Submissions ({stats?.submissions?.underReview || 0})</span>
          </Link>
          <Link to="/admin/settings" className="btn btn-outline btn-sm">
            <Settings size={16} />
            <span>Event Settings</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid-4" style={{ marginBottom: '2.5rem' }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Total Registrations</span>
            <Users size={20} color="var(--accent-teal)" />
          </div>
          <h2 style={{ fontSize: '2.2rem', margin: '0.25rem 0', color: 'var(--text-primary)' }}>{stats?.totalRegistrations || 0}</h2>
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--accent-teal)' }}>Registered Delegates</p>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Payment Verification</span>
            <Clock size={20} color="var(--accent-amber)" />
          </div>
          <h2 style={{ fontSize: '2.2rem', margin: '0.25rem 0', color: 'var(--accent-amber)' }}>{stats?.payments?.pendingVerification || 0}</h2>
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            {stats?.payments?.verified || 0} Verified • {stats?.payments?.pendingPayment || 0} Pending
          </p>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Abstract Submissions</span>
            <FileText size={20} color="var(--accent-teal)" />
          </div>
          <h2 style={{ fontSize: '2.2rem', margin: '0.25rem 0', color: 'var(--text-primary)' }}>{stats?.submissions?.total || 0}</h2>
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--status-success)' }}>
            {stats?.submissions?.accepted || 0} Accepted • {stats?.submissions?.underReview || 0} Under Review
          </p>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Collected Fees</span>
            <TrendingUp size={20} color="var(--status-success)" />
          </div>
          <h2 style={{ fontSize: '2.2rem', margin: '0.25rem 0', color: 'var(--status-success)' }}>₹{stats?.estimatedRevenue || 0}</h2>
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>From {stats?.payments?.verified || 0} verified participants</p>
        </div>
      </div>

      {/* Track Distribution & Quick Actions */}
      <div className="grid-2" style={{ gap: '2rem' }}>
        {/* Track breakdown */}
        <div className="card">
          <h3 style={{ marginBottom: '1.25rem', color: 'var(--dark-teal)' }}>Registration by Track</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {Object.entries(stats?.tracks || {}).map(([trackName, count]) => {
              const total = stats?.totalRegistrations || 1;
              const pct = Math.round((count / (total || 1)) * 100);
              return (
                <div key={trackName}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.3rem' }}>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{trackName}</span>
                    <span style={{ color: 'var(--accent-teal)', fontWeight: 600 }}>{count} ({pct}%)</span>
                  </div>
                  <div style={{ height: '8px', background: 'var(--bg-secondary)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${pct}%`,
                        background: 'var(--accent-teal)',
                        borderRadius: '4px',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Operations */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ marginBottom: '1.25rem', color: 'var(--dark-teal)' }}>Administrative Sections</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <Link
                to="/admin/participants"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.85rem 1rem',
                  background: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Users size={18} color="var(--accent-teal)" />
                  <span>Participant Database & Profiles</span>
                </div>
                <ExternalLink size={16} />
              </Link>

              <Link
                to="/admin/payments"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.85rem 1rem',
                  background: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-bright)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <CreditCard size={18} color="var(--accent-amber)" />
                  <span>Payment Proof Verification Queue</span>
                </div>
                <ExternalLink size={16} />
              </Link>

              <Link
                to="/admin/submissions"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.85rem 1rem',
                  background: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-bright)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <FileText size={18} color="var(--accent-cyan)" />
                  <span>Abstract Review & Scoring</span>
                </div>
                <ExternalLink size={16} />
              </Link>
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border)' }}>
            <Link to="/admin/settings" className="btn btn-outline" style={{ width: '100%' }}>
              <Settings size={16} />
              <span>Configure Event Dates & Announcements</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
