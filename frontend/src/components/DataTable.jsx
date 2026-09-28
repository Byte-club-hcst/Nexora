import React from 'react';
import Loader from './Loader';
import EmptyState from './EmptyState';

export default function DataTable({
  columns = [],
  data = [],
  loading = false,
  emptyMessage = 'No data available',
  keyField = 'id',
}) {
  if (loading) {
    return (
      <div className="table-responsive" style={{ minHeight: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader message="Loading table records..." />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }

  return (
    <div className="table-responsive">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th key={col.key || idx} style={{ width: col.width || 'auto', textAlign: col.align || 'left' }}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIdx) => {
            const rowKey = row[keyField] || row.uid || rowIdx;
            return (
              <tr key={rowKey}>
                {columns.map((col, colIdx) => (
                  <td key={`${rowKey}-${col.key || colIdx}`} style={{ textAlign: col.align || 'left' }}>
                    {col.render ? col.render(row[col.key], row) : row[col.key] || '—'}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
