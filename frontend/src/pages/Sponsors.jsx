import React from 'react';
import { Award, Briefcase, Mail, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Sponsors() {
  const sponsors = [
    {
      tier: 'Host Institution & Academic Sponsor',
      name: 'Hindustan College of Science & Technology',
      desc: 'NAAC A+ accredited institution providing auditorium facilities, high-speed campus fiber networking, and faculty jury panels.',
      badge: 'Platinum',
    },
    {
      tier: 'Technical Student Chapter',
      name: 'BYTE CLUB (Department of CSE)',
      desc: 'Technical infrastructure, paper review portal maintenance, student hackathon mentorship, and algorithmic workshops.',
      badge: 'Partner',
    },
    {
      tier: 'Innovation Student Chapter',
      name: 'QUBIT TECH SOCIETY (Department of IT)',
      desc: 'Networking infrastructure, live streaming coordination, technical workshops, and delegate hospitality.',
      badge: 'Partner',
    },
  ];

  return (
    <div className="container animate-fade-in" style={{ padding: '3.5rem 1.5rem 5rem' }}>
      <div style={{ maxWidth: '850px', margin: '0 auto' }}>
        <div className="eyebrow">
          <span className="eyebrow-dot" />
          <span>Partners & Backers</span>
        </div>
        <h1 style={{ marginBottom: '1rem' }}>
          Sponsors & <span className="heading-gradient">Academic Partners</span>
        </h1>
        <p style={{ fontSize: '1.1rem', marginBottom: '3rem' }}>
          We extend our sincere gratitude to our institutional patrons, technical associations, and industry collaborators.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', marginBottom: '3rem' }}>
          {sponsors.map((sp, idx) => (
            <div key={idx} className="card" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span className="badge badge-success">{sp.badge}</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--accent-cream)', fontWeight: 600 }}>{sp.tier}</span>
              </div>
              <h2 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '0.5rem' }}>{sp.name}</h2>
              <p style={{ margin: 0, fontSize: '0.95rem' }}>{sp.desc}</p>
            </div>
          ))}
        </div>

        {/* Sponsor Call to Action */}
        <div
          className="card"
          style={{
            background: 'linear-gradient(135deg, rgba(13, 38, 38, 0.9) 0%, rgba(20, 60, 60, 0.9) 100%)',
            border: '1px solid var(--accent-teal)',
            padding: '2.5rem',
            textAlign: 'center',
          }}
        >
          <Sparkles size={32} color="var(--accent-amber)" style={{ marginBottom: '1rem' }} />
          <h2 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '0.75rem' }}>
            Interested in Sponsoring NEXORA 2026?
          </h2>
          <p style={{ maxWidth: '600px', margin: '0 auto 1.5rem' }}>
            Showcase your brand and recruit promising student engineers from North India's premier engineering institutions. We offer custom promotional packages, branding in conference proceedings, and keynote speaking slots.
          </p>
          <a href="mailto:nexora2026@hcst.edu.in?subject=Sponsorship%20Inquiry%20-%20NEXORA%202026" className="btn btn-primary">
            <Mail size={16} />
            <span>Inquire for Sponsorship</span>
          </a>
        </div>
      </div>
    </div>
  );
}
