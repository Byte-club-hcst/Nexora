import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from './Button';

export default function Pagination({
  total = 0,
  limit = 20,
  offset = 0,
  onPageChange,
}) {
  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  if (totalPages <= 1) return null;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginTop: '1.25rem',
        paddingTop: '1rem',
        borderTop: '1px solid var(--border)',
        fontSize: '0.875rem',
        color: 'var(--text-secondary)',
      }}
    >
      <div>
        Showing <strong style={{ color: 'var(--text-bright)' }}>{offset + 1}</strong> to{' '}
        <strong style={{ color: 'var(--text-bright)' }}>
          {Math.min(offset + limit, total)}
        </strong>{' '}
        of <strong style={{ color: 'var(--text-bright)' }}>{total}</strong> entries
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => onPageChange(Math.max(0, offset - limit))}
          aria-label="Previous Page"
        >
          <ChevronLeft size={16} />
          <span>Previous</span>
        </Button>

        <span style={{ padding: '0 0.5rem', fontWeight: 600, color: 'var(--text-bright)' }}>
          Page {currentPage} of {totalPages}
        </span>

        <Button
          variant="outline"
          size="sm"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(offset + limit)}
          aria-label="Next Page"
        >
          <span>Next</span>
          <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
}
