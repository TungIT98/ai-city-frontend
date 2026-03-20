/**
 * Analytics Page
 * Detailed analytics and metrics
 */
import { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import api from '../services/api';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [leadAnalytics, setLeadAnalytics] = useState({});
  const [conversions, setConversions] = useState({});
  const [revenue, setRevenue] = useState({});

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const [leadData, convData, revData] = await Promise.all([
        api.getLeadAnalytics().catch(() => ({})),
        api.getConversionMetrics().catch(() => ({})),
        api.getRevenueMetrics().catch(() => ({}))
      ]);

      setLeadAnalytics(leadData);
      setConversions(convData);
      setRevenue(revData);
    } catch (err) {
      setError('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading"><div className="loading-spinner"></div></div>;
  }

  // Chart data
  const sourceData = {
    labels: (leadAnalytics?.by_source || []).map(s => s.source),
    datasets: [{
      label: 'Total Leads',
      data: (leadAnalytics?.by_source || []).map(s => s.total),
      backgroundColor: '#4facfe'
    }, {
      label: 'Converted',
      data: (leadAnalytics?.by_source || []).map(s => s.converted),
      backgroundColor: '#10b981'
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' }
    },
    scales: {
      y: { beginAtZero: true }
    }
  };

  return (
    <div className="analytics-page">
      <div className="page-header">
        <h2>Analytics</h2>
        <p>Detailed performance metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">Total Leads</span>
          <span className="stat-value">{conversions?.total_leads || 0}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Converted</span>
          <span className="stat-value">{conversions?.converted || 0}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Conversion Rate</span>
          <span className="stat-value">{conversions?.conversion_rate || 0}%</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Total Revenue</span>
          <span className="stat-value">${(revenue?.total_revenue || 0).toLocaleString()}</span>
        </div>
      </div>

      {/* Charts */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Leads by Source</h3>
        </div>
        {(leadAnalytics?.by_source || []).length > 0 ? (
          <Bar data={sourceData} options={chartOptions} />
        ) : (
          <div style={{ padding: '48px', textAlign: 'center', color: '#999' }}>
            No analytics data available
          </div>
        )}
      </div>

      {/* Detailed Stats */}
      <div className="card" style={{ marginTop: '24px' }}>
        <div className="card-header">
          <h3 className="card-title">Lead Status Breakdown</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          {(leadAnalytics?.by_status || []).map((status, index) => (
            <div key={index} style={{
              padding: '16px',
              background: '#f9fafb',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#1a1a2e' }}>{status.count}</div>
              <div style={{ color: '#666', fontSize: '13px', textTransform: 'capitalize' }}>{status.status}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;