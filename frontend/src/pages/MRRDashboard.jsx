/**
 * MRR Dashboard Page
 * Monthly Recurring Revenue Dashboard with customer metrics, churn, LTV, and cohort analysis
 */
import { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, Filler } from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import api from '../services/api';
import './MRRDashboard.css';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, Filler);

const MRRDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mrr, setMrr] = useState({});
  const [customers, setCustomers] = useState({});
  const [churn, setChurn] = useState({});
  const [ltv, setLtv] = useState({});
  const [cohorts, setCohorts] = useState({});

  useEffect(() => {
    loadMRRData();
  }, []);

  const loadMRRData = async () => {
    try {
      setLoading(true);

      // Fetch all MRR dashboard data in parallel
      const [mrrData, customerData, churnData, ltvData, cohortData] = await Promise.all([
        api.getMRR().catch(() => ({})),
        api.getCustomerCount().catch(() => ({})),
        api.getChurnRate('30d').catch(() => ({})),
        api.getLTV().catch(() => ({})),
        api.getCohortAnalysis().catch(() => ({}))
      ]);

      setMrr(mrrData);
      setCustomers(customerData);
      setChurn(churnData);
      setLtv(ltvData);
      setCohorts(cohortData);

      setError(null);
    } catch (err) {
      console.error('MRR Dashboard data load error:', err);
      setError('Failed to load MRR data. Using fallback data.');
    } finally {
      setLoading(false);
    }
  };

  // Mock fallback data
  const mockMRRHistory = [
    { month: 'Oct', value: 8500 },
    { month: 'Nov', value: 9200 },
    { month: 'Dec', value: 10500 },
    { month: 'Jan', value: 11800 },
    { month: 'Feb', value: 12500 },
    { month: 'Mar', value: 14200 }
  ];

  const mockCohortData = [
    { month: 'Oct', retained: 100, converted: 45, churned: 5 },
    { month: 'Nov', retained: 92, converted: 52, churned: 8 },
    { month: 'Dec', retained: 88, converted: 48, churned: 12 },
    { month: 'Jan', retained: 85, converted: 55, churned: 10 },
    { month: 'Feb', retained: 82, converted: 58, churned: 7 },
    { month: 'Mar', retained: 90, converted: 62, churned: 4 }
  ];

  // MRR Trend Chart
  const mrrHistory = mrr?.history || mockMRRHistory;
  const mrrChartData = {
    labels: mrrHistory.map(m => m.month),
    datasets: [{
      label: 'MRR (VND)',
      data: mrrHistory.map(m => m.value),
      borderColor: '#4facfe',
      backgroundColor: 'rgba(79, 172, 254, 0.2)',
      fill: true,
      tension: 0.4,
      pointRadius: 4,
      pointHoverRadius: 6
    }]
  };

  const mrrChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `VND ${ctx.raw.toLocaleString()}`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: { color: '#f0f0f0' },
        ticks: {
          callback: (value) => `VND ${(value / 1000).toFixed(0)}K`
        }
      },
      x: { grid: { display: false } }
    }
  };

  // Cohort Analysis Chart
  const cohortData = cohorts?.data || mockCohortData;
  const cohortChartData = {
    labels: cohortData.map(c => c.month),
    datasets: [
      {
        label: 'Retained %',
        data: cohortData.map(c => c.retained),
        backgroundColor: 'rgba(79, 172, 254, 0.8)',
        borderRadius: 4
      },
      {
        label: 'Converted %',
        data: cohortData.map(c => c.converted),
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderRadius: 4
      },
      {
        label: 'Churned %',
        data: cohortData.map(c => c.churned),
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderRadius: 4
      }
    ]
  };

  const cohortChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.dataset.label}: ${ctx.raw}%`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: { color: '#f0f0f0' },
        ticks: {
          callback: (value) => `${value}%`
        }
      },
      x: { grid: { display: false } }
    }
  };

  // Churn Trend Chart
  const churnHistory = churn?.history || [
    { month: 'Oct', rate: 4.2 },
    { month: 'Nov', rate: 5.1 },
    { month: 'Dec', rate: 6.8 },
    { month: 'Jan', rate: 5.5 },
    { month: 'Feb', rate: 4.2 },
    { month: 'Mar', rate: 3.1 }
  ];

  const churnChartData = {
    labels: churnHistory.map(c => c.month),
    datasets: [{
      label: 'Churn Rate %',
      data: churnHistory.map(c => c.rate),
      borderColor: '#ef4444',
      backgroundColor: 'rgba(239, 68, 68, 0.2)',
      fill: true,
      tension: 0.4,
      pointRadius: 4,
      pointHoverRadius: 6
    }]
  };

  const churnChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `Churn: ${ctx.raw}%`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: '#f0f0f0' },
        ticks: {
          callback: (value) => `${value}%`
        }
      },
      x: { grid: { display: false } }
    }
  };

  // Customer Distribution (Pie Chart)
  const customerTiers = customers?.tiers || [
    { tier: 'Enterprise', count: 25, percentage: 20 },
    { tier: 'Pro', count: 45, percentage: 36 },
    { tier: 'Starter', count: 55, percentage: 44 }
  ];

  const customerPieData = {
    labels: customerTiers.map(t => t.tier),
    datasets: [{
      data: customerTiers.map(t => t.count),
      backgroundColor: ['#4facfe', '#00f2fe', '#667eea'],
      borderWidth: 0
    }]
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'right' },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.label}: ${ctx.raw} customers`
        }
      }
    }
  };

  // Key Metrics
  const mrrValue = mrr?.current || 14200;
  const mrrGrowth = mrr?.growth || 13.6;
  const mrrTarget = mrr?.target || 15000;

  const customerCount = customers?.total || 125;
  const customerGrowth = customers?.growth || 8.5;

  const churnRate = churn?.rate || 3.1;
  const churnChange = churn?.change || -1.1;

  const ltvValue = ltv?.value || 2850000;
  const ltvGrowth = ltv?.growth || 12.3;

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="mrr-dashboard">
      <div className="page-header">
        <h2>MRR Dashboard</h2>
        <p>Monthly Recurring Revenue - Customer metrics, churn, LTV & cohort analysis</p>
      </div>

      {/* Metrics Row */}
      <div className="metrics-row">
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">MRR</span>
            <span className={`metric-trend ${mrrGrowth >= 0 ? 'positive' : 'negative'}`}>
              {mrrGrowth >= 0 ? '+' : ''}{mrrGrowth}%
            </span>
          </div>
          <div className="metric-value">VND {mrrValue.toLocaleString()}</div>
          <div className="metric-subtext">Monthly Recurring Revenue</div>
          <div className="metric-progress">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${Math.min((mrrValue / mrrTarget) * 100, 100)}%` }}
              ></div>
            </div>
            <span className="progress-label">Target: VND {mrrTarget.toLocaleString()}</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Customers</span>
            <span className={`metric-trend ${customerGrowth >= 0 ? 'positive' : 'negative'}`}>
              {customerGrowth >= 0 ? '+' : ''}{customerGrowth}%
            </span>
          </div>
          <div className="metric-value">{customerCount}</div>
          <div className="metric-subtext">Active Subscribers</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Churn Rate</span>
            <span className={`metric-trend ${churnChange <= 0 ? 'positive' : 'negative'}`}>
              {churnChange <= 0 ? '' : '+'}{churnChange}%
            </span>
          </div>
          <div className="metric-value">{churnRate}%</div>
          <div className="metric-subtext">Monthly Churn</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">LTV</span>
            <span className={`metric-trend ${ltvGrowth >= 0 ? 'positive' : 'negative'}`}>
              {ltvGrowth >= 0 ? '+' : ''}{ltvGrowth}%
            </span>
          </div>
          <div className="metric-value">VND {ltvValue.toLocaleString()}</div>
          <div className="metric-subtext">Lifetime Value (avg)</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        {/* MRR Trend */}
        <div className="card wide">
          <div className="card-header">
            <h3 className="card-title">MRR Trend (6 Months)</h3>
          </div>
          <Line data={mrrChartData} options={mrrChartOptions} />
        </div>

        {/* Churn Rate Trend */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Churn Rate Trend</h3>
          </div>
          <Line data={churnChartData} options={churnChartOptions} />
        </div>

        {/* Customer Distribution */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Customer Distribution</h3>
          </div>
          <div className="pie-container">
            <Doughnut data={customerPieData} options={pieOptions} />
          </div>
          <div className="tier-legend">
            {customerTiers.map((tier, idx) => (
              <div key={idx} className="tier-item">
                <span className="tier-name">{tier.tier}</span>
                <span className="tier-value">{tier.count} ({tier.percentage}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Cohort Analysis */}
        <div className="card wide">
          <div className="card-header">
            <h3 className="card-title">Cohort Analysis</h3>
          </div>
          <Bar data={cohortChartData} options={cohortChartOptions} />
        </div>
      </div>

      {/* LTV Breakdown */}
      <div className="ltv-section">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">LTV Breakdown by Tier</h3>
          </div>
          <div className="ltv-grid">
            <div className="ltv-item">
              <div className="ltv-tier">Enterprise</div>
              <div className="ltv-value">VND 8,500,000</div>
              <div className="ltv-bar">
                <div className="ltv-fill" style={{ width: '100%' }}></div>
              </div>
            </div>
            <div className="ltv-item">
              <div className="ltv-tier">Pro</div>
              <div className="ltv-value">VND 3,200,000</div>
              <div className="ltv-bar">
                <div className="ltv-fill" style={{ width: '38%' }}></div>
              </div>
            </div>
            <div className="ltv-item">
              <div className="ltv-tier">Starter</div>
              <div className="ltv-value">VND 850,000</div>
              <div className="ltv-bar">
                <div className="ltv-fill" style={{ width: '10%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error notice */}
      {error && (
        <div className="error-notice">
          <small>{error}</small>
        </div>
      )}
    </div>
  );
};

export default MRRDashboard;