import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Phone, Globe, BookOpen, MessageCircle, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer
      style={{
        background: '#041010',
        borderTop: '1px solid var(--border)',
        padding: '3.5rem 1.5rem 2rem',
        marginTop: 'auto',
      }}
    >
      <div
        style={{
          maxWidth: 'var(--container-max)',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '2.5rem',
          marginBottom: '2.5rem',
        }}
      >
        {/* Col 1: Brand & Institution */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <img
              src="/images/hindustan-college-logo.png"
              alt="HCST"
              style={{ height: '40px', width: 'auto' }}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div>
              <h4 style={{ margin: 0, color: '#ffffff' }}>NEXORA 2026</h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--accent-teal-light)' }}>
                Student Innovation Conference
              </p>
            </div>
          </div>
          <p style={{ fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1rem' }}>
            A student research conference on emerging technologies and interdisciplinary innovation,
            hosted by <strong>BYTE CLUB (CSE)</strong> and <strong>QUBIT TECH SOCIETY (IT)</strong> at
            Hindustan College of Science & Technology, Farah, Mathura (NAAC A+ Accredited).
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <img
              src="/images/byte-logo.png"
              alt="Byte Club"
              style={{ height: '36px', width: 'auto', background: '#fff', padding: '2px', borderRadius: '6px' }}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <img
              src="/images/qubit-logo.jpeg"
              alt="Qubit Society"
              style={{ height: '36px', width: 'auto', background: '#fff', padding: '2px', borderRadius: '6px' }}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
        </div>

        {/* Col 2: Quick Links */}
        <div>
          <h4 style={{ color: '#ffffff', marginBottom: '1rem', borderBottom: '1px solid rgba(45, 212, 191, 0.2)', paddingBottom: '0.5rem' }}>
            Conference
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
            <li><Link to="/about">About NEXORA & HCST</Link></li>
            <li><Link to="/tracks">Research Tracks</Link></li>
            <li><Link to="/important-dates">Important Deadlines</Link></li>
            <li><Link to="/guidelines">Author Guidelines</Link></li>
            <li><Link to="/speakers">Distinguished Speakers</Link></li>
            <li><Link to="/organizing-team">Organizing Committee</Link></li>
            <li>
              <a href="/downloads/NEXORA_2026_Rulebook.pdf" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <BookOpen size={14} /> Official Rulebook (PDF)
              </a>
            </li>
          </ul>
        </div>

        {/* Col 3: Student Connect & Socials */}
        <div>
          <h4 style={{ color: '#ffffff', marginBottom: '1rem', borderBottom: '1px solid rgba(45, 212, 191, 0.2)', paddingBottom: '0.5rem' }}>
            Connect & Clubs
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.9rem' }}>
            <li>
              <a
                href="https://www.instagram.com/byte.hcst"
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <Instagram size={16} color="#E1306C" /> BYTE Club Instagram
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/qubit.hcst.it"
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <Instagram size={16} color="#E1306C" /> QUBIT Club Instagram
              </a>
            </li>
            <li>
              <a
                href="https://chat.whatsapp.com/DOvk1L6D1wv0YS2XccPfWv"
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#25D366' }}
              >
                <MessageCircle size={16} /> Official WhatsApp Group
              </a>
            </li>
            <li>
              <a
                href="https://hcst.edu.in/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <Globe size={16} /> HCST Official Website
              </a>
            </li>
          </ul>
        </div>

        {/* Col 4: Student Coordinators */}
        <div>
          <h4 style={{ color: '#ffffff', marginBottom: '1rem', borderBottom: '1px solid rgba(45, 212, 191, 0.2)', paddingBottom: '0.5rem' }}>
            Student Coordinators
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
            <p style={{ margin: 0 }}>
              <strong style={{ color: '#fff' }}>Akshita Mathur:</strong>{' '}
              <a href="tel:+917055002687" style={{ color: 'var(--accent-cream)' }}>+91 70550 02687</a>
            </p>
            <p style={{ margin: 0 }}>
              <strong style={{ color: '#fff' }}>Kunal Rathore:</strong>{' '}
              <a href="tel:+917505708793" style={{ color: 'var(--accent-cream)' }}>+91 75057 08793</a>
            </p>
            <p style={{ margin: 0 }}>
              <strong style={{ color: '#fff' }}>Vinarm Verma:</strong>{' '}
              <a href="tel:+919045661289" style={{ color: 'var(--accent-cream)' }}>+91 90456 61289</a>
            </p>
          </div>
        </div>
      </div>

      <div
        style={{
          maxWidth: 'var(--container-max)',
          margin: '0 auto',
          paddingTop: '1.5rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.8rem',
          color: 'var(--text-muted)',
        }}
      >
        <p>© 2026 NEXORA Conference — BYTE CLUB & QUBIT IT ASSOCIATION, HCST Mathura. All rights reserved.</p>
        <p>Built with React + Vite & Node.js Express</p>
      </div>
    </footer>
  );
}
