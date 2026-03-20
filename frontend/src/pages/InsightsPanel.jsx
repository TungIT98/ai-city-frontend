/**
 * InsightsPanel Component
 * AI-generated summaries and analytics
 */
import { useState, useEffect } from 'react';
import './InsightsPanel.css';

const mockInsights = {
  dailyBrief: {
    title: 'Daily AI Brief',
    date: new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
    summary: 'Today showed strong performance with 23 tasks completed, 3 agents actively processing, and 1 anomaly detected in the payment system which was auto-remediated.',
    highlight: 'Revenue up 12% vs yesterday'
  },
  keyMetrics: [
    { label: 'Tasks Completed', value: '23', change: '+15%', positive: true },
    { label: 'Active Agents', value: '3', change: '0%', positive: true },
    { label: 'Avg Response Time', value: '1.2s', change: '-8%', positive: true },
    { label: 'Error Rate', value: '0.3%', change: '-50%', positive: true },
    { label: 'Revenue', value: '$12.4K', change: '+12%', positive: true },
    { label: 'Active Users', value: '156', change: '+5%', positive: true }
  ],
  anomalies: [
    {
      id: 1,
      severity: 'warning',
      title: 'Payment Gateway Latency',
      description: 'Response time increased by 40% in the last hour',
      time: '2 hours ago',
      action: 'Auto-remediated - scaled up gateway instances'
    },
    {
      id: 2,
      severity: 'info',
      title: 'New Agent Registration',
      description: 'Marketing Agent joined the network',
      time: '5 hours ago',
      action: 'None required'
    }
  ],
  recommendations: [
    {
      id: 1,
      title: 'Scale Marketing Campaign',
      description: 'Conversion rate is 15% higher than last week. Consider increasing ad spend.',
      impact: 'high',
      effort: 'low'
    },
    {
      id: 2,
      title: 'Optimize Database Queries',
      description: 'Several slow queries detected in user authentication flow.',
      impact: 'medium',
      effort: 'medium'
    },
    {
      id: 3,
      title: 'Add Backup Region',
      description: 'Current infrastructure is single-region. Consider DR setup.',
      impact: 'high',
      effort: 'high'
    }
  ],
  historicalComparison: {
    periods: ['This Week', 'Last Week', '2 Weeks Ago', '3 Weeks Ago'],
    metrics: {
      tasks: [156, 142, 138, 125],
      revenue: [82400, 78200, 75800, 71000],
      errors: [12, 18, 24, 31],
      users: [156, 148, 142, 135]
    }
  }
};

function InsightsPanel() {
  const [insights, setInsights] = useState(mockInsights);
  const [selectedPeriod, setSelectedPeriod] = useState('daily');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Simulate AI processing
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  }, [selectedPeriod]);

  const getMetricClass = (metric) => {
    if (metric.positive) return 'positive';
    return 'negative';
  };

  const getAnomalyIcon = (severity) => {
    switch (severity) {
      case 'critical': return '🚨';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '📊';
    }
  };

  return (
    <div className="insights-panel">
      <div className="insights-header">
        <h1>AI Insights</h1>
        <div className="period-selector">
          <button
            className={selectedPeriod === 'daily' ? 'active' : ''}
            onClick={() => setSelectedPeriod('daily')}
          >
            Daily
          </button>
          <button
            className={selectedPeriod === 'weekly' ? 'active' : ''}
            onClick={() => setSelectedPeriod('weekly')}
          >
            Weekly
          </button>
          <button
            className={selectedPeriod === 'monthly' ? 'active' : ''}
            onClick={() => setSelectedPeriod('monthly')}
          >
            Monthly
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="loading-state">
          <div className="ai-thinking">
            <span className="thinking-dots">
              <span>.</span><span>.</span><span>.</span>
            </span>
            <span>AI is analyzing data...</span>
          </div>
        </div>
      ) : (
        <>
          {/* Daily Brief */}
          <section className="insights-section brief-section">
            <div className="section-header">
              <h2>🤖 {insights.dailyBrief.title}</h2>
              <span className="date">{insights.dailyBrief.date}</span>
            </div>
            <div className="brief-content">
              <p className="summary">{insights.dailyBrief.summary}</p>
              <div className="highlight-badge">
                <span className="highlight-icon">✨</span>
                {insights.dailyBrief.highlight}
              </div>
            </div>
          </section>

          {/* Key Metrics */}
          <section className="insights-section metrics-section">
            <h2>📊 Key Metrics</h2>
            <div className="metrics-grid">
              {insights.keyMetrics.map((metric, index) => (
                <div key={index} className="metric-card">
                  <span className="metric-label">{metric.label}</span>
                  <span className="metric-value">{metric.value}</span>
                  <span className={`metric-change ${getMetricClass(metric)}`}>
                    {metric.change}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Anomaly Detection */}
          <section className="insights-section anomalies-section">
            <h2>🔍 Anomaly Detection</h2>
            <div className="anomalies-list">
              {insights.anomalies.map((anomaly) => (
                <div key={anomaly.id} className={`anomaly-card ${anomaly.severity}`}>
                  <div className="anomaly-header">
                    <span className="anomaly-icon">{getAnomalyIcon(anomaly.severity)}</span>
                    <span className="anomaly-title">{anomaly.title}</span>
                    <span className="anomaly-time">{anomaly.time}</span>
                  </div>
                  <p className="anomaly-description">{anomaly.description}</p>
                  <div className="anomaly-action">
                    <span className="action-label">Action:</span> {anomaly.action}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Recommendations */}
          <section className="insights-section recommendations-section">
            <h2>💡 Recommendations</h2>
            <div className="recommendations-list">
              {insights.recommendations.map((rec) => (
                <div key={rec.id} className="recommendation-card">
                  <div className="rec-header">
                    <h3>{rec.title}</h3>
                    <div className="rec-tags">
                      <span className={`impact-tag ${rec.impact}`}>{rec.impact} impact</span>
                      <span className={`effort-tag ${rec.effort}`}>{rec.effort} effort</span>
                    </div>
                  </div>
                  <p className="rec-description">{rec.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Historical Comparison */}
          <section className="insights-section history-section">
            <h2>📈 Historical Comparison</h2>
            <div className="history-chart">
              <div className="chart-bars">
                {insights.historicalComparison.metrics.tasks.map((value, index) => (
                  <div key={index} className="bar-container">
                    <div
                      className="bar"
                      style={{ height: `${(value / 180) * 100}%` }}
                    >
                      <span className="bar-value">{value}</span>
                    </div>
                    <span className="bar-label">{insights.historicalComparison.periods[index]}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

export default InsightsPanel;
