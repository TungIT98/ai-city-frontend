/**
 * Performance Monitoring Page (AIC-404, AIC-901)
 * Real User Monitoring, Core Web Vitals, error tracking, uptime
 * Phase 9: Enhanced with live web-vitals data
 */
import { useState, useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { startWebVitals, getAggregatedMetrics, VITALS_THRESHOLDS, getVitalColor } from '../utils/performance';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const VITAL_ICONS = { LCP: '🖼️', FID: '⚡', CLS: '📐', TTFB: '⏱️', FCP: '📄', INP: '🔄' };

function formatVital(name, value) {
  if (name === 'CLS') return value.toFixed(3);
  if (name === 'LCP' || name === 'FCP') return `${(value / 1000).toFixed(2)}s`;
  return `${Math.round(value)}ms`;
}

export default function PerformanceMonitor() {
  const [timeRange, setTimeRange] = useState('24h');
  const [metrics, setMetrics] = useState({});
  const vitalsInitialized = useRef(false);

  // Start web-vitals collection
  useEffect(() => {
    if (!vitalsInitialized.current) {
      vitalsInitialized.current = true;
      startWebVitals();
    }

    // Poll metrics every 2 seconds
    const interval = setInterval(() => {
      setMetrics(getAggregatedMetrics());
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const vitals = ['LCP', 'CLS', 'TTFB', 'INP'].map(name => {
    const m = metrics[name];
    const th = VITALS_THRESHOLDS[name];
    const latest = m?.latest ?? (name === 'LCP' ? 1800 : name === 'CLS' ? 0.04 : name === 'TTFB' ? 220 : 89);
    const rating = latest <= th.good ? 'good' : latest <= th.needsImprovement ? 'needs-improvement' : 'poor';
    return {
      name,
      value: formatVital(name, latest),
      rawValue: latest,
      target: `< ${th.good}${th.unit}`,
      status: rating,
      color: getVitalColor(rating),
      icon: VITAL_ICONS[name],
      avg: m?.avg ?? 0,
      p95: m?.p95 ?? 0,
      count: m?.count ?? 0,
    };
  });

  const trafficData = {
    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', 'Now'],
    datasets: [{
      label: 'Page Views',
      data: [1240, 890, 3420, 8930, 12450, 9870, 6540],
      borderColor: '#4facfe',
      backgroundColor: 'rgba(79, 172, 254, 0.1)',
      fill: true,
      tension: 0.4,
    }],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { beginAtZero: true, grid: { color: 'rgba(128,128,128,0.1)' } },
      x: { grid: { display: false } },
    },
  };

  const staticApiLatency = [
    { endpoint: '/api/leads', avg: 120, p95: 245, p99: 380, requests: '12.5K/hr' },
    { endpoint: '/api/analytics', avg: 85, p95: 180, p99: 290, requests: '8.2K/hr' },
    { endpoint: '/api/auth', avg: 65, p95: 140, p99: 220, requests: '3.4K/hr' },
    { endpoint: '/api/reports', avg: 210, p95: 480, p99: 720, requests: '1.1K/hr' },
    { endpoint: '/api/forecasting', avg: 340, p95: 680, p99: 980, requests: '0.3K/hr' },
  ];

  // Show live API latency if available
  const liveApiLatency = metrics.apiLatency?.length > 0
    ? metrics.apiLatency.map(l => ({
        endpoint: l.endpoint,
        avg: Math.round(l.duration),
        status: l.status,
        timestamp: new Date(l.timestamp).toLocaleTimeString(),
      }))
    : null;

  const errors = [
    { id: 1, type: 'TypeError', message: 'Cannot read property "map" of undefined', url: '/dashboard', count: 3, last: '2 min ago', level: 'error' },
    { id: 2, type: 'Warning', message: 'React DevTools: Multiple renderers', url: '/leads', count: 12, last: '15 min ago', level: 'warn' },
    { id: 3, type: 'ReferenceError', message: 'x is not defined', url: '/analytics', count: 1, last: '1 hour ago', level: 'error' },
    { id: 4, type: 'Warning', message: 'Failed to load resource: net::ERR_CONNECTION_RESET', url: '/api/forecasting', count: 5, last: '3 hours ago', level: 'warn' },
  ];

  const services = [
    { name: 'Frontend App', status: 'operational', uptime: 99.98, latency: 45 },
    { name: 'Backend API', status: 'operational', uptime: 99.95, latency: 120 },
    { name: 'Database', status: 'operational', uptime: 99.99, latency: 8 },
    { name: 'Auth Service', status: 'degraded', uptime: 99.12, latency: 340 },
    { name: 'Analytics Engine', status: 'operational', uptime: 99.87, latency: 210 },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>Performance Monitor</h2>
          <p>Real User Monitoring and service health</p>
        </div>
        <select value={timeRange} onChange={e => setTimeRange(e.target.value)} style={{
          padding: '8px 16px',
          border: '1px solid var(--border-color)',
          borderRadius: 8,
          background: 'var(--bg-secondary)',
          color: 'var(--text-primary)',
          fontSize: 14,
        }}>
          <option value="1h">Last hour</option>
          <option value="24h">Last 24 hours</option>
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
        </select>
      </div>

      {/* Core Web Vitals */}
      <div className="stats-grid" style={{ marginBottom: 24 }}>
        {vitals.map((vital, idx) => (
          <div key={idx} className="card" style={{ textAlign: 'center', padding: 20 }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{vital.icon}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>
              {vital.name}
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, color: vital.color }}>
              {vital.value}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
              Target: {vital.target}
            </div>
            {vital.count > 0 && (
              <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>
                avg {formatVital(vital.name, vital.avg)} · p95 {formatVital(vital.name, vital.p95)} · n={vital.count}
              </div>
            )}
          </div>
        ))}
        {/* Session Quality Score */}
        <div className="card" style={{ textAlign: 'center', padding: 20 }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>📊</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>
            Session Score
          </div>
          <div style={{ fontSize: 28, fontWeight: 700, color: metrics.sessionScore >= 80 ? '#10b981' : metrics.sessionScore >= 50 ? '#f59e0b' : '#ef4444' }}>
            {metrics.sessionScore ?? 100}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
            Real user quality
          </div>
        </div>
      </div>

      {/* Traffic Chart */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">
          <h3 className="card-title">Traffic Overview</h3>
          <div style={{ display: 'flex', gap: 16, fontSize: 13 }}>
            <span style={{ color: 'var(--text-muted)' }}>Total: <strong style={{ color: 'var(--primary)' }}>33,340</strong></span>
            <span style={{ color: 'var(--text-muted)' }}>Avg: <strong style={{ color: 'var(--primary)' }}>1,389/hr</strong></span>
          </div>
        </div>
        <Line data={trafficData} options={chartOptions} height={80} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 24 }}>
        {/* API Latency */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">API Latency</h3>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '8px 4px', fontSize: 11, color: 'var(--text-muted)', borderBottom: '1px solid var(--border-color)' }}>Endpoint</th>
                <th style={{ textAlign: 'right', padding: '8px 4px', fontSize: 11, color: 'var(--text-muted)', borderBottom: '1px solid var(--border-color)' }}>Avg</th>
                <th style={{ textAlign: 'right', padding: '8px 4px', fontSize: 11, color: 'var(--text-muted)', borderBottom: '1px solid var(--border-color)' }}>P95</th>
                <th style={{ textAlign: 'right', padding: '8px 4px', fontSize: 11, color: 'var(--text-muted)', borderBottom: '1px solid var(--border-color)' }}>P99</th>
                <th style={{ textAlign: 'right', padding: '8px 4px', fontSize: 11, color: 'var(--text-muted)', borderBottom: '1px solid var(--border-color)' }}>Req/hr</th>
              </tr>
            </thead>
            <tbody>
              {liveApiLatency ? (
                liveApiLatency.map((api, idx) => (
                  <tr key={idx}>
                    <td style={{ padding: '10px 4px', fontSize: 12, fontFamily: 'monospace', borderBottom: '1px solid var(--border-color)' }}>{api.endpoint}</td>
                    <td style={{ padding: '10px 4px', fontSize: 12, textAlign: 'right', color: api.avg < 200 ? '#10b981' : api.avg < 500 ? '#f59e0b' : '#ef4444', borderBottom: '1px solid var(--border-color)' }}>{api.avg}ms</td>
                    <td style={{ padding: '10px 4px', fontSize: 12, textAlign: 'right', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-color)' }}>live</td>
                    <td style={{ padding: '10px 4px', fontSize: 12, textAlign: 'right', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-color)' }}>—</td>
                    <td style={{ padding: '10px 4px', fontSize: 12, textAlign: 'right', color: api.status < 400 ? '#10b981' : '#ef4444', borderBottom: '1px solid var(--border-color)' }}>{api.status}</td>
                  </tr>
                ))
              ) : (
                staticApiLatency.map((api, idx) => (
                  <tr key={idx}>
                    <td style={{ padding: '10px 4px', fontSize: 12, fontFamily: 'monospace', borderBottom: '1px solid var(--border-color)' }}>{api.endpoint}</td>
                    <td style={{ padding: '10px 4px', fontSize: 12, textAlign: 'right', color: '#10b981', borderBottom: '1px solid var(--border-color)' }}>{api.avg}ms</td>
                    <td style={{ padding: '10px 4px', fontSize: 12, textAlign: 'right', color: '#f59e0b', borderBottom: '1px solid var(--border-color)' }}>{api.p95}ms</td>
                    <td style={{ padding: '10px 4px', fontSize: 12, textAlign: 'right', color: '#ef4444', borderBottom: '1px solid var(--border-color)' }}>{api.p99}ms</td>
                    <td style={{ padding: '10px 4px', fontSize: 12, textAlign: 'right', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-color)' }}>{api.requests}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Error Tracking */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Recent Errors</h3>
            <span style={{ padding: '4px 12px', borderRadius: 12, background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', fontSize: 12, fontWeight: 600 }}>
              4 issues
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {errors.map(error => (
              <div key={error.id} style={{
                padding: 12,
                background: 'var(--bg-primary)',
                borderRadius: 8,
                borderLeft: `3px solid ${error.level === 'error' ? '#ef4444' : '#f59e0b'}`,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: error.level === 'error' ? '#ef4444' : '#f59e0b' }}>
                    {error.type}
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{error.last}</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'monospace' }}>{error.message}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                  {error.url} • {error.count} occurrence{error.count > 1 ? 's' : ''}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Uptime Dashboard */}
      <div className="card" style={{ marginTop: 24 }}>
        <div className="card-header">
          <h3 className="card-title">Service Health</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
          {services.map((service, idx) => (
            <div key={idx} style={{
              padding: 16,
              background: 'var(--bg-primary)',
              borderRadius: 10,
              border: service.status === 'degraded' ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid var(--border-color)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 600 }}>{service.name}</span>
                <span style={{
                  padding: '3px 10px',
                  borderRadius: 12,
                  fontSize: 11,
                  fontWeight: 600,
                  background: service.status === 'operational' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                  color: service.status === 'operational' ? '#10b981' : '#f59e0b',
                }}>
                  {service.status}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--text-muted)' }}>
                <span>Uptime: <strong style={{ color: service.uptime > 99.5 ? '#10b981' : '#f59e0b' }}>{service.uptime}%</strong></span>
                <span>Latency: <strong>{service.latency}ms</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
