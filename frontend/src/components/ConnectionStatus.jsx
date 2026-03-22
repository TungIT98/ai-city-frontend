/**
 * Connection Status - Real-time connection indicator
 * Phase 6 Feature (AIC-600)
 */
import { useRealtime } from '../contexts/RealtimeContext';
import { Wifi, WifiOff, RefreshCw, Activity } from 'lucide-react';
import './ConnectionStatus.css';

function ConnectionStatus({ compact = false }) {
  const { connectionStatus, liveMetrics, connected } = useRealtime();

  const getStatusConfig = () => {
    switch (connectionStatus) {
      case 'connected':
        return {
          icon: Wifi,
          label: 'Live',
          color: 'var(--success)',
          pulse: true,
        };
      case 'simulated':
        return {
          icon: Activity,
          label: 'Simulated',
          color: 'var(--warning)',
          pulse: true,
        };
      case 'connecting':
        return {
          icon: RefreshCw,
          label: 'Connecting',
          color: 'var(--text-tertiary)',
          spin: true,
        };
      case 'disconnected':
      case 'error':
        return {
          icon: WifiOff,
          label: 'Offline',
          color: 'var(--error)',
          pulse: false,
        };
      default:
        return {
          icon: WifiOff,
          label: 'Unknown',
          color: 'var(--text-tertiary)',
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  if (compact) {
    return (
      <div className={`connection-status compact status-${connectionStatus}`}>
        <span className={`status-dot ${config.pulse ? 'pulse' : ''}`} style={{ background: config.color }}></span>
        <Icon size={14} style={{ color: config.color }} className={config.spin ? 'spin' : ''} />
      </div>
    );
  }

  return (
    <div className={`connection-status ${connectionStatus}`}>
      <div className="status-indicator">
        <span className={`status-dot ${config.pulse ? 'pulse' : ''}`} style={{ background: config.color }}></span>
        <Icon size={16} style={{ color: config.color }} className={config.spin ? 'spin' : ''} />
        <span className="status-label" style={{ color: config.color }}>{config.label}</span>
      </div>

      {connected || connectionStatus === 'simulated' ? (
        <div className="live-metrics">
          <div className="metric">
            <span className="metric-value">{liveMetrics.visitors || 0}</span>
            <span className="metric-label">visitors</span>
          </div>
          <div className="metric">
            <span className="metric-value">{liveMetrics.leads || 0}</span>
            <span className="metric-label">leads</span>
          </div>
          <div className="metric">
            <span className="metric-value">{liveMetrics.activeUsers || 0}</span>
            <span className="metric-label">active</span>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default ConnectionStatus;
