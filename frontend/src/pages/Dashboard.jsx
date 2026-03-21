/**
 * Dashboard Page
 * Main dashboard with key metrics, real-time updates, live activity feed, and chart annotations
 * Phase 10: Chart annotations (AIC-1005)
 */
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';
import api from '../services/api';
import { useRealtime } from '../contexts/RealtimeContext';
import { useToast } from '../contexts/ToastContext';
import { Link } from 'react-router-dom';
import { Settings, Activity } from 'lucide-react';

// Register Chart.js components
ChartJS.register(ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Real-time notification component
const NotificationPanel = ({ notifications, onDismiss }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  if (notifications.length === 0) return null;

  return (
    <div
      role="region"
      aria-label="Live notifications"
      className="dashboard-notification-panel"
      style={{
        position: 'fixed',
        top: '80px',
        right: '24px',
        width: '360px',
        maxHeight: '400px',
        overflow: 'auto',
        zIndex: 1000
      }}
    >
      <div style={{
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
        overflow: 'hidden'
      }}>
        <div
          role="button"
          tabIndex={0}
          aria-expanded={isExpanded}
          aria-controls="notification-list"
          style={{
            padding: '12px 16px',
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: 'white',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
          onClick={() => setIsExpanded(!isExpanded)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setIsExpanded(!isExpanded);
            }
          }}
        >
          <span style={{ fontWeight: 600 }}>
            🔔 Live Activity ({notifications.length})
          </span>
          <span aria-hidden="true">{isExpanded ? '▼' : '▲'}</span>
        </div>
        {isExpanded && (
          <div
            id="notification-list"
            role="list"
            aria-label="Notifications"
            style={{ maxHeight: '320px', overflow: 'auto' }}
          >
            {notifications.slice(0, 10).map((notif, idx) => (
              <div
                key={idx}
                role="listitem"
                style={{
                  padding: '12px 16px',
                  borderBottom: '1px solid #f0f0f0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '8px'
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: '#374151' }}>
                    {notif.title}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                    {notif.message}
                  </div>
                  <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px' }}>
                    {notif.time}
                  </div>
                </div>
                <button
                  onClick={() => onDismiss(idx)}
                  aria-label={`Dismiss notification: ${notif.title}`}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#9ca3af',
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Live activity feed component
const LiveActivityFeed = ({ activities, isConnected }) => {
  return (
    <div className="card" role="region" aria-label="Live activity feed" style={{ marginBottom: '24px' }}>
      <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 className="card-title" id="activity-feed-title">📡 Live Activity Feed</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            role="status"
            aria-label={isConnected ? 'Connected - live updates active' : 'Disconnected - reconnecting'}
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: isConnected ? '#10b981' : '#ef4444',
              animation: isConnected ? 'pulse 2s infinite' : 'none'
            }}
          />
          <span style={{ fontSize: '12px', color: isConnected ? '#10b981' : '#ef4444' }}>
            {isConnected ? 'Live' : 'Reconnecting...'}
          </span>
        </div>
      </div>
      <div
        aria-labelledby="activity-feed-title"
        aria-live="polite"
        style={{ maxHeight: '200px', overflow: 'auto' }}
      >
        {activities.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: '#999' }} role="status">
            No recent activity
          </div>
        ) : (
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }} role="list">
            {activities.map((activity, idx) => (
              <li
                key={idx}
                style={{
                  padding: '12px 16px',
                  borderBottom: '1px solid #f5f5f5',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  animation: 'fadeIn 0.3s ease'
                }}
              >
                <span style={{ fontSize: '20px' }} aria-hidden="true">{activity.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: '#374151' }}>
                    {activity.title}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>
                    {activity.description}
                  </div>
                </div>
                <time
                  style={{ fontSize: '11px', color: '#9ca3af', whiteSpace: 'nowrap' }}
                  dateTime={activity.time}
                >
                  {activity.time}
                </time>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

// Auto-refresh indicator
const RefreshIndicator = ({ lastUpdated, isRefreshing, onManualRefresh }) => {
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '8px 16px',
        background: '#f9fafb',
        borderRadius: '8px',
        marginBottom: '24px'
      }}
    >
      <span style={{ fontSize: '12px', color: '#6b7280' }}>
        Last updated: {lastUpdated || 'Never'}
      </span>
      {isRefreshing && (
        <span
          aria-label="Refreshing data"
          style={{ fontSize: '12px', color: '#4facfe' }}
        >
          ↻ Refreshing...
        </span>
      )}
      <button
        onClick={onManualRefresh}
        disabled={isRefreshing}
        aria-busy={isRefreshing}
        aria-label="Refresh dashboard data"
        style={{
          padding: '6px 12px',
          fontSize: '12px',
          background: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '6px',
          cursor: isRefreshing ? 'not-allowed' : 'pointer',
          color: '#374151',
          opacity: isRefreshing ? 0.6 : 1,
        }}
      >
        ↻ Refresh Now
      </button>
      <span style={{ fontSize: '11px', color: '#9ca3af', marginLeft: 'auto' }}>
        Auto-refresh: 30s
      </span>
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { liveMetrics, connectionStatus } = useRealtime();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [health, setHealth] = useState({});
  const [analytics, setAnalytics] = useState({});
  const [conversions, setConversions] = useState({});
  const [revenue, setRevenue] = useState({});
  const [leadAnalytics, setLeadAnalytics] = useState({});

  // Real-time state
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [activities, setActivities] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [agentStatuses, setAgentStatuses] = useState([]);

  // Chart annotations (Phase 10)
  const [annotations, setAnnotations] = useState(() => {
    const saved = localStorage.getItem('dashboard_annotations');
    return saved ? JSON.parse(saved) : [];
  });
  const [showAnnotationPanel, setShowAnnotationPanel] = useState(false);
  const [newAnnotation, setNewAnnotation] = useState('');
  const [annotationChart, setAnnotationChart] = useState('');

  // Auto-refresh hook
  const useAutoRefresh = (callback, interval = 30000) => {
    const [isActive, setIsActive] = useState(true);

    useEffect(() => {
      if (!isActive) return;

      const timer = setInterval(() => {
        callback();
      }, interval);

      return () => clearInterval(timer);
    }, [callback, interval, isActive]);

    return { isActive, setIsActive };
  };

  const loadDashboardData = useCallback(async () => {
    try {
      setIsRefreshing(true);

      // Fetch all data in parallel
      const [healthData, analyticsData, conversionsData, revenueData, leadData, agentsData] = await Promise.all([
        api.getHealth(),
        api.getAnalyticsOverview().catch(() => ({})),
        api.getConversionMetrics().catch(() => ({})),
        api.getRevenueMetrics().catch(() => ({})),
        api.getLeadAnalytics().catch(() => ({})),
        api.getAgents().catch(() => [])
      ]);

      setHealth(healthData);
      setAnalytics(analyticsData);
      setConversions(conversionsData);
      setRevenue(revenueData);
      setLeadAnalytics(leadData);
      setAgentStatuses(agentsData);

      // Update last refreshed time
      setLastUpdated(new Date().toLocaleTimeString());
      setIsConnected(true);

      // Check for changes and add notifications
      checkForUpdates(analyticsData, leadData, agentsData);

      // Update system status in sidebar
      const statusEl = document.getElementById('status-check');
      if (statusEl) {
        const statusText = [
          `Ollama: ${healthData.ollama || 'unknown'}`,
          `Qdrant: ${healthData.qdrant || 'unknown'}`,
          `PostgreSQL: ${healthData.postgresql || 'unknown'}`
        ].join(' | ');
        statusEl.textContent = statusText;
      }

      setError(null);
    } catch (err) {
      console.error('Dashboard data load error:', err);
      setIsConnected(false);
      setError('Failed to load dashboard data. Make sure backend is running.');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Check for updates and create notifications
  const checkForUpdates = (newAnalytics, newLeadData, newAgents) => {
    const newNotifications = [];
    const newActivities = [];

    // Check for new leads
    if (newLeadData?.by_status) {
      const newLeads = newLeadData.by_status.find(s => s.status === 'new');
      if (newLeads?.count > 0) {
        newNotifications.push({
          title: '🎯 New Leads',
          message: `${newLeads.count} new lead${newLeads.count > 1 ? 's' : ''} detected`,
          time: 'Just now'
        });
        newActivities.unshift({
          icon: '🎯',
          title: 'New Lead',
          description: `${newLeads.count} new lead${newLeads.count > 1 ? 's' : ''} added`,
          time: 'Just now'
        });
      }
    }

    // Check for conversion changes
    if (newAnalytics?.conversions) {
      newNotifications.push({
        title: '📈 Conversion Update',
        message: `${newAnalytics.conversions} conversions today`,
        time: 'Just now'
      });
    }

    // Check agent statuses
    if (newAgents?.length > 0) {
      const runningAgents = newAgents.filter(a => a.status === 'running').length;
      const errorAgents = newAgents.filter(a => a.status === 'error').length;

      if (errorAgents > 0) {
        newNotifications.push({
          title: '⚠️ Agent Alert',
          message: `${errorAgents} agent${errorAgents > 1 ? 's' : ''} need attention`,
          time: 'Just now'
        });
      }

      newActivities.unshift({
        icon: '🤖',
        title: 'Agent Status',
        description: `${runningAgents} running, ${errorAgents} error`,
        time: 'Just now'
      });
    }

    // Update state
    if (newNotifications.length > 0) {
      setNotifications(prev => [...newNotifications, ...prev].slice(0, 20));
    }
    if (newActivities.length > 0) {
      setActivities(prev => [...newActivities, ...prev].slice(0, 15));
    }
  };

  const handleManualRefresh = () => {
    loadDashboardData();
  };

  // Annotation handlers (Phase 10)
  const addAnnotation = () => {
    if (!newAnnotation.trim()) return;
    const annotation = {
      id: Date.now(),
      text: newAnnotation,
      chart: annotationChart || 'General',
      time: new Date().toLocaleTimeString(),
      date: new Date().toLocaleDateString(),
    };
    const updated = [annotation, ...annotations].slice(0, 20);
    setAnnotations(updated);
    localStorage.setItem('dashboard_annotations', JSON.stringify(updated));
    setNewAnnotation('');
    toast.success('Annotation added');
  };

  const deleteAnnotation = (id) => {
    const updated = annotations.filter(a => a.id !== id);
    setAnnotations(updated);
    localStorage.setItem('dashboard_annotations', JSON.stringify(updated));
  };

  const dismissNotification = (index) => {
    setNotifications(prev => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    // Check if onboarding is completed
    const onboardingComplete = localStorage.getItem('onboardingComplete');
    if (!onboardingComplete) {
      navigate('/onboarding');
      return;
    }
    loadDashboardData();
  }, [navigate, loadDashboardData]);

  // Set up auto-refresh
  useAutoRefresh(loadDashboardData, 30000);

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  // Lead status distribution for doughnut chart
  const leadsByStatus = leadAnalytics?.by_status || [];
  const statusLabels = leadsByStatus.map(s => s.status);
  const statusCounts = leadsByStatus.map(s => s.count);

  const doughnutData = {
    labels: statusLabels.length ? statusLabels : ['New', 'Contacted', 'Qualified', 'Converted'],
    datasets: [{
      data: statusCounts.length ? statusCounts : [0, 0, 0, 0],
      backgroundColor: ['#4facfe', '#00f2fe', '#667eea', '#10b981'],
      borderWidth: 0
    }]
  };

  // Mock line chart data for visitors
  const lineData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Visitors',
      data: [120, 190, 150, 220, 180, 250, 280],
      borderColor: '#4facfe',
      backgroundColor: 'rgba(79, 172, 254, 0.1)',
      fill: true,
      tension: 0.4
    }]
  };

  const lineOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, grid: { color: '#f0f0f0' } },
      x: { grid: { display: false } }
    }
  };

  // Key metrics
  const stats = [
    {
      label: 'Total Leads',
      value: analytics?.leads ? Object.values(analytics.leads).reduce((a, b) => a + b, 0) : 0,
      change: '+12%',
      positive: true
    },
    {
      label: 'Conversion Rate',
      value: `${conversions?.conversion_rate || 0}%`,
      change: '+5%',
      positive: true
    },
    {
      label: 'Total Revenue',
      value: `$${(revenue?.total_revenue || 0).toLocaleString()}`,
      change: '+8%',
      positive: true
    },
    {
      label: 'Active Users',
      value: analytics?.matomo?.nb_visits || 0,
      change: '-2%',
      positive: false
    }
  ];

  return (
    <div className="dashboard">
      {/* Screen reader live region for real-time updates */}
      <div aria-live="polite" aria-atomic="true" className="sr-only" role="status">
        {notifications.length > 0 && `You have ${notifications.length} new notifications`}
      </div>

      {/* Notification Panel - Real-time alerts */}
      <NotificationPanel notifications={notifications} onDismiss={dismissNotification} />

      <div className="page-header">
        <div>
          <h2>Dashboard</h2>
          <p>AI City performance overview</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Live Metrics from WebSocket */}
          {(connectionStatus === 'connected' || connectionStatus === 'simulated') && (
            <div
              role="region"
              aria-label="Live metrics"
              style={{
                display: 'flex',
                gap: '16px',
                padding: '8px 16px',
                background: 'linear-gradient(135deg, rgba(79, 172, 254, 0.1) 0%, rgba(0, 242, 254, 0.1) 100%)',
                borderRadius: '8px',
                border: '1px solid rgba(79, 172, 254, 0.2)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Activity size={14} style={{ color: '#4facfe' }} aria-hidden="true" />
                <span style={{ fontSize: '12px', color: '#6b7280' }}>Visitors:</span>
                <span style={{ fontSize: '14px', fontWeight: 600 }} aria-label={`${liveMetrics.visitors || 0} visitors`}>
                  {liveMetrics.visitors || 0}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '12px', color: '#6b7280' }}>Active:</span>
                <span style={{ fontSize: '14px', fontWeight: 600 }} aria-label={`${liveMetrics.activeUsers || 0} active users`}>
                  {liveMetrics.activeUsers || 0}
                </span>
              </div>
            </div>
          )}
          <Link
            to="/dashboard/customize"
            aria-label="Customize dashboard layout"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              textDecoration: 'none',
              color: 'var(--text)',
              fontSize: '13px',
              fontWeight: 500
            }}
          >
            <Settings size={16} aria-hidden="true" />
            Customize
          </Link>
        </div>
      </div>

      {/* Auto-refresh indicator */}
      <RefreshIndicator
        lastUpdated={lastUpdated}
        isRefreshing={isRefreshing}
        onManualRefresh={handleManualRefresh}
      />

      {/* Chart Annotation Bar (Phase 10) */}
      <div style={{
        marginBottom: '24px', display: 'flex', gap: '8px', alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        <input
          type="text"
          placeholder="Add a note about this dashboard..."
          value={newAnnotation}
          onChange={e => setNewAnnotation(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addAnnotation()}
          style={{
            flex: 1, minWidth: '200px', padding: '8px 12px', borderRadius: '8px',
            border: '1px solid #e5e7eb', fontSize: '13px'
          }}
        />
        <select
          value={annotationChart}
          onChange={e => setAnnotationChart(e.target.value)}
          style={{ padding: '8px 10px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '13px' }}
        >
          <option value="">General</option>
          <option value="Visitor Trends">Visitor Trends</option>
          <option value="Lead Distribution">Lead Distribution</option>
          <option value="Conversion">Conversion</option>
        </select>
        <button
          onClick={addAnnotation}
          disabled={!newAnnotation.trim()}
          style={{
            padding: '8px 16px', background: newAnnotation.trim() ? '#4facfe' : '#e5e7eb',
            color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer',
            fontSize: '13px', fontWeight: 500
          }}
        >
          + Annotate
        </button>
        <button
          onClick={() => setShowAnnotationPanel(!showAnnotationPanel)}
          style={{
            padding: '8px 14px', background: showAnnotationPanel ? '#e0f2fe' : 'white',
            border: '1px solid #e5e7eb', borderRadius: '8px', cursor: 'pointer',
            fontSize: '13px', color: '#4facfe'
          }}
        >
          📝 Notes ({annotations.length})
        </button>
      </div>

      {/* Annotation Panel */}
      {showAnnotationPanel && (
        <div className="card" style={{ marginBottom: '24px', border: '1px solid #e0f2fe' }}>
          <div className="card-header">
            <h3 className="card-title">Dashboard Notes</h3>
            <button onClick={() => setShowAnnotationPanel(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}>✕</button>
          </div>
          {annotations.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#9ca3af', padding: '16px', fontSize: '13px' }}>
              No annotations yet. Add notes above to track insights.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflow: 'auto' }}>
              {annotations.map(a => (
                <div key={a.id} style={{ display: 'flex', gap: '8px', padding: '8px', background: '#f9fafb', borderRadius: '6px', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', color: '#374151' }}>{a.text}</div>
                    <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>
                      {a.chart !== 'General' && <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '1px 6px', borderRadius: '4px', marginRight: '6px', fontSize: '10px' }}>{a.chart}</span>}
                      {a.date} {a.time}
                    </div>
                  </div>
                  <button onClick={() => deleteAnnotation(a.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: '12px', padding: '0 4px' }}>✕</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Live Activity Feed */}
      <LiveActivityFeed activities={activities} isConnected={isConnected} />

      {/* Stats Grid - Use grid role for better screen reader support */}
      <div
        className="stats-grid"
        role="region"
        aria-label="Key metrics"
      >
        {stats.map((stat, index) => (
          <article
            key={index}
            className="stat-card card-interactive"
            aria-label={`${stat.label}: ${stat.value}, ${stat.change} change`}
          >
            <span className="stat-label" id={`stat-label-${index}`}>{stat.label}</span>
            <span className="stat-value" aria-labelledby={`stat-label-${index}`}>{stat.value}</span>
            <span className={`stat-change ${stat.positive ? 'positive' : 'negative'}`} aria-label={`${stat.change} compared to last week`}>
              {stat.change} vs last week
            </span>
          </article>
        ))}
      </div>

      {/* Charts Row */}
      <div
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}
        role="region"
        aria-label="Analytics charts"
      >
        <div className="card" role="figure" aria-label="Visitor trends chart">
          <div className="card-header">
            <h3 className="card-title" id="chart-visitors-title">Visitor Trends</h3>
          </div>
          <Line data={lineData} options={lineOptions} aria-labelledby="chart-visitors-title" />
        </div>

        <div className="card" role="figure" aria-label="Lead distribution chart">
          <div className="card-header">
            <h3 className="card-title" id="chart-leads-title">Lead Distribution</h3>
          </div>
          <div style={{ maxWidth: '200px', margin: '0 auto' }}>
            <Doughnut
              data={doughnutData}
              options={{ plugins: { legend: { position: 'bottom' } } }}
              aria-labelledby="chart-leads-title"
            />
          </div>
        </div>
      </div>

      {/* Conversion by Source */}
      <div className="card" role="region" aria-label="Conversion by source data">
        <div className="card-header">
          <h3 className="card-title">Conversion by Source</h3>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }} aria-label="Conversion source data">
          <thead>
            <tr style={{ borderBottom: '1px solid #eee' }}>
              <th scope="col" style={{ textAlign: 'left', padding: '12px', color: '#666', fontSize: '13px' }}>Source</th>
              <th scope="col" style={{ textAlign: 'right', padding: '12px', color: '#666', fontSize: '13px' }}>Total</th>
              <th scope="col" style={{ textAlign: 'right', padding: '12px', color: '#666', fontSize: '13px' }}>Converted</th>
              <th scope="col" style={{ textAlign: 'right', padding: '12px', color: '#666', fontSize: '13px' }}>Rate</th>
            </tr>
          </thead>
          <tbody>
            {(leadAnalytics?.by_source || []).length > 0 ? (
              leadAnalytics.by_source.map((item, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #f5f5f5' }}>
                  <td style={{ padding: '12px', fontWeight: 500 }}>{item.source}</td>
                  <td style={{ textAlign: 'right', padding: '12px' }}>{item.total}</td>
                  <td style={{ textAlign: 'right', padding: '12px' }}>{item.converted}</td>
                  <td style={{ textAlign: 'right', padding: '12px', color: '#10b981' }}>{item.rate}%</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '24px', color: '#999' }}>
                  No conversion data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;