/**
 * Forecasting Page - Advanced Analytics & Predictive Insights
 */
import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import api from '../services/api';
import './Forecasting.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

export default function Forecasting() {
  const [period, setPeriod] = useState('6m');
  const [loading, setLoading] = useState(true);
  const [confidence, setConfidence] = useState(0.85);

  // Mock forecast data
  const forecastData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Actual Revenue',
        data: [420, 510, 480, 620, 710, 680, 750, 820, 890, null, null, null],
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#6366f1',
      },
      {
        label: 'Forecast',
        data: [null, null, null, null, null, null, 750, 820, 890, 960, 1040, 1120],
        borderColor: '#a855f7',
        borderDash: [6, 4],
        backgroundColor: 'transparent',
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#a855f7',
      },
      {
        label: 'Upper Bound (95%)',
        data: [null, null, null, null, null, null, 780, 860, 940, 1020, 1100, 1180],
        borderColor: 'rgba(168, 85, 247, 0.3)',
        borderDash: [3, 6],
        backgroundColor: 'transparent',
        tension: 0.4,
        pointRadius: 0,
        fill: false,
      },
      {
        label: 'Lower Bound (95%)',
        data: [null, null, null, null, null, null, 720, 780, 840, 900, 980, 1060],
        borderColor: 'rgba(168, 85, 247, 0.3)',
        borderDash: [3, 6],
        backgroundColor: 'rgba(168, 85, 247, 0.05)',
        tension: 0.4,
        pointRadius: 0,
        fill: '+1',
      },
    ],
  };

  const leadForecastData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Hot Leads',
        data: [45, 52, 48, 61, 72, 68, 75, 82, 88, 94, 101, 108],
        backgroundColor: 'rgba(239, 68, 68, 0.7)',
        borderRadius: 4,
      },
      {
        label: 'Warm Leads',
        data: [82, 91, 87, 103, 115, 108, 118, 128, 138, 148, 158, 168],
        backgroundColor: 'rgba(234, 179, 8, 0.7)',
        borderRadius: 4,
      },
      {
        label: 'Cold Leads',
        data: [124, 135, 128, 148, 162, 155, 168, 180, 192, 205, 218, 230],
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderRadius: 4,
      },
    ],
  };

  const conversionRateData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Conversion Rate %',
        data: [12.3, 13.1, 12.8, 14.2, 15.1, 14.8, 15.8, 16.5, 17.2, 17.9, 18.5, 19.1],
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#22c55e',
      },
    ],
  };

  const cohortRetention = [
    { month: 'Jan 2026', initial: 100, month1: 85, month2: 72, month3: 65, month4: 60 },
    { month: 'Feb 2026', initial: 100, month1: 87, month2: 75, month3: 68, month4: null },
    { month: 'Mar 2026', initial: 100, month1: 88, month2: 78, month3: null, month4: null },
  ];

  const kpis = [
    {
      label: 'Predicted MRR (Dec)',
      value: '$1.12M',
      trend: '+18.2%',
      positive: true,
      icon: '📈',
    },
    {
      label: 'Lead Accuracy',
      value: '84.3%',
      trend: '+5.2%',
      positive: true,
      icon: '🎯',
    },
    {
      label: 'Predicted Churn',
      value: '2.8%',
      trend: '-0.3%',
      positive: true,
      icon: '📉',
    },
    {
      label: 'Forecast Confidence',
      value: `${Math.round(confidence * 100)}%`,
      trend: 'Stable',
      positive: true,
      icon: '🎓',
    },
  ];

  useEffect(() => {
    setLoading(false);
  }, []);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: '#94a3b8', usePointStyle: true, padding: 20 },
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: '#64748b' },
      },
      y: {
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: '#64748b' },
      },
    },
  };

  return (
    <div className="forecasting-page">
      <div className="page-header">
        <div>
          <h1>Forecasting & Analytics</h1>
          <p>Predictive insights powered by ML models</p>
        </div>
        <div className="header-actions">
          <select value={period} onChange={(e) => setPeriod(e.target.value)} className="period-select">
            <option value="3m">Last 3 Months</option>
            <option value="6m">Last 6 Months</option>
            <option value="12m">Last 12 Months</option>
          </select>
          <span className="confidence-badge">
            Confidence: {Math.round(confidence * 100)}%
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        {kpis.map((kpi, i) => (
          <div key={i} className="kpi-card">
            <div className="kpi-icon">{kpi.icon}</div>
            <div className="kpi-content">
              <span className="kpi-label">{kpi.label}</span>
              <span className="kpi-value">{kpi.value}</span>
              <span className={`kpi-trend ${kpi.positive ? 'positive' : 'negative'}`}>
                {kpi.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Forecast */}
      <div className="chart-card full-width">
        <div className="chart-header">
          <h3>Revenue Forecast</h3>
          <div className="chart-legend-info">
            <span className="legend-item solid">Actual</span>
            <span className="legend-item dashed">Forecast</span>
            <span className="legend-item band">Confidence Band</span>
          </div>
        </div>
        <div className="chart-container" style={{ height: '320px' }}>
          <Line data={forecastData} options={chartOptions} />
        </div>
      </div>

      {/* Lead Forecast */}
      <div className="chart-card">
        <div className="chart-header">
          <h3>Lead Volume Prediction</h3>
          <span className="chart-subtitle">By lead temperature</span>
        </div>
        <div className="chart-container" style={{ height: '280px' }}>
          <Bar
            data={leadForecastData}
            options={{
              ...chartOptions,
              scales: {
                ...chartOptions.scales,
                x: { ...chartOptions.scales.x, stacked: true },
                y: { ...chartOptions.scales.y, stacked: true },
              },
            }}
          />
        </div>
      </div>

      {/* Conversion Rate Trend */}
      <div className="chart-card">
        <div className="chart-header">
          <h3>Conversion Rate Trend</h3>
          <span className="chart-subtitle">Lead to customer %</span>
        </div>
        <div className="chart-container" style={{ height: '280px' }}>
          <Line
            data={conversionRateData}
            options={{
              ...chartOptions,
              plugins: {
                ...chartOptions.plugins,
                legend: { display: false },
              },
            }}
          />
        </div>
      </div>

      {/* Cohort Retention Predictions */}
      <div className="chart-card full-width">
        <div className="chart-header">
          <h3>Cohort Retention Predictions</h3>
          <span className="chart-subtitle">ML-predicted retention rates</span>
        </div>
        <table className="cohort-table">
          <thead>
            <tr>
              <th>Cohort</th>
              <th>Initial</th>
              <th>Month 1</th>
              <th>Month 2</th>
              <th>Month 3</th>
              <th>Month 4</th>
              <th>Trend</th>
            </tr>
          </thead>
          <tbody>
            {cohortRetention.map((row, i) => (
              <tr key={i}>
                <td>{row.month}</td>
                <td>{row.initial}%</td>
                <td>{row.month1}%</td>
                <td>{row.month2}%</td>
                <td>{row.month3 ? `${row.month3}%` : '—'}</td>
                <td>{row.month4 ? `${row.month4}%` : '—'}</td>
                <td>
                  <span className="trend-badge positive">
                    {(row.month1 - row.initial).toFixed(1)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Model Insights */}
      <div className="insights-grid">
        <div className="insight-card">
          <h4>🔮 Model Insights</h4>
          <ul>
            <li>Revenue trending <strong>+18.2%</strong> above last quarter</li>
            <li>Hot lead conversion improved by <strong>5.2%</strong> this month</li>
            <li>Churn prediction accuracy: <strong>92.1%</strong></li>
            <li>Optimal outreach window: <strong>10AM-2PM</strong></li>
            <li>Best performing channel: <strong>Email + LinkedIn</strong></li>
          </ul>
        </div>
        <div className="insight-card">
          <h4>⚠️ Risk Alerts</h4>
          <ul>
            <li>Enterprise segment showing <strong>2.1%</strong> elevated churn risk</li>
            <li>Lead quality in APAC region <strong>declining</strong> (-3.2%)</li>
            <li>Response time SLA at risk: <strong>2 queues</strong></li>
            <li>Revenue concentration: <strong>Top 10 customers</strong> = 42% MRR</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
