import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div
      className="container animate-fade-in"
      style={{
        padding: '6rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'var(--accent-soft)',
          color: 'var(--accent-teal)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.5rem',
        }}
      >
        <Compass size={40} />
      </div>
      <h1 style={{ fontSize: '4rem', fontWeight: 900, margin: 0, color: 'var(--accent-teal)' }}>
        404
      </h1>
      <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
        Page Not Found
      </h2>
      <p style={{ maxWidth: '460px', marginBottom: '2.5rem', fontSize: '1.05rem', color: 'var(--text-secondary)' }}>
        The conference page or portal resource you are looking for has been moved, renamed, or does not exist.
      </p>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link to="/" className="btn btn-primary">
          <Home size={16} />
          <span>Return Home</span>
        </Link>
        <Link to="/tracks" className="btn btn-outline">
          <span>View Conference Tracks</span>
        </Link>
      </div>
    </div>
  );
}
