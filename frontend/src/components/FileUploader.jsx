import React, { useState, useRef } from 'react';
import { UploadCloud, CheckCircle, AlertCircle, FileText, Image as ImageIcon } from 'lucide-react';

export default function FileUploader({
  accept = '*/*',
  maxSizeMB = 5,
  label = 'Upload File',
  helperText,
  onFileSelect,
  selectedFile,
  error,
}) {
  const [dragActive, setDragActive] = useState(false);
  const [localError, setLocalError] = useState(null);
  const inputRef = useRef(null);

  const handleFiles = (file) => {
    setLocalError(null);
    if (!file) return;

    // Check size limit
    if (file.size > maxSizeMB * 1024 * 1024) {
      setLocalError(`File size exceeds the ${maxSizeMB}MB limit.`);
      return;
    }

    if (onFileSelect) {
      onFileSelect(file);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files[0]);
    }
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const displayError = error || localError;

  return (
    <div className="form-group">
      {label && <label className="form-label">{label}</label>}

      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        style={{
          border: `2px dashed ${dragActive ? 'var(--accent-teal-light)' : displayError ? 'var(--status-error)' : 'var(--border)'}`,
          borderRadius: 'var(--radius-md)',
          padding: '1.75rem 1rem',
          textAlign: 'center',
          cursor: 'pointer',
          background: dragActive ? 'rgba(45, 212, 191, 0.08)' : 'var(--bg-input)',
          transition: 'all 0.2s ease',
          position: 'relative',
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          style={{ display: 'none' }}
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFiles(e.target.files[0]);
            }
          }}
        />

        {selectedFile ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.15)',
                color: 'var(--status-success)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {selectedFile.type.includes('image') ? <ImageIcon size={22} /> : <FileText size={22} />}
            </div>
            <div>
              <p style={{ fontWeight: 600, color: 'var(--text-bright)', fontSize: '0.95rem' }}>
                {selectedFile.name}
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {formatSize(selectedFile.size)} • Click or drag to change
              </p>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: 'rgba(45, 212, 191, 0.1)',
                color: 'var(--accent-teal-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <UploadCloud size={24} />
            </div>
            <div>
              <p style={{ fontWeight: 500, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                <span style={{ color: 'var(--accent-teal-light)', textDecoration: 'underline' }}>
                  Click to upload
                </span>{' '}
                or drag and drop
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {helperText || `Maximum file size ${maxSizeMB}MB`}
              </p>
            </div>
          </div>
        )}
      </div>

      {displayError && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.4rem', color: 'var(--status-error)', fontSize: '0.8rem' }}>
          <AlertCircle size={14} />
          <span>{displayError}</span>
        </div>
      )}
    </div>
  );
}
