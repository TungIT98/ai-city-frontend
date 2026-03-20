/**
 * Dashboard Page
 * Main dashboard with key metrics and overview
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';
import api from '../services/api';

// Register Chart.js components
ChartJS.register(ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [health, setHealth] = useState({});
  const [analytics, setAnalytics] = useState({});
  const [conversions, setConversions] = useState({});
  const [revenue, setRevenue] = useState({});
  const [leadAnalytics, setLeadAnalytics] = useState({});

  useEffect(() => {
    // Check if onboarding is completed
    const onboardingComplete = localStorage.getItem('onboardingComplete');
    if (!onboardingComplete) {
      navigate('/onboarding');
      return;
    }
    loadDashboardData();
  }, [navigate]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch all data in parallel
      const [healthData, analyticsData, conversionsData, revenueData, leadData] = await Promise.all([
        api.getHealth(),
        api.getAnalyticsOverview().catch(() => ({})),
        api.getConversionMetrics().catch(() => ({})),
        api.getRevenueMetrics().catch(() => ({})),
        api.getLeadAnalytics().catch(() => ({}))
      ]);

      setHealth(healthData);
      setAnalytics(analyticsData);
      setConversions(conversionsData);
      setRevenue(revenueData);
      setLeadAnalytics(leadData);

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
      setError('Failed to load dashboard data. Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

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
      <div className="page-header">
        <h2>Dashboard</h2>
        <p>AI City performance overview</p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <span className="stat-label">{stat.label}</span>
            <span className="stat-value">{stat.value}</span>
            <span className={`stat-change ${stat.positive ? 'positive' : 'negative'}`}>
              {stat.change} vs last week
            </span>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Visitor Trends</h3>
          </div>
          <Line data={lineData} options={lineOptions} />
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Lead Distribution</h3>
          </div>
          <div style={{ maxWidth: '200px', margin: '0 auto' }}>
            <Doughnut data={doughnutData} options={{ plugins: { legend: { position: 'bottom' } } }} />
          </div>
        </div>
      </div>

      {/* Conversion by Source */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Conversion by Source</h3>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #eee' }}>
              <th style={{ textAlign: 'left', padding: '12px', color: '#666', fontSize: '13px' }}>Source</th>
              <th style={{ textAlign: 'right', padding: '12px', color: '#666', fontSize: '13px' }}>Total</th>
              <th style={{ textAlign: 'right', padding: '12px', color: '#666', fontSize: '13px' }}>Converted</th>
              <th style={{ textAlign: 'right', padding: '12px', color: '#666', fontSize: '13px' }}>Rate</th>
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