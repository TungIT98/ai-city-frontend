/**
 * AI Insights Engine
 * AI-powered insights with anomaly detection and smart recommendations
 */
import { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement, BarElement,
  Title, Tooltip, Legend, Filler
} from 'chart.js';
import './AIInsights.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

// Mock AI-generated insights data
const mockInsights = {
  anomalies: [
    {
      id: 1,
      type: 'spike',
      metric: 'Conversion Rate',
      message: 'Conversion rate dropped 23% below baseline on March 19',
      severity: 'high',
      impact: 85,
      detected: '2 hours ago',
      affected: 'Social Media Channel',
      trend: 'down',
      value: '3.2%',
      baseline: '4.2%',
    },
    {
      id: 2,
      type: 'unusual',
      metric: 'Lead Response Time',
      message: 'Average response time increased by 45% in the last 24 hours',
      severity: 'medium',
      impact: 62,
      detected: '5 hours ago',
      affected: 'Telesales Team',
      trend: 'up',
      value: '4.2 hrs',
      baseline: '2.9 hrs',
    },
    {
      id: 3,
      type: 'pattern',
      metric: 'Revenue',
      message: 'Unusual revenue pattern detected - weekend sales 18% above average',
      severity: 'low',
      impact: 35,
      detected: '1 day ago',
      affected: 'All Channels',
      trend: 'up',
      value: '+18%',
      baseline: '0%',
    },
    {
      id: 4,
      type: 'spike',
      metric: 'API Error Rate',
      message: 'API error rate spiked to 8.5% - highest in 30 days',
      severity: 'high',
      impact: 92,
      detected: '30 min ago',
      affected: 'API Portal',
      trend: 'up',
      value: '8.5%',
      baseline: '1.2%',
    },
  ],
  recommendations: [
    {
      id: 1,
      category: 'Revenue',
      title: 'Optimize Facebook Ads targeting',
      description: 'Facebook CPC is 34% higher than other channels but conversion rate is below average. Consider refining audience segments.',
      impact: '+$12,500/mo',
      confidence: 87,
      effort: 'medium',
      status: 'pending',
    },
    {
      id: 2,
      category: 'Leads',
      title: 'Implement instant lead response',
      description: 'Leads contacted within 5 minutes have 8x higher conversion. Your current avg response time is 4.2 hours.',
      impact: '+15% conversion',
      confidence: 94,
      effort: 'low',
      status: 'pending',
    },
    {
      id: 3,
      category: 'Retention',
      title: 'Launch proactive outreach for at-risk customers',
      description: '23 Enterprise customers show declining usage patterns. Proactive engagement could reduce churn by estimated 40%.',
      impact: '-$8,200/mo saved',
      confidence: 79,
      effort: 'high',
      status: 'pending',
    },
    {
      id: 4,
      category: 'Performance',
      title: 'Enable edge caching for API responses',
      description: 'P95 latency is 340ms. Edge caching could reduce to ~85ms, improving conversion by estimated 3%.',
      impact: '+3% conversion',
      confidence: 91,
      effort: 'low',
      status: 'pending',
    },
    {
      id: 5,
      category: 'Sales',
      title: 'Cross-sell Premium tier to Starter users',
      description: '127 Starter users show usage patterns matching Premium users. Avg upsell value: VND 1.2M/mo.',
      impact: '+$152K/mo',
      confidence: 82,
      effort: 'low',
      status: 'pending',
    },
  ],
  trends: [
    { date: 'Mar 1', value: 42 },
    { date: 'Mar 5', value: 45 },
    { date: 'Mar 10', value: 48 },
    { date: 'Mar 15', value: 44 },
    { date: 'Mar 19', value: 38 },
    { date: 'Mar 21', value: 41 },
  ],
  scoreBreakdown: [
    { category: 'Revenue', score: 78 },
    { category: 'Leads', score: 65 },
    { category: 'Performance', score: 82 },
    { category: 'Retention', score: 71 },
    { category: 'Sales', score: 85 },
  ],
};

const severityColors = { high: '#ef4444', medium: '#f59e0b', low: '#10b981' };
const severityLabels = { high: 'Critical', medium: 'Warning', low: 'Info' };

export default function AIInsights() {
  const [activeTab, setActiveTab] = useState('overview');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedInsight, setSelectedInsight] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredAnomalies = mockInsights.anomalies.filter(a =>
    filterSeverity === 'all' || a.severity === filterSeverity
  );

  const filteredRecommendations = mockInsights.recommendations.filter(r =>
    filterCategory === 'all' || r.category === filterCategory
  );

  const trendData = {
    labels: mockInsights.trends.map(t => t.date),
    datasets: [{
      label: 'Business Health Score',
      data: mockInsights.trends.map(t => t.value),
      borderColor: '#6366f1',
      backgroundColor: 'rgba(99, 102, 241, 0.1)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#6366f1',
      pointRadius: 4,
    }],
  };

  const scoreData = {
    labels: mockInsights.scoreBreakdown.map(s => s.category),
    datasets: [{
      label: 'Health Score',
      data: mockInsights.scoreBreakdown.map(s => s.score),
      backgroundColor: [
        'rgba(239, 68, 68, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(99, 102, 241, 0.8)',
        'rgba(236, 72, 153, 0.8)',
      ],
      borderRadius: 6,
    }],
  };

  const overallHealth = Math.round(
    mockInsights.scoreBreakdown.reduce((sum, s) => sum + s.score, 0) / mockInsights.scoreBreakdown.length
  );

  if (loading) {
    return (
      <div className="ai-insights-page">
        <div className="loading-state">
          <div className="ai-brain-icon">🧠</div>
          <p>Analyzing your business data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ai-insights-page">
      <div className="page-header">
        <div>
          <h1>AI Insights Engine</h1>
          <p className="subtitle">Real-time anomaly detection and smart recommendations</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary" onClick={() => window.location.reload()}>
            🔄 Refresh Analysis
          </button>
        </div>
      </div>

      {/* Health Score Overview */}
      <div className="health-overview">
        <div className="health-score-card">
          <div className="health-score-circle" style={{
            background: `conic-gradient(${overallHealth > 70 ? '#10b981' : overallHealth > 50 ? '#f59e0b' : '#ef4444'} ${overallHealth * 3.6}deg, #e5e7eb 0deg)`
          }}>
            <div className="health-score-inner">
              <span className="score-value">{overallHealth}</span>
              <span className="score-label">Health Score</span>
            </div>
          </div>
        </div>
        <div className="health-chart">
          <Line data={trendData} options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              y: { min: 30, max: 60, grid: { color: 'rgba(0,0,0,0.05)' } },
              x: { grid: { display: false } },
            },
          }} />
        </div>
        <div className="score-breakdown">
          <Bar data={scoreData} options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              y: { min: 0, max: 100, grid: { color: 'rgba(0,0,0,0.05)' } },
              x: { grid: { display: false } },
            },
          }} />
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="tabs">
        <button className={`tab ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
          📊 Overview
        </button>
        <button className={`tab ${activeTab === 'anomalies' ? 'active' : ''}`} onClick={() => setActiveTab('anomalies')}>
          ⚠️ Anomalies ({filteredAnomalies.length})
        </button>
        <button className={`tab ${activeTab === 'recommendations' ? 'active' : ''}`} onClick={() => setActiveTab('recommendations')}>
          💡 Recommendations ({filteredRecommendations.length})
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="overview-grid">
          <div className="overview-section">
            <h3>🔥 Active Anomalies</h3>
            <div className="anomaly-summary">
              {mockInsights.anomalies.map(a => (
                <div key={a.id} className="anomaly-summary-card" style={{ borderLeftColor: severityColors[a.severity] }}>
                  <div className="anomaly-header">
                    <span className="severity-badge" style={{ background: severityColors[a.severity] }}>
                      {severityLabels[a.severity]}
                    </span>
                    <span className="detected-time">{a.detected}</span>
                  </div>
                  <p className="anomaly-message">{a.message}</p>
                  <div className="anomaly-meta">
                    <span>Impact: {a.impact}%</span>
                    <span>{a.affected}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="overview-section">
            <h3>🎯 Top Recommendations</h3>
            <div className="recommendation-summary">
              {mockInsights.recommendations.slice(0, 3).map(r => (
                <div key={r.id} className="rec-summary-card">
                  <div className="rec-header">
                    <span className="rec-category">{r.category}</span>
                    <span className="rec-impact">{r.impact}</span>
                  </div>
                  <p className="rec-title">{r.title}</p>
                  <div className="rec-confidence">
                    <div className="confidence-bar">
                      <div className="confidence-fill" style={{ width: `${r.confidence}%` }}></div>
                    </div>
                    <span>{r.confidence}% confidence</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'anomalies' && (
        <div className="anomalies-section">
          <div className="filter-bar">
            <label>Filter by severity:</label>
            <select value={filterSeverity} onChange={e => setFilterSeverity(e.target.value)}>
              <option value="all">All</option>
              <option value="high">Critical</option>
              <option value="medium">Warning</option>
              <option value="low">Info</option>
            </select>
          </div>
          <div className="anomalies-list">
            {filteredAnomalies.map(a => (
              <div
                key={a.id}
                className={`anomaly-card ${selectedInsight === a.id ? 'selected' : ''}`}
                onClick={() => setSelectedInsight(selectedInsight === a.id ? null : a.id)}
              >
                <div className="anomaly-card-header">
                  <div className="anomaly-title-row">
                    <span className="trend-icon">{a.trend === 'up' ? '📈' : '📉'}</span>
                    <h4>{a.metric}</h4>
                  </div>
                  <span className="severity-badge" style={{ background: severityColors[a.severity] }}>
                    {severityLabels[a.severity]}
                  </span>
                </div>
                <p className="anomaly-message">{a.message}</p>
                <div className="anomaly-stats">
                  <div className="stat">
                    <span className="stat-label">Current</span>
                    <span className="stat-value">{a.value}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Baseline</span>
                    <span className="stat-value">{a.baseline}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Impact</span>
                    <span className="stat-value">{a.impact}%</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Detected</span>
                    <span className="stat-value">{a.detected}</span>
                  </div>
                </div>
                <div className="anomaly-impact-bar">
                  <div className="impact-fill" style={{ width: `${a.impact}%`, background: severityColors[a.severity] }}></div>
                </div>
                <div className="anomaly-actions">
                  <button className="btn-action">Investigate</button>
                  <button className="btn-action secondary">Dismiss</button>
                  <button className="btn-action secondary">Create Alert</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'recommendations' && (
        <div className="recommendations-section">
          <div className="filter-bar">
            <label>Filter by category:</label>
            <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
              <option value="all">All Categories</option>
              <option value="Revenue">Revenue</option>
              <option value="Leads">Leads</option>
              <option value="Retention">Retention</option>
              <option value="Performance">Performance</option>
              <option value="Sales">Sales</option>
            </select>
          </div>
          <div className="recommendations-list">
            {filteredRecommendations.map(r => (
              <div key={r.id} className="recommendation-card">
                <div className="rec-card-header">
                  <div>
                    <span className="rec-category-badge">{r.category}</span>
                    <h4>{r.title}</h4>
                  </div>
                  <div className="rec-impact-badge">{r.impact}</div>
                </div>
                <p className="rec-description">{r.description}</p>
                <div className="rec-metrics">
                  <div className="rec-metric">
                    <span className="metric-icon">🎯</span>
                    <span className="metric-label">Confidence</span>
                    <div className="confidence-bar">
                      <div className="confidence-fill" style={{ width: `${r.confidence}%`, background: r.confidence > 85 ? '#10b981' : r.confidence > 75 ? '#f59e0b' : '#ef4444' }}></div>
                    </div>
                    <span className="metric-value">{r.confidence}%</span>
                  </div>
                  <div className="rec-metric">
                    <span className="metric-icon">⏱️</span>
                    <span className="metric-label">Effort</span>
                    <span className={`effort-badge effort-${r.effort}`}>{r.effort}</span>
                  </div>
                </div>
                <div className="rec-actions">
                  <button className="btn-primary">Apply Recommendation</button>
                  <button className="btn-secondary">View Details</button>
                  <button className="btn-secondary">Schedule Later</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
