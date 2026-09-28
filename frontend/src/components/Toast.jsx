import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

let toastFn = null;

export const showToast = (message, type = 'success', duration = 4000) => {
  if (toastFn) toastFn({ message, type, duration, id: Date.now() });
};

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    toastFn = (newToast) => {
      setToasts((prev) => [...prev, newToast]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      }, newToast.duration);
    };
    return () => {
      toastFn = null;
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '1.5rem',
        right: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        zIndex: 99999,
        maxWidth: '420px',
        width: 'calc(100% - 3rem)',
      }}
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="animate-fade-in"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.85rem 1.15rem',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(10, 33, 33, 0.95)',
            backdropFilter: 'blur(16px)',
            border: `1px solid ${
              toast.type === 'success'
                ? 'var(--status-success)'
                : toast.type === 'error'
                ? 'var(--status-error)'
                : 'var(--status-info)'
            }`,
            boxShadow: 'var(--shadow-lg)',
            color: 'var(--text-bright)',
            fontSize: '0.9rem',
          }}
        >
          {toast.type === 'success' && <CheckCircle2 size={20} color="var(--status-success)" />}
          {toast.type === 'error' && <AlertCircle size={20} color="var(--status-error)" />}
          {toast.type === 'info' && <Info size={20} color="var(--status-info)" />}
          <span style={{ flex: 1 }}>{toast.message}</span>
          <button
            onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
