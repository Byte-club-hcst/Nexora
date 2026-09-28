import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEvent } from '../context/EventContext';
import { Menu, X, Shield, User, LogOut, ArrowRight } from 'lucide-react';
import Button from './Button';

export default function Navbar() {
  const { currentUser, isAdmin, logout } = useAuth();
  const { config } = useEvent();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const navigate = useNavigate();
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Live countdown to submission deadline
  useEffect(() => {
    const deadline = config?.submissionDeadline ? new Date(config.submissionDeadline) : new Date('2026-09-30T18:29:59.000Z');

    const updateCountdown = () => {
      const now = new Date();
      const diff = deadline - now;
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [config?.submissionDeadline]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Tracks', path: '/tracks' },
    { name: 'Dates', path: '/important-dates' },
    { name: 'Guidelines', path: '/guidelines' },
    { name: 'Speakers', path: '/speakers' },
    { name: 'Team', path: '/organizing-team' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 1000, width: '100%' }}>
      {/* Top Countdown Banner */}
      <div
        style={{
          background: 'var(--dark-teal)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '0.45rem 1.25rem',
          fontSize: '0.8rem',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', margin: '0 auto' }}>
          <span
            style={{
              display: 'inline-block',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: 'var(--accent-orange)',
              boxShadow: '0 0 8px var(--accent-orange)',
            }}
          />
          <span style={{ fontWeight: 600, color: 'var(--accent-cream)', letterSpacing: '0.04em' }}>
            ABSTRACT SUBMISSION DEADLINE:
          </span>
          <div style={{ display: 'inline-flex', gap: '0.4rem', fontWeight: 700, color: '#ffffff', fontFamily: 'monospace' }}>
            <span>{String(timeLeft.days).padStart(2, '0')}d</span> :
            <span>{String(timeLeft.hours).padStart(2, '0')}h</span> :
            <span>{String(timeLeft.minutes).padStart(2, '0')}m</span> :
            <span style={{ color: 'var(--accent-teal-light)' }}>{String(timeLeft.seconds).padStart(2, '0')}s</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav
        style={{
          background: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          borderBottom: '1px solid var(--border)',
          padding: '0.75rem 1.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
        }}
      >
        <div
          style={{
            maxWidth: 'var(--container-max)',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Brand Logo */}
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              color: 'var(--text-primary)',
              fontWeight: 800,
              fontSize: '1.2rem',
              letterSpacing: '-0.02em',
              textDecoration: 'none',
            }}
          >
            <img
              src="/images/hindustan-college-logo.png"
              alt="HCST"
              style={{ height: '36px', width: 'auto', objectFit: 'contain' }}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)', lineHeight: 1.1 }}>
                NEXORA <span style={{ color: 'var(--accent-teal)' }}>2026</span>
              </span>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                HCST Mathura
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div
            className="desktop-nav-links"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            {navLinks.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  style={{
                    color: isActive ? 'var(--accent-teal)' : 'var(--text-primary)',
                    background: isActive ? 'var(--accent-soft)' : 'transparent',
                    fontWeight: isActive ? 600 : 500,
                    fontSize: '0.9rem',
                    padding: '6px 14px',
                    borderRadius: '999px',
                    textDecoration: 'none',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.background = 'var(--accent-soft)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.background = 'transparent';
                  }}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Desktop Right Auth Actions */}
          <div
            className="desktop-auth-actions"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
            }}
          >
            {currentUser ? (
              <>
                {isAdmin ? (
                  <Link to="/admin" className="btn btn-secondary btn-sm" style={{ borderColor: 'var(--accent-teal)' }}>
                    <Shield size={16} color="var(--accent-teal)" />
                    <span>Admin Panel</span>
                  </Link>
                ) : (
                  <Link to="/dashboard" className="btn btn-secondary btn-sm">
                    <User size={16} />
                    <span>Dashboard</span>
                  </Link>
                )}
                <Button variant="outline" size="sm" onClick={handleLogout} title="Log Out">
                  <LogOut size={16} />
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline btn-sm">
                  Log In
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm">
                  <span>Register</span>
                  <ArrowRight size={14} />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            className="mobile-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'none',
              background: 'none',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.4rem',
              color: 'var(--text-primary)',
              cursor: 'pointer',
            }}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div
            className="mobile-menu-dropdown animate-fade-in"
            style={{
              marginTop: '0.75rem',
              paddingTop: '0.75rem',
              borderTop: '1px solid var(--border)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.65rem',
              background: '#FFFFFF',
            }}
          >
            <Link to="/" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--text-primary)', padding: '6px 0' }}>Home</Link>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--text-primary)', padding: '6px 0' }}>About HCST & NEXORA</Link>
            <Link to="/event" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--text-primary)', padding: '6px 0' }}>Event Overview</Link>
            <Link to="/tracks" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--text-primary)', padding: '6px 0' }}>Research Tracks</Link>
            <Link to="/important-dates" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--text-primary)', padding: '6px 0' }}>Important Dates</Link>
            <Link to="/guidelines" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--text-primary)', padding: '6px 0' }}>Author Guidelines</Link>
            <Link to="/speakers" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--text-primary)', padding: '6px 0' }}>Keynote Speakers</Link>
            <Link to="/organizing-team" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--text-primary)', padding: '6px 0' }}>Leadership & Team</Link>
            <Link to="/sponsors" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--text-primary)', padding: '6px 0' }}>Sponsors & Partners</Link>
            <Link to="/faq" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--text-primary)', padding: '6px 0' }}>FAQ</Link>
            <Link to="/contact" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--text-primary)', padding: '6px 0' }}>Contact</Link>

            <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {currentUser ? (
                <>
                  {isAdmin ? (
                    <Link to="/admin" className="btn btn-secondary btn-sm" onClick={() => setMobileMenuOpen(false)}>
                      <Shield size={16} /> Admin Portal
                    </Link>
                  ) : (
                    <Link to="/dashboard" className="btn btn-secondary btn-sm" onClick={() => setMobileMenuOpen(false)}>
                      <User size={16} /> Participant Dashboard
                    </Link>
                  )}
                  <Button variant="danger" size="sm" onClick={handleLogout}>
                    <LogOut size={16} /> Log Out
                  </Button>
                </>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <Link to="/login" className="btn btn-outline btn-sm" onClick={() => setMobileMenuOpen(false)}>
                    Log In
                  </Link>
                  <Link to="/register" className="btn btn-primary btn-sm" onClick={() => setMobileMenuOpen(false)}>
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Media query styling for responsive toggle */}
      <style>{`
        @media (max-width: 900px) {
          .desktop-nav-links, .desktop-auth-actions {
            display: none !important;
          }
          .mobile-toggle-btn {
            display: flex !important;
          }
        }
      `}</style>
    </header>
  );
}
