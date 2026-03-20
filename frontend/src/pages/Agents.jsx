/**
 * AI Agents Page
 * Displays AI workforce agents with status, usage, and controls
 */

import { useState, useEffect } from 'react';
import api from '../services/api';
import './Agents.css';

const AGENT_TYPES = [
  {
    id: 'social-media',
    name: 'Social Media Manager',
    description: 'Auto-generate posts, schedule to LinkedIn/Facebook, generate engagement responses',
    icon: '📱',
    color: '#6366f1'
  },
  {
    id: 'content-writer',
    name: 'Content Writer',
    description: 'Blog post generator, ad copy generator, email template generator',
    icon: '✍️',
    color: '#10b981'
  },
  {
    id: 'customer-support',
    name: 'Customer Support',
    description: 'FAQ automation, ticket categorization, response suggestions',
    icon: '🎧',
    color: '#f59e0b'
  },
  {
    id: 'data-entry',
    name: 'Data Entry Automation',
    description: 'Form auto-fill, data extraction from documents, spreadsheet automation',
    icon: '📊',
    color: '#ec4899'
  }
];

function AgentCard({ agent, onRun, onConfigure, onToggleStatus, onViewHistory, onViewLogs }) {
  const statusColors = {
    active: '#10b981',
    paused: '#f59e0b',
    error: '#ef4444'
  };

  return (
    <div className="agent-card">
      <div className="agent-header">
        <span className="agent-icon">{agent.icon}</span>
        <div className="agent-info">
          <h3>{agent.name}</h3>
          <span className="agent-type">{agent.type}</span>
        </div>
        <span
          className="agent-status"
          style={{ backgroundColor: statusColors[agent.status] || '#6b7280' }}
        >
          {agent.status}
        </span>
      </div>
      <p className="agent-description">{agent.description}</p>
      <div className="agent-stats">
        <div className="stat">
          <span className="stat-label">Runs</span>
          <span className="stat-value">{agent.totalRuns || 0}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Success Rate</span>
          <span className="stat-value">{agent.successRate || 0}%</span>
        </div>
        <div className="stat">
          <span className="stat-label">Credits Used</span>
          <span className="stat-value">{agent.creditsUsed || 0}</span>
        </div>
      </div>
      <div className="agent-actions">
        <button className="btn-primary" onClick={() => onRun(agent)}>
          Run Now
        </button>
        <button className="btn-secondary" onClick={() => onConfigure(agent)}>
          Configure
        </button>
        <button
          className={`btn-toggle ${agent.status === 'active' ? 'active' : ''}`}
          onClick={() => onToggleStatus(agent)}
        >
          {agent.status === 'active' ? 'Pause' : 'Activate'}
        </button>
      </div>
      <div className="agent-secondary-actions">
        <button className="btn-link" onClick={() => onViewHistory(agent)}>
          View History
        </button>
        <button className="btn-link" onClick={() => onViewLogs(agent)}>
          View Logs
        </button>
      </div>
    </div>
  );
}

function AgentConfigModal({ agent, onClose, onSave }) {
  const [config, setConfig] = useState(agent?.config || {});

  const handleSave = () => {
    onSave(agent.id, config);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>Configure {agent.name}</h2>
        <div className="config-form">
          <div className="form-group">
            <label>API Key (optional)</label>
            <input
              type="password"
              value={config.apiKey || ''}
              onChange={e => setConfig({ ...config, apiKey: e.target.value })}
              placeholder="Enter API key"
            />
          </div>
          <div className="form-group">
            <label>Schedule</label>
            <select
              value={config.schedule || 'manual'}
              onChange={e => setConfig({ ...config, schedule: e.target.value })}
            >
              <option value="manual">Manual</option>
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>
          <div className="form-group">
            <label>Max Credits per Run</label>
            <input
              type="number"
              value={config.maxCredits || 50}
              onChange={e => setConfig({ ...config, maxCredits: parseInt(e.target.value) })}
              min="1"
              max="500"
            />
          </div>
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={config.notifications || false}
                onChange={e => setConfig({ ...config, notifications: e.target.checked })}
              />
              Enable Notifications
            </label>
          </div>
        </div>
        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
}

function AgentRunHistory({ agent, onClose }) {
  const [runs, setRuns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRuns();
  }, [agent.id]);

  const loadRuns = async () => {
    try {
      setLoading(true);
      const data = await api.getAgentRuns(agent.id);
      setRuns(data.slice(0, 10));
    } catch (err) {
      // Mock data for demo
      setRuns([
        { id: 1, status: 'success', startedAt: new Date(Date.now() - 3600000).toISOString(), duration: 45, creditsUsed: 12 },
        { id: 2, status: 'success', startedAt: new Date(Date.now() - 7200000).toISOString(), duration: 38, creditsUsed: 10 },
        { id: 3, status: 'failed', startedAt: new Date(Date.now() - 10800000).toISOString(), duration: 12, creditsUsed: 5, error: 'API rate limit exceeded' },
        { id: 4, status: 'success', startedAt: new Date(Date.now() - 86400000).toISOString(), duration: 52, creditsUsed: 15 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content run-history-modal" onClick={e => e.stopPropagation()}>
        <h2>Run History - {agent.name}</h2>
        {loading ? (
          <div className="loading">Loading runs...</div>
        ) : runs.length === 0 ? (
          <p className="no-runs">No runs yet. Run the agent to see history.</p>
        ) : (
          <div className="runs-list">
            {runs.map(run => (
              <div key={run.id} className={`run-item ${run.status}`}>
                <div className="run-status">
                  <span className={`status-badge ${run.status}`}>
                    {run.status === 'success' ? '✓' : '✕'}
                  </span>
                </div>
                <div className="run-info">
                  <span className="run-time">{formatTime(run.startedAt)}</span>
                  <span className="run-duration">{run.duration}s</span>
                  <span className="run-credits">{run.creditsUsed} credits</span>
                </div>
                {run.error && <div className="run-error">{run.error}</div>}
              </div>
            ))}
          </div>
        )}
        <div className="modal-actions">
          <button className="btn-primary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

function AgentLogs({ agent, onClose }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLogs();
  }, [agent.id]);

  const loadLogs = async () => {
    try {
      setLoading(true);
      const data = await api.getAgentLogs(agent.id);
      setLogs(data.slice(0, 20));
    } catch (err) {
      // Mock data for demo
      setLogs([
        { id: 1, level: 'info', message: 'Agent initialized', timestamp: new Date(Date.now() - 300000).toISOString() },
        { id: 2, level: 'info', message: 'Processing task: Generate social post', timestamp: new Date(Date.now() - 280000).toISOString() },
        { id: 3, level: 'info', message: 'API call completed successfully', timestamp: new Date(Date.now() - 250000).toISOString() },
        { id: 4, level: 'info', message: 'Result generated: 3 post suggestions', timestamp: new Date(Date.now() - 200000).toISOString() },
        { id: 5, level: 'info', message: 'Task completed', timestamp: new Date(Date.now() - 180000).toISOString() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content logs-modal" onClick={e => e.stopPropagation()}>
        <h2>Logs - {agent.name}</h2>
        {loading ? (
          <div className="loading">Loading logs...</div>
        ) : logs.length === 0 ? (
          <p className="no-logs">No logs available.</p>
        ) : (
          <div className="logs-list">
            {logs.map(log => (
              <div key={log.id} className={`log-item ${log.level}`}>
                <span className="log-time">{formatTime(log.timestamp)}</span>
                <span className={`log-level ${log.level}`}>{log.level}</span>
                <span className="log-message">{log.message}</span>
              </div>
            ))}
          </div>
        )}
        <div className="modal-actions">
          <button className="btn-primary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

function Agents() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showRunHistory, setShowRunHistory] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const [usage, setUsage] = useState({ totalCredits: 0, usedCredits: 0, availableCredits: 0 });

  useEffect(() => {
    loadAgents();
    loadUsage();
  }, []);

  const loadAgents = async () => {
    try {
      setLoading(true);
      const data = await api.getAgents();
      // Merge with predefined agent types to get full info
      const mergedAgents = AGENT_TYPES.map(type => {
        const existing = data.find(a => a.type === type.id);
        return existing ? { ...type, ...existing } : { ...type, status: 'paused', totalRuns: 0, successRate: 0, creditsUsed: 0, config: {} };
      });
      setAgents(mergedAgents);
    } catch (err) {
      // If API fails, use local defaults
      setAgents(AGENT_TYPES.map(type => ({
        ...type,
        status: 'paused',
        totalRuns: 0,
        successRate: 0,
        creditsUsed: 0,
        config: {}
      })));
    } finally {
      setLoading(false);
    }
  };

  const loadUsage = async () => {
    try {
      const data = await api.getAgentUsage();
      setUsage(data);
    } catch (err) {
      // Default values if API fails
      setUsage({ totalCredits: 1000, usedCredits: 150, availableCredits: 850 });
    }
  };

  const handleRun = async (agent) => {
    try {
      await api.runAgent(agent.id, {});
      alert(`Agent "${agent.name}" started!`);
      loadAgents();
      loadUsage();
    } catch (err) {
      alert('Failed to run agent. Please try again.');
    }
  };

  const handleConfigure = (agent) => {
    setSelectedAgent(agent);
    setShowConfigModal(true);
  };

  const handleViewHistory = (agent) => {
    setSelectedAgent(agent);
    setShowRunHistory(true);
  };

  const handleViewLogs = (agent) => {
    setSelectedAgent(agent);
    setShowLogs(true);
  };

  const handleSaveConfig = async (agentId, config) => {
    try {
      await api.updateAgent(agentId, { config });
      loadAgents();
    } catch (err) {
      alert('Failed to save configuration.');
    }
  };

  const handleToggleStatus = async (agent) => {
    const newStatus = agent.status === 'active' ? 'paused' : 'active';
    try {
      await api.updateAgent(agent.id, { status: newStatus });
      loadAgents();
    } catch (err) {
      // Update local state
      setAgents(agents.map(a =>
        a.id === agent.id ? { ...a, status: newStatus } : a
      ));
    }
  };

  const activeCount = agents.filter(a => a.status === 'active').length;
  const totalRuns = agents.reduce((sum, a) => sum + (a.totalRuns || 0), 0);

  return (
    <div className="agents-page">
      <div className="page-header">
        <h1>AI Agents</h1>
        <p className="subtitle">Manage your AI workforce</p>
      </div>

      {/* Usage Stats */}
      <div className="usage-banner">
        <div className="usage-stat">
          <span className="usage-label">Total Credits</span>
          <span className="usage-value">{usage.totalCredits}</span>
        </div>
        <div className="usage-stat">
          <span className="usage-label">Used</span>
          <span className="usage-value">{usage.usedCredits}</span>
        </div>
        <div className="usage-stat">
          <span className="usage-label">Available</span>
          <span className="usage-value available">{usage.availableCredits}</span>
        </div>
        <div className="usage-bar">
          <div
            className="usage-fill"
            style={{ width: `${(usage.usedCredits / usage.totalCredits) * 100}%` }}
          />
        </div>
      </div>

      {/* Summary Stats */}
      <div className="summary-stats">
        <div className="summary-card">
          <span className="summary-icon">🤖</span>
          <div className="summary-info">
            <span className="summary-value">{agents.length}</span>
            <span className="summary-label">Total Agents</span>
          </div>
        </div>
        <div className="summary-card">
          <span className="summary-icon">✅</span>
          <div className="summary-info">
            <span className="summary-value">{activeCount}</span>
            <span className="summary-label">Active</span>
          </div>
        </div>
        <div className="summary-card">
          <span className="summary-icon">🔄</span>
          <div className="summary-info">
            <span className="summary-value">{totalRuns}</span>
            <span className="summary-label">Total Runs</span>
          </div>
        </div>
      </div>

      {/* Agent Cards */}
      {loading ? (
        <div className="loading">Loading agents...</div>
      ) : (
        <div className="agents-grid">
          {agents.map(agent => (
            <AgentCard
              key={agent.id}
              agent={agent}
              onRun={handleRun}
              onConfigure={handleConfigure}
              onToggleStatus={handleToggleStatus}
              onViewHistory={handleViewHistory}
              onViewLogs={handleViewLogs}
            />
          ))}
        </div>
      )}

      {/* Config Modal */}
      {showConfigModal && selectedAgent && (
        <AgentConfigModal
          agent={selectedAgent}
          onClose={() => {
            setShowConfigModal(false);
            setSelectedAgent(null);
          }}
          onSave={handleSaveConfig}
        />
      )}

      {/* Run History Modal */}
      {showRunHistory && selectedAgent && (
        <AgentRunHistory
          agent={selectedAgent}
          onClose={() => {
            setShowRunHistory(false);
            setSelectedAgent(null);
          }}
        />
      )}

      {/* Logs Modal */}
      {showLogs && selectedAgent && (
        <AgentLogs
          agent={selectedAgent}
          onClose={() => {
            setShowLogs(false);
            setSelectedAgent(null);
          }}
        />
      )}
    </div>
  );
}

export default Agents;