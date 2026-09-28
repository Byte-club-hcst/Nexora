import React from 'react';
import { FolderOpen } from 'lucide-react';
import Button from './Button';

export default function EmptyState({
  title = 'No records found',
  message = 'There is currently no data to display.',
  actionLabel,
  onAction,
  icon: Icon = FolderOpen,
}) {
  return (
    <div
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        padding: '3rem 1.5rem',
        margin: '1.5rem 0',
      }}
    >
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'rgba(45, 212, 191, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--accent-teal-light)',
          marginBottom: '1rem',
        }}
      >
        <Icon size={32} />
      </div>
      <h3 style={{ color: 'var(--text-bright)', marginBottom: '0.5rem' }}>{title}</h3>
      <p style={{ maxWidth: '420px', marginBottom: actionLabel && onAction ? '1.5rem' : 0 }}>
        {message}
      </p>
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
