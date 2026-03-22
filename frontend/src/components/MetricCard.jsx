/**
 * MetricCard - Enhanced metric card with sparkline and trend
 * Part of Phase 7: Advanced Charts & Visualization (AIC-701)
 */
import { Sparkline } from './Sparkline';

/**
 * MetricCard with optional sparkline trend
 */
export function MetricCard({
  label,
  value,
  change,
  changeLabel,
  icon: Icon,
  sparklineData,
  sparklineColor,
  format = 'number',
  style = {},
}) {
  const formatValue = (val) => {
    if (format === 'currency') {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0,
      }).format(val);
    }
    if (format === 'percentage') {
      return `${val.toFixed(1)}%`;
    }
    if (format === 'compact') {
      return new Intl.NumberFormat('vi-VN', {
        notation: 'compact',
        maximumFractionDigits: 1,
      }).format(val);
    }
    return new Intl.NumberFormat('vi-VN').format(val);
  };

  const getChangeColor = () => {
    if (change > 0) return '#16a34a';
    if (change < 0) return '#dc2626';
    return 'var(--text-secondary)';
  };

  const getChangeIcon = () => {
    if (change > 0) return '↑';
    if (change < 0) return '↓';
    return '→';
  };

  const getSparklineColor = () => {
    if (sparklineColor) return sparklineColor;
    if (change > 0) return '#16a34a';
    if (change < 0) return '#dc2626';
    return '#3b82f6';
  };

  return (
    <div
      className="card-interactive"
      style={{
        background: 'var(--card-bg, #fff)',
        borderRadius: '12px',
        padding: '1.25rem',
        border: '1px solid var(--border-color)',
        position: 'relative',
        overflow: 'hidden',
        transition: 'box-shadow 0.2s, transform 0.2s',
        ...style,
      }}
    >
      {/* Header row */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '0.75rem',
      }}>
        <span style={{
          fontSize: '0.8125rem',
          color: 'var(--text-secondary)',
          fontWeight: 500,
        }}>
          {label}
        </span>
        {Icon && (
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            background: 'rgba(79, 172, 254, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#4facfe',
          }}>
            <Icon size={18} />
          </div>
        )}
      </div>

      {/* Value + Sparkline row */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        gap: '1rem',
      }}>
        <div>
          <div style={{
            fontSize: '1.75rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            lineHeight: 1.2,
            marginBottom: '0.375rem',
          }}>
            {formatValue(value)}
          </div>
          {change !== undefined && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              fontSize: '0.8125rem',
              color: getChangeColor(),
            }}>
              <span>{getChangeIcon()}</span>
              <span style={{ fontWeight: 600 }}>
                {Math.abs(change).toFixed(1)}%
              </span>
              {changeLabel && (
                <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>
                  {' '}{changeLabel}
                </span>
              )}
            </div>
          )}
        </div>

        {sparklineData && sparklineData.length > 0 && (
          <Sparkline
            data={sparklineData}
            color={getSparklineColor()}
            width={80}
            height={32}
          />
        )}
      </div>
    </div>
  );
}

export default MetricCard;
