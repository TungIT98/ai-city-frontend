/**
 * Agent Marketplace Dashboard
 * Dashboard for managing hired AI agents
 */
import { useState } from 'react';
import './AgentMarketplaceDashboard.css';

function AgentMarketplaceDashboard() {
  const [agents] = useState([
    {
      id: 1,
      name: 'Sales Champion Pro',
      icon: '🎯',
      status: 'active',
      usage: { minutes: 450, calls: 125, orders: 28 },
      credits: 75,
      maxCredits: 100
    },
    {
      id: 2,
      name: 'Customer Support Bot',
      icon: '💬',
      status: 'active',
      usage: { minutes: 280, calls: 89, orders: 0 },
      credits: 90,
      maxCredits: 100
    },
    {
      id: 3,
      name: 'Lead Qualifier AI',
      icon: '🔍',
      status: 'paused',
      usage: { minutes: 120, calls: 45, orders: 12 },
      credits: 100,
      maxCredits: 100
    }
  ]);

  const [billingHistory] = useState([
    { id: 1, date: '2026-03-15', amount: '7,990,000', status: 'Paid', type: 'Monthly' },
    { id: 2, date: '2026-02-15', amount: '7,990,000', status: 'Paid', type: 'Monthly' },
    { id: 3, date: '2026-01-20', amount: '2,990,000', status: 'Paid', type: 'Pay-as-you-go' },
    { id: 4, date: '2026-01-15', amount: '7,990,000', status: 'Paid', type: 'Monthly' }
  ]);

  const handleUpgrade = (agentId) => {
    alert(`Upgrade plan for agent ${agentId}`);
  };

  const handlePause = (agentId) => {
    alert(`Pause agent ${agentId}`);
  };

  return (
    <div className="agent-dashboard">
      <div className="dashboard-header">
        <h1>🤖 Agent Marketplace</h1>
        <p>Manage your hired AI agents</p>
      </div>

      {/* Stats Overview */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-info">
            <span className="stat-value">{agents.length}</span>
            <span className="stat-label">Active Agents</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏱️</div>
          <div className="stat-info">
            <span className="stat-value">850</span>
            <span className="stat-label">Minutes Used</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📞</div>
          <div className="stat-info">
            <span className="stat-value">259</span>
            <span className="stat-label">Total Calls</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <span className="stat-value">40</span>
            <span className="stat-label">Orders Generated</span>
          </div>
        </div>
      </div>

      {/* Agents Section */}
      <div className="dashboard-section">
        <div className="section-header">
          <h2>Your Agents</h2>
          <button className="btn btn-primary">+ Hire New Agent</button>
        </div>
        <div className="agents-list">
          {agents.map(agent => (
            <div key={agent.id} className="agent-item">
              <div className="agent-info">
                <div className="agent-icon">{agent.icon}</div>
                <div className="agent-details">
                  <h3>{agent.name}</h3>
                  <span className={`status-badge ${agent.status}`}>
                    {agent.status === 'active' ? '● Active' : '⏸ Paused'}
                  </span>
                </div>
              </div>
              <div className="agent-usage">
                <div className="usage-item">
                  <span className="usage-label">Minutes</span>
                  <span className="usage-value">{agent.usage.minutes}</span>
                </div>
                <div className="usage-item">
                  <span className="usage-label">Calls</span>
                  <span className="usage-value">{agent.usage.calls}</span>
                </div>
                <div className="usage-item">
                  <span className="usage-label">Orders</span>
                  <span className="usage-value">{agent.usage.orders}</span>
                </div>
              </div>
              <div className="agent-credits">
                <span className="credits-label">Credits</span>
                <div className="credits-bar">
                  <div
                    className="credits-fill"
                    style={{ width: `${(agent.credits / agent.maxCredits) * 100}%` }}
                  ></div>
                </div>
                <span className="credits-value">{agent.credits}/{agent.maxCredits}</span>
              </div>
              <div className="agent-actions">
                <button className="btn btn-ghost" onClick={() => handlePause(agent.id)}>
                  {agent.status === 'active' ? 'Pause' : 'Resume'}
                </button>
                <button className="btn btn-secondary" onClick={() => handleUpgrade(agent.id)}>
                  Upgrade
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Billing History */}
      <div className="dashboard-section">
        <div className="section-header">
          <h2>Billing History</h2>
        </div>
        <table className="billing-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {billingHistory.map(bill => (
              <tr key={bill.id}>
                <td>{bill.date}</td>
                <td>{bill.type}</td>
                <td className="amount">{bill.amount} VND</td>
                <td><span className="status-paid">{bill.status}</span></td>
                <td><button className="btn-link">View Invoice</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* API Keys Section */}
      <div className="dashboard-section">
        <div className="section-header">
          <h2>API Keys</h2>
          <button className="btn btn-secondary">+ Generate Key</button>
        </div>
        <div className="api-keys">
          <div className="api-key-item">
            <div className="key-info">
              <span className="key-name">Production API Key</span>
              <code className="key-value">sk-ai-sales-••••••••••••••••</code>
            </div>
            <div className="key-actions">
              <button className="btn btn-ghost">Copy</button>
              <button className="btn btn-ghost">Revoke</button>
            </div>
          </div>
          <div className="api-key-item">
            <div className="key-info">
              <span className="key-name">Development API Key</span>
              <code className="key-value">sk-ai-dev-••••••••••••••••</code>
            </div>
            <div className="key-actions">
              <button className="btn btn-ghost">Copy</button>
              <button className="btn btn-ghost">Revoke</button>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Card */}
      <div className="dashboard-section">
        <div className="subscription-card">
          <div className="sub-info">
            <h3>Professional Plan</h3>
            <p>7,990,000 VND/month • Renews on April 15, 2026</p>
          </div>
          <div className="sub-actions">
            <button className="btn btn-secondary">Change Plan</button>
            <button className="btn btn-ghost">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AgentMarketplaceDashboard;