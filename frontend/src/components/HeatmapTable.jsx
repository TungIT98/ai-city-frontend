/**
 * HeatmapTable - Data table with conditional formatting
 * Part of Phase 7: Advanced Charts & Visualization (AIC-701)
 */
import { useRef } from 'react';
import { Download } from 'lucide-react';
import { exportTableAsCSV } from './ChartExport';

/**
 * Get heatmap color based on value (0-100)
 */
const getHeatmapColor = (value, min = 0, max = 100) => {
  const normalized = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));

  if (normalized >= 80) return { bg: 'rgba(34, 197, 94, 0.2)', color: '#16a34a' };
  if (normalized >= 60) return { bg: 'rgba(34, 197, 94, 0.1)', color: '#15803d' };
  if (normalized >= 40) return { bg: 'rgba(234, 179, 8, 0.15)', color: '#a16207' };
  if (normalized >= 20) return { bg: 'rgba(249, 115, 22, 0.15)', color: '#c2410c' };
  return { bg: 'rgba(239, 68, 68, 0.15)', color: '#dc2626' };
};

/**
 * Get change indicator color
 */
const getChangeColor = (change) => {
  if (change > 0) return '#16a34a';
  if (change < 0) return '#dc2626';
  return 'var(--text-secondary)';
};

/**
 * Format number with locale
 */
const formatNumber = (num, locale = 'vi-VN') => {
  if (typeof num !== 'number') return num;
  return num.toLocaleString(locale);
};

/**
 * HeatmapTable component
 */
export function HeatmapTable({
  columns,
  data,
  title,
  exportFilename = 'table',
  heatmapColumn,
  changeColumn,
}) {
  const tableRef = useRef(null);

  const handleExport = () => {
    if (tableRef.current) {
      exportTableAsCSV(tableRef.current, exportFilename);
    }
  };

  return (
    <div style={{
      background: 'var(--card-bg, #fff)',
      borderRadius: '12px',
      border: '1px solid var(--border-color)',
      overflow: 'hidden',
    }}>
      {/* Header */}
      {title && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem 1.25rem',
          borderBottom: '1px solid var(--border-color)',
        }}>
          <h4 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600 }}>{title}</h4>
          <button
            onClick={handleExport}
            title="Export as CSV"
            style={{
              padding: '0.375rem',
              background: 'transparent',
              border: '1px solid var(--border-color)',
              borderRadius: '6px',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Download size={14} />
          </button>
        </div>
      )}

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table
          ref={tableRef}
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '0.875rem',
          }}
        >
          <thead>
            <tr style={{ background: 'var(--bg-secondary, #f8fafc)' }}>
              {columns.map((col, i) => (
                <th
                  key={i}
                  style={{
                    padding: '0.75rem 1rem',
                    textAlign: col.align || 'left',
                    fontWeight: 600,
                    color: 'var(--text-secondary)',
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    borderBottom: '1px solid var(--border-color)',
                  }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                style={{
                  borderBottom: '1px solid var(--border-color)',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--bg-secondary, #f8fafc)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                {columns.map((col, colIndex) => {
                  const value = row[col.key];
                  const isHeatmap = col.key === heatmapColumn;
                  const isChange = col.key === changeColumn;
                  const heatmapStyle = isHeatmap ? getHeatmapColor(value) : {};
                  const changeStyle = isChange ? { color: getChangeColor(value) } : {};

                  return (
                    <td
                      key={colIndex}
                      style={{
                        padding: '0.75rem 1rem',
                        textAlign: col.align || 'left',
                        background: isHeatmap ? heatmapStyle.bg : 'transparent',
                        color: isHeatmap ? heatmapStyle.color : isChange ? changeStyle.color : 'inherit',
                        fontWeight: isHeatmap && value >= 80 ? 600 : 400,
                        ...changeStyle,
                      }}
                    >
                      {col.format ? col.format(value, row) : formatNumber(value)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty state */}
      {(!data || data.length === 0) && (
        <div style={{
          padding: '3rem',
          textAlign: 'center',
          color: 'var(--text-muted)',
        }}>
          No data available
        </div>
      )}
    </div>
  );
}

/**
 * CohortHeatmapTable - Special table for cohort retention heatmaps
 */
export function CohortHeatmapTable({ cohorts, metric = 'retention' }) {
  return (
    <div style={{
      background: 'var(--card-bg, #fff)',
      borderRadius: '12px',
      border: '1px solid var(--border-color)',
      overflow: 'auto',
    }}>
      <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-color)' }}>
        <h4 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600 }}>
          Cohort {metric === 'retention' ? 'Retention' : metric === 'churn' ? 'Churn' : 'Conversion'} Heatmap
        </h4>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
        <thead>
          <tr>
            <th style={{ padding: '0.5rem', borderBottom: '1px solid var(--border-color)', fontWeight: 600, color: 'var(--text-secondary)' }}>Cohort</th>
            {[...Array(6)].map((_, i) => (
              <th key={i} style={{ padding: '0.5rem', borderBottom: '1px solid var(--border-color)', fontWeight: 600, color: 'var(--text-secondary)', textAlign: 'center' }}>M{i}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {cohorts?.map((cohort, i) => (
            <tr key={i}>
              <td style={{ padding: '0.5rem', fontWeight: 500 }}>{cohort.label}</td>
              {[...Array(6)].map((_, j) => {
                const value = cohort.data?.[j] ?? null;
                if (value === null) {
                  return <td key={j} style={{ padding: '0.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>-</td>;
                }
                const style = getHeatmapColor(value);
                return (
                  <td
                    key={j}
                    style={{
                      padding: '0.5rem',
                      textAlign: 'center',
                      background: style.bg,
                      color: style.color,
                      fontWeight: 600,
                    }}
                  >
                    {value.toFixed(0)}%
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default HeatmapTable;
