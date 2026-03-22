/**
 * Loading Skeletons - Consistent loading states across all pages
 * Part of Phase 7: Backend Integration & Real API (AIC-700)
 */

/**
 * Animated shimmer effect for skeleton loading
 */
const shimmer = {
  background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
  backgroundSize: '200% 100%',
  animation: 'shimmer 1.5s infinite',
};

const darkShimmer = {
  background: 'linear-gradient(90deg, #2d2d2d 25%, #3d3d3d 50%, #2d2d2d 75%)',
  backgroundSize: '200% 100%',
  animation: 'shimmer 1.5s infinite',
};

/**
 * Base Skeleton component with theme support
 */
export function Skeleton({ width = '100%', height = '1rem', borderRadius = '4px', style = {} }) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius,
        ...shimmer,
        ...style,
      }}
      aria-hidden="true"
    />
  );
}

/**
 * Metric Card skeleton for dashboard
 */
export function MetricCardSkeleton() {
  return (
    <div style={{
      background: 'var(--card-bg, #fff)',
      borderRadius: '12px',
      padding: '1.25rem',
      border: '1px solid var(--border-color, #e2e8f0)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        <Skeleton width="40%" height="0.875rem" />
        <Skeleton width="32px" height="32px" borderRadius="8px" />
      </div>
      <Skeleton width="60%" height="2rem" borderRadius="6px" style={{ marginBottom: '0.5rem' }} />
      <Skeleton width="45%" height="0.75rem" />
    </div>
  );
}

/**
 * Chart skeleton for analytics pages
 */
export function ChartSkeleton({ height = '300px' }) {
  return (
    <div style={{
      background: 'var(--card-bg, #fff)',
      borderRadius: '12px',
      padding: '1.25rem',
      border: '1px solid var(--border-color, #e2e8f0)',
    }}>
      <Skeleton width="30%" height="1.25rem" style={{ marginBottom: '1rem' }} />
      <div style={{ height, display: 'flex', alignItems: 'flex-end', gap: '0.5rem', padding: '1rem' }}>
        {[...Array(7)].map((_, i) => (
          <div key={i} style={{
            flex: 1,
            height: `${30 + Math.random() * 60}%`,
            borderRadius: '4px 4px 0 0',
            ...shimmer,
          }} />
        ))}
      </div>
    </div>
  );
}

/**
 * Table row skeleton
 */
export function TableRowSkeleton({ columns = 5 }) {
  return (
    <tr>
      {[...Array(columns)].map((_, i) => (
        <td key={i} style={{ padding: '0.75rem 1rem' }}>
          <Skeleton width={i === 0 ? '70%' : '50%'} height="0.875rem" />
        </td>
      ))}
    </tr>
  );
}

/**
 * Table skeleton for data pages
 */
export function TableSkeleton({ rows = 5, columns = 5 }) {
  return (
    <div style={{
      background: 'var(--card-bg, #fff)',
      borderRadius: '12px',
      border: '1px solid var(--border-color, #e2e8f0)',
      overflow: 'hidden',
    }}>
      <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-color, #e2e8f0)' }}>
        <Skeleton width="20%" height="1.25rem" />
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: 'var(--bg-secondary, #f8fafc)' }}>
            {[...Array(columns)].map((_, i) => (
              <th key={i} style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>
                <Skeleton width="60%" height="0.75rem" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...Array(rows)].map((_, i) => (
            <TableRowSkeleton key={i} columns={columns} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Card grid skeleton for marketplace/list pages
 */
export function CardGridSkeleton({ count = 4 }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '1.5rem',
    }}>
      {[...Array(count)].map((_, i) => (
        <div key={i} style={{
          background: 'var(--card-bg, #fff)',
          borderRadius: '12px',
          padding: '1.25rem',
          border: '1px solid var(--border-color, #e2e8f0)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <Skeleton width="48px" height="48px" borderRadius="10px" />
            <div style={{ flex: 1 }}>
              <Skeleton width="60%" height="1rem" style={{ marginBottom: '0.375rem' }} />
              <Skeleton width="40%" height="0.75rem" />
            </div>
          </div>
          <Skeleton width="100%" height="0.875rem" style={{ marginBottom: '0.5rem' }} />
          <Skeleton width="80%" height="0.875rem" />
        </div>
      ))}
    </div>
  );
}

/**
 * Full page skeleton loader
 */
export function PageSkeleton() {
  return (
    <div style={{ padding: '1.5rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Skeleton width="200px" height="2rem" style={{ marginBottom: '0.5rem' }} />
        <Skeleton width="300px" height="0.875rem" />
      </div>

      {/* Metric cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: '1rem',
        marginBottom: '1.5rem',
      }}>
        {[...Array(4)].map((_, i) => (
          <MetricCardSkeleton key={i} />
        ))}
      </div>

      {/* Charts row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '1.5rem',
        marginBottom: '1.5rem',
      }}>
        <ChartSkeleton height="280px" />
        <ChartSkeleton height="280px" />
      </div>

      {/* Table */}
      <TableSkeleton rows={5} columns={4} />
    </div>
  );
}

/**
 * Inline loading spinner
 */
export function Spinner({ size = 24, color = '#3b82f6' }) {
  return (
    <div
      role="status"
      aria-label="Loading"
      style={{
        width: size,
        height: size,
        border: `3px solid ${color}20`,
        borderTopColor: color,
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }}
    />
  );
}

/**
 * Full page loader with spinner
 */
export function FullPageLoader() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      gap: '1rem',
    }}>
      <Spinner size={40} />
      <span style={{ color: '#64748b', fontSize: '0.875rem' }}>Loading...</span>
    </div>
  );
}
