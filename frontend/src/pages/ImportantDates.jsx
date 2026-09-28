import React from 'react';
import { useEvent } from '../context/EventContext';
import { Calendar, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ImportantDates() {
  const { config, formatIST } = useEvent();

  const dates = [
    {
      milestone: 'Registration Deadline',
      date: formatIST(config?.registrationDeadline || '2026-10-05T18:29:59.000Z'),
      desc: 'Final date for individual or team representatives to complete account creation and track selection.',
      status: 'upcoming',
    },
    {
      milestone: 'Abstract & Poster Submission Deadline',
      date: formatIST(config?.submissionDeadline || '2026-09-30T18:29:59.000Z'),
      desc: 'All abstracts (~150 words) and research posters must be uploaded in PDF/image format through the portal.',
      status: 'active',
      highlight: true,
    },
    {
      milestone: 'Acceptance Notification',
      date: '08 October 2026, 06:00 PM IST',
      desc: 'Results of the Round 1 review committee announced. Shortlisted teams notified by email.',
      status: 'upcoming',
    },
    {
      milestone: 'Registration Fee Payment Deadline',
      date: formatIST(config?.paymentDeadline || '2026-10-07T18:29:59.000Z'),
      desc: 'Upload UPI screenshot of ₹100 registration fee to finalize delegate credentials.',
      status: 'upcoming',
    },
    {
      milestone: 'Full Research Paper Submission Deadline',
      date: '12 October 2026, 11:59 PM IST',
      desc: 'Final full-length paper submission for all candidates proceeding to Round 2 oral evaluation.',
      status: 'upcoming',
    },
    {
      milestone: 'Conference Day & Oral Presentations',
      date: formatIST(config?.eventStart || '2026-10-14T04:30:00.000Z') + ' – 05:00 PM IST',
      desc: 'Live conference proceedings at Dr. A.P.J. Abdul Kalam Auditorium, HCST Campus.',
      status: 'grand',
    },
  ];

  return (
    <div className="container animate-fade-in" style={{ padding: '3.5rem 1.5rem 5rem' }}>
      <div style={{ maxWidth: '850px', margin: '0 auto' }}>
        <div className="eyebrow">
          <span className="eyebrow-dot" />
          <span>Deadlines & Milestones</span>
        </div>
        <h1 style={{ marginBottom: '1rem' }}>
          Important <span className="heading-gradient">Dates</span>
        </h1>
        <p style={{ fontSize: '1.1rem', marginBottom: '2.5rem' }}>
          All times are observed strictly in <strong>Indian Standard Time (IST / Asia/Kolkata)</strong>.
          Participants are strongly advised to submit materials well ahead of closing hours to avoid server congestion.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '3rem' }}>
          {dates.map((item, idx) => (
            <div
              key={idx}
              className="card"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
                padding: '1.5rem 1.75rem',
                borderLeft: item.highlight ? '4px solid var(--accent-amber)' : item.status === 'grand' ? '4px solid var(--accent-teal-light)' : '1px solid var(--border)',
              }}
            >
              <div style={{ flex: 1, minWidth: '260px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <Calendar size={18} color="var(--accent-teal-light)" />
                  <h3 style={{ margin: 0, fontSize: '1.15rem' }}>{item.milestone}</h3>
                </div>
                <p style={{ margin: 0, fontSize: '0.875rem' }}>{item.desc}</p>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span
                  style={{
                    display: 'inline-block',
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: item.highlight ? 'var(--accent-amber)' : 'var(--text-bright)',
                    fontFamily: 'monospace',
                    background: 'rgba(0, 0, 0, 0.4)',
                    padding: '0.35rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border)',
                  }}
                >
                  {item.date}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', background: 'rgba(45, 212, 191, 0.05)' }}>
          <div>
            <h4 style={{ margin: '0 0 0.25rem' }}>Need an extension or technical help?</h4>
            <p style={{ margin: 0, fontSize: '0.85rem' }}>Our student coordination desk is available on WhatsApp and phone.</p>
          </div>
          <Link to="/contact" className="btn btn-outline btn-sm">
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
