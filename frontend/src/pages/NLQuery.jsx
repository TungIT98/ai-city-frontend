/**
 * Natural Language Query Interface
 * Conversational analytics - ask questions and get visual answers
 */
import { useState, useEffect, useRef } from 'react';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement,
  Title, Tooltip, Legend, Filler
} from 'chart.js';
import './NLQuery.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

// Query templates
const queryTemplates = [
  { label: 'Q1 Revenue by Region', query: 'Show me Q1 revenue by region' },
  { label: 'Lead Conversion Rate', query: 'What is our lead conversion rate by source?' },
  { label: 'MRR Trend', query: 'Show me MRR trend for the last 6 months' },
  { label: 'Top Performing Agents', query: 'Which agents are performing best this week?' },
  { label: 'Churn Analysis', query: 'What is our monthly churn rate?' },
  { label: 'Lead Volume by Day', query: 'Show me lead volume by day of week' },
];

// Mock query responses
const mockResponses = {
  'Show me Q1 revenue by region': {
    type: 'bar',
    title: 'Q1 Revenue by Region',
    data: {
      labels: ['Ho Chi Minh City', 'Hanoi', 'Da Nang', 'Can Tho', 'Hai Phong'],
      datasets: [{
        label: 'Revenue (VND)',
        data: [485000000, 392000000, 156000000, 98000000, 124000000],
        backgroundColor: ['#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899'],
        borderRadius: 8,
      }],
    },
    summary: 'Total Q1 revenue across all regions: VND 1.255B. Ho Chi Minh City leads with 38.6% of total revenue.',
    insights: ['Ho Chi Minh City shows strongest growth (12% QoQ)', 'Da Nang region has highest conversion rate (8.2%)'],
  },
  'What is our lead conversion rate by source?': {
    type: 'doughnut',
    title: 'Lead Conversion Rate by Source',
    data: {
      labels: ['Organic Search', 'Paid Ads', 'Social Media', 'Referral', 'Direct'],
      datasets: [{
        data: [12.4, 8.7, 6.2, 15.8, 9.1],
        backgroundColor: ['#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899'],
        borderWidth: 0,
      }],
    },
    summary: 'Referral leads have the highest conversion rate at 15.8%. Paid ads convert at 8.7%.',
    insights: ['Referral channel ROI is 2.3x higher than paid ads', 'Organic search has best quality leads by LTV'],
  },
  'Show me MRR trend for the last 6 months': {
    type: 'line',
    title: 'MRR Trend (Last 6 Months)',
    data: {
      labels: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
      datasets: [{
        label: 'MRR (VND)',
        data: [980000000, 1045000000, 1120000000, 1080000000, 1190000000, 1255000000],
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true,
        tension: 0.4,
      }],
    },
    summary: 'MRR grew from VND 980M to VND 1.255B, a 28.1% increase over 6 months.',
    insights: ['Feb had a dip due to seasonal churn', 'Current trajectory suggests VND 1.4B by June'],
  },
  'Which agents are performing best this week?': {
    type: 'bar',
    title: 'Agent Performance - This Week',
    data: {
      labels: ['Social Media', 'Content Writer', 'Support Bot', 'Data Entry', 'Sales Assistant'],
      datasets: [{
        label: 'Tasks Completed',
        data: [847, 623, 1294, 2156, 432],
        backgroundColor: '#10b981',
        borderRadius: 8,
      }],
    },
    summary: 'Data Entry Agent leads with 2,156 tasks. Support Bot handled 1,294 conversations.',
    insights: ['Social Media Agent has highest satisfaction score (4.8/5)', 'Sales Assistant shows 23% improvement WoW'],
  },
  'What is our monthly churn rate?': {
    type: 'line',
    title: 'Monthly Churn Rate',
    data: {
      labels: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
      datasets: [{
        label: 'Churn Rate (%)',
        data: [4.2, 3.8, 3.5, 3.9, 3.2, 3.1],
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        fill: true,
        tension: 0.4,
      }],
    },
    summary: 'Monthly churn rate is 3.1%, down from 4.2% in October. Industry average is 5%.',
    insights: ['Enterprise tier churn is only 0.8%', 'Starter tier has highest churn at 6.2%'],
  },
  'Show me lead volume by day of week': {
    type: 'bar',
    title: 'Lead Volume by Day of Week',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        label: 'Leads',
        data: [245, 312, 298, 276, 189, 67, 45],
        backgroundColor: '#6366f1',
        borderRadius: 8,
      }],
    },
    summary: 'Tuesday has the highest lead volume (312). Weekends are 80% lower than weekdays.',
    insights: ['Peak hours: 9-11 AM on weekdays', 'Consider weekend campaigns to boost volume'],
  },
};

export default function NLQuery() {
  const [query, setQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [response, setResponse] = useState(null);
  const [history, setHistory] = useState([
    { query: 'Show me our monthly revenue', time: 'Today, 2:30 PM' },
    { query: 'What are the top lead sources?', time: 'Today, 2:15 PM' },
  ]);
  const [voiceActive, setVoiceActive] = useState(false);
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsProcessing(true);
    setHistory(prev => [{ query, time: 'Just now' }, ...prev.slice(0, 9)]);

    setTimeout(() => {
      const matchedResponse = mockResponses[query] || mockResponses[Object.keys(mockResponses).find(k =>
        k.toLowerCase().includes(query.toLowerCase().split(' ')[0])
      )] || Object.values(mockResponses)[0];
      setResponse(matchedResponse);
      setIsProcessing(false);
      setQuery('');
    }, 1500);
  };

  const handleTemplate = (template) => {
    setQuery(template.query);
    inputRef.current?.focus();
  };

  const renderChart = () => {
    if (!response) return null;
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: response.type === 'doughnut' ? 'right' : 'top' } },
    };

    if (response.type === 'bar') return <Bar data={response.data} options={options} />;
    if (response.type === 'line') return <Line data={response.data} options={{ ...options, scales: { y: { grid: { color: 'rgba(0,0,0,0.05)' } }, x: { grid: { display: false } } } }} />;
    if (response.type === 'doughnut') return <Doughnut data={response.data} options={options} />;
    return null;
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: response?.type === 'doughnut' ? 'right' : 'top',
        labels: { usePointStyle: true, padding: 20 }
      },
    },
    scales: response?.type === 'doughnut' ? {} : {
      y: { grid: { color: 'rgba(0,0,0,0.05)' } },
      x: { grid: { display: false } },
    },
  };

  return (
    <div className="nl-query-page">
      <div className="page-header">
        <div>
          <h1>Natural Language Query</h1>
          <p className="subtitle">Ask questions in plain English - get visual answers instantly</p>
        </div>
      </div>

      {/* Query Input */}
      <div className="query-interface">
        <form onSubmit={handleSubmit} className="query-form">
          <div className="query-input-wrapper">
            <span className="query-icon">💬</span>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Ask anything... e.g., 'Show me Q1 revenue by region'"
              className="query-input"
              disabled={isProcessing}
            />
            {isProcessing && <div className="processing-indicator">🤖</div>}
            <button type="submit" className="btn-primary query-submit" disabled={isProcessing || !query.trim()}>
              {isProcessing ? 'Analyzing...' : 'Ask'}
            </button>
          </div>
          <div className="voice-input-toggle">
            <button
              type="button"
              className={`voice-btn ${voiceActive ? 'active' : ''}`}
              onClick={() => setVoiceActive(!voiceActive)}
              title="Voice input"
            >
              🎤 Voice
            </button>
          </div>
        </form>

        {/* Query Templates */}
        <div className="query-templates">
          <span className="templates-label">Quick templates:</span>
          {queryTemplates.map((t, i) => (
            <button key={i} className="template-chip" onClick={() => handleTemplate(t)}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Response Area */}
      <div className="response-area">
        {isProcessing && (
          <div className="processing-state">
            <div className="ai-thinking">
              <div className="thinking-dots">
                <span></span><span></span><span></span>
              </div>
              <p>AI is analyzing your data...</p>
            </div>
          </div>
        )}

        {!isProcessing && response && (
          <div className="query-result">
            <div className="result-header">
              <h3>{response.title}</h3>
              <button className="btn-icon" title="Export">📥</button>
              <button className="btn-icon" title="Expand">🔍</button>
            </div>
            <div className="result-chart">
              {response.type === 'bar' && <Bar data={response.data} options={chartOptions} />}
              {response.type === 'line' && <Line data={response.data} options={chartOptions} />}
              {response.type === 'doughnut' && <Doughnut data={response.data} options={chartOptions} />}
            </div>
            <div className="result-summary">
              <div className="summary-icon">📊</div>
              <p>{response.summary}</p>
            </div>
            {response.insights && (
              <div className="result-insights">
                <h4>AI Insights:</h4>
                <ul>
                  {response.insights.map((ins, i) => <li key={i}>{ins}</li>)}
                </ul>
              </div>
            )}
            <div className="result-actions">
              <button className="btn-secondary">📋 Add to Report</button>
              <button className="btn-secondary">🔔 Create Alert</button>
              <button className="btn-secondary">📤 Share</button>
            </div>
          </div>
        )}

        {!isProcessing && !response && (
          <div className="empty-state">
            <div className="empty-icon">🤖</div>
            <h3>Ask a question</h3>
            <p>Try: "Show me Q1 revenue by region" or "What is our churn rate?"</p>
          </div>
        )}
      </div>

      {/* Query History */}
      <div className="query-history">
        <h3>📜 Recent Queries</h3>
        <div className="history-list">
          {history.map((h, i) => (
            <div key={i} className="history-item" onClick={() => { setQuery(h.query); handleSubmit({ preventDefault: () => {} }); }}>
              <span className="history-query">{h.query}</span>
              <span className="history-time">{h.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
