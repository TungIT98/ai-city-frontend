/**
 * API Developer Portal - Public API documentation and management
 */
import { useState } from 'react';
import './ApiPortal.css';

const ENDPOINTS = [
  {
    group: 'Authentication',
    endpoints: [
      { method: 'POST', path: '/auth/login', desc: 'Authenticate user and receive JWT token', auth: false },
      { method: 'POST', path: '/auth/register', desc: 'Register new user and workspace', auth: false },
      { method: 'POST', path: '/auth/refresh', desc: 'Refresh JWT token', auth: false },
      { method: 'GET', path: '/users/me', desc: 'Get current user profile', auth: true },
    ],
  },
  {
    group: 'Analytics',
    endpoints: [
      { method: 'GET', path: '/analytics/overview', desc: 'Get dashboard overview metrics', auth: true },
      { method: 'GET', path: '/analytics/mrr', desc: 'Monthly recurring revenue data', auth: true },
      { method: 'GET', path: '/analytics/churn', desc: 'Churn rate metrics', auth: true },
      { method: 'GET', path: '/analytics/ltv', desc: 'Customer lifetime value', auth: true },
      { method: 'GET', path: '/analytics/cohorts', desc: 'Cohort retention analysis', auth: true },
      { method: 'GET', path: '/analytics/dau', desc: 'Daily active users', auth: true },
    ],
  },
  {
    group: 'Leads',
    endpoints: [
      { method: 'GET', path: '/leads', desc: 'List all leads with filtering', auth: true },
      { method: 'POST', path: '/leads', desc: 'Create a new lead', auth: true },
      { method: 'GET', path: '/leads/:id', desc: 'Get lead details', auth: true },
      { method: 'PATCH', path: '/leads/:id', desc: 'Update lead information', auth: true },
      { method: 'GET', path: '/leads/analytics/conversion', desc: 'Lead conversion analytics', auth: true },
      { method: 'GET', path: '/leads/attribution', desc: 'Multi-touch attribution data', auth: true },
    ],
  },
  {
    group: 'AI Agents',
    endpoints: [
      { method: 'GET', path: '/agents', desc: 'List all AI agents', auth: true },
      { method: 'POST', path: '/agents', desc: 'Create new agent', auth: true },
      { method: 'POST', path: '/agents/:id/run', desc: 'Trigger agent execution', auth: true },
      { method: 'GET', path: '/agents/:id/runs', desc: 'Get agent run history', auth: true },
      { method: 'GET', path: '/agents/:id/logs', desc: 'Get agent logs', auth: true },
    ],
  },
  {
    group: 'Reports',
    endpoints: [
      { method: 'GET', path: '/reports', desc: 'List generated reports', auth: true },
      { method: 'POST', path: '/reports/generate', desc: 'Generate new report', auth: true },
      { method: 'GET', path: '/reports/:id', desc: 'Get report details', auth: true },
    ],
  },
];

const WEBHOOKS = [
  { event: 'lead.created', desc: 'Triggered when a new lead is created', enabled: true },
  { event: 'lead.updated', desc: 'Triggered when lead status changes', enabled: true },
  { event: 'agent.run.completed', desc: 'Triggered when agent finishes running', enabled: false },
  { event: 'report.generated', desc: 'Triggered when scheduled report completes', enabled: false },
  { event: 'churn.detected', desc: 'Triggered when high churn risk detected', enabled: true },
];

export default function ApiPortal() {
  const [activeTab, setActiveTab] = useState('docs');
  const [expandedGroup, setExpandedGroup] = useState('Authentication');
  const [apiKey, setApiKey] = useState('aik_aicity_••••••••••••••••••••••••••••••');
  const [selectedEndpoint, setSelectedEndpoint] = useState(null);
  const [webhooks, setWebhooks] = useState(WEBHOOKS);
  const [rateLimit, setRateLimit] = useState({ used: 12847, limit: 50000 });

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const toggleWebhook = (event) => {
    setWebhooks(prev => prev.map(w => w.event === event ? { ...w, enabled: !w.enabled } : w));
  };

  return (
    <div className="api-portal-page">
      <div className="page-header">
        <div>
          <h1>API Developer Portal</h1>
          <p>Build powerful integrations with the AI City API</p>
        </div>
        <div className="header-stats">
          <div className="stat-pill">
            <span className="stat-label">Plan</span>
            <span className="stat-value">Pro</span>
          </div>
          <div className="stat-pill">
            <span className="stat-label">Rate Limit</span>
            <span className="stat-value">{rateLimit.used.toLocaleString()} / {rateLimit.limit.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="portal-tabs">
        {['docs', 'keys', 'webhooks', 'rate-limits'].map(tab => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'docs' ? '📖 Documentation' :
             tab === 'keys' ? '🔑 API Keys' :
             tab === 'webhooks' ? '🪝 Webhooks' :
             '⚡ Rate Limits'}
          </button>
        ))}
      </div>

      {activeTab === 'docs' && (
        <div className="docs-layout">
          <div className="endpoints-sidebar">
            {ENDPOINTS.map(group => (
              <div key={group.group} className="endpoint-group">
                <button
                  className={`group-header ${expandedGroup === group.group ? 'expanded' : ''}`}
                  onClick={() => setExpandedGroup(expandedGroup === group.group ? null : group.group)}
                >
                  {group.group}
                  <span className="count">{group.endpoints.length}</span>
                </button>
                {expandedGroup === group.group && (
                  <div className="endpoints-list">
                    {group.endpoints.map(ep => (
                      <button
                        key={ep.path}
                        className={`endpoint-item ${selectedEndpoint?.path === ep.path ? 'active' : ''}`}
                        onClick={() => setSelectedEndpoint(ep)}
                      >
                        <span className={`method method-${ep.method.toLowerCase()}`}>{ep.method}</span>
                        <span className="path">{ep.path}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="endpoint-detail">
            {selectedEndpoint ? (
              <>
                <div className="detail-header">
                  <span className={`method method-${selectedEndpoint.method.toLowerCase()} large`}>
                    {selectedEndpoint.method}
                  </span>
                  <h2>{selectedEndpoint.path}</h2>
                </div>
                <p className="detail-desc">{selectedEndpoint.desc}</p>

                <div className="detail-section">
                  <h4>Base URL</h4>
                  <div className="code-block">
                    <code>https://aicity-backend-deploy.vercel.app</code>
                    <button className="copy-btn" onClick={() => copyToClipboard('https://aicity-backend-deploy.vercel.app')}>Copy</button>
                  </div>
                </div>

                <div className="detail-section">
                  <h4>Full Request URL</h4>
                  <div className="code-block">
                    <code>https://aicity-backend-deploy.vercel.app{selectedEndpoint.path}</code>
                    <button className="copy-btn" onClick={() => copyToClipboard(`https://aicity-backend-deploy.vercel.app${selectedEndpoint.path}`)}>Copy</button>
                  </div>
                </div>

                {selectedEndpoint.auth && (
                  <div className="detail-section">
                    <h4>Headers</h4>
                    <div className="code-block">
                      <pre>{`{
  "Authorization": "Bearer YOUR_API_KEY",
  "Content-Type": "application/json"
}`}</pre>
                      <button className="copy-btn" onClick={() => copyToClipboard('Authorization: Bearer YOUR_API_KEY\nContent-Type: application/json')}>Copy</button>
                    </div>
                  </div>
                )}

                <div className="detail-section">
                  <h4>Example Response</h4>
                  <div className="code-block">
                    <pre>{`{
  "success": true,
  "data": {
    "id": "123",
    "created_at": "2026-03-21T10:00:00Z"
  }
}`}</pre>
                  </div>
                </div>
              </>
            ) : (
              <div className="empty-detail">
                <span className="empty-icon">📖</span>
                <h3>Select an endpoint</h3>
                <p>Choose an endpoint from the sidebar to view its documentation</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'keys' && (
        <div className="keys-section">
          <div className="keys-header">
            <div>
              <h3>API Keys</h3>
              <p>Manage your API keys for authentication</p>
            </div>
            <button className="create-key-btn">+ Generate New Key</button>
          </div>
          <div className="key-list">
            <div className="key-item primary">
              <div className="key-info">
                <h4>Production Key</h4>
                <code>{apiKey}</code>
                <span className="key-meta">Created Mar 15, 2026 • Last used 2 hours ago</span>
              </div>
              <div className="key-actions">
                <button className="key-btn" onClick={() => copyToClipboard('aik_aicity_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')}>Copy</button>
                <button className="key-btn danger">Rotate</button>
              </div>
            </div>
            <div className="key-item">
              <div className="key-info">
                <h4>Test Key</h4>
                <code>aik_test_••••••••••••••••••••••••••••••</code>
                <span className="key-meta">Created Mar 10, 2026 • Not used yet</span>
              </div>
              <div className="key-actions">
                <button className="key-btn">Copy</button>
                <button className="key-btn danger">Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'webhooks' && (
        <div className="webhooks-section">
          <div className="webhooks-header">
            <div>
              <h3>Webhooks</h3>
              <p>Configure HTTP callbacks for real-time event notifications</p>
            </div>
            <button className="add-webhook-btn">+ Add Webhook</button>
          </div>
          <div className="webhook-list">
            {webhooks.map(webhook => (
              <div key={webhook.event} className="webhook-item">
                <div className="webhook-info">
                  <h4>{webhook.event}</h4>
                  <p>{webhook.desc}</p>
                </div>
                <div className="webhook-config">
                  <input
                    type="text"
                    placeholder="https://your-server.com/webhook"
                    className="webhook-url"
                  />
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={webhook.enabled}
                      onChange={() => toggleWebhook(webhook.event)}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'rate-limits' && (
        <div className="rate-limits-section">
          <h3>Rate Limits</h3>
          <div className="rate-cards">
            <div className="rate-card">
              <div className="rate-header">
                <span>Requests per minute</span>
                <span className="rate-plan">Pro Plan</span>
              </div>
              <div className="rate-value">60</div>
              <div className="rate-bar">
                <div className="rate-used" style={{ width: '42%' }}></div>
              </div>
              <span className="rate-detail">25 of 60 used this minute</span>
            </div>
            <div className="rate-card">
              <div className="rate-header">
                <span>Requests per day</span>
                <span className="rate-plan">Pro Plan</span>
              </div>
              <div className="rate-value">50,000</div>
              <div className="rate-bar">
                <div className="rate-used" style={{ width: '25.7%' }}></div>
              </div>
              <span className="rate-detail">12,847 of 50,000 used today</span>
            </div>
            <div className="rate-card">
              <div className="rate-header">
                <span>Monthly quota</span>
                <span className="rate-plan">Pro Plan</span>
              </div>
              <div className="rate-value">1,000,000</div>
              <div className="rate-bar">
                <div className="rate-used" style={{ width: '8.4%' }}></div>
              </div>
              <span className="rate-detail">84,230 of 1,000,000 used this month</span>
            </div>
          </div>
          <div className="rate-limits-table">
            <h4>Endpoint-specific Limits</h4>
            <table>
              <thead>
                <tr>
                  <th>Endpoint</th>
                  <th>Limit</th>
                  <th>Window</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>/auth/*</code></td>
                  <td>10</td>
                  <td>per minute</td>
                </tr>
                <tr>
                  <td><code>/reports/generate</code></td>
                  <td>20</td>
                  <td>per hour</td>
                </tr>
                <tr>
                  <td><code>/leads</code></td>
                  <td>1,000</td>
                  <td>per day</td>
                </tr>
                <tr>
                  <td><code>/agents/:id/run</code></td>
                  <td>100</td>
                  <td>per hour</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
