/**
 * Automation Center
 * Workflow automation builder with triggers, conditions, and actions
 */
import { useState, useEffect } from 'react';
import './AutomationCenter.css';

// Automation templates
const templates = [
  {
    id: 't1',
    name: 'Instant Lead Response',
    description: 'Notify sales team via Slack when a new high-value lead is created',
    trigger: 'Lead Created',
    conditions: ['Lead Score > 70'],
    actions: ['Send Slack message', 'Assign to sales rep'],
    usage: 1247,
  },
  {
    id: 't2',
    name: 'Churn Risk Alert',
    description: 'Alert when customer usage drops below threshold',
    trigger: 'Usage Dropped',
    conditions: ['Usage < 20% for 7 days'],
    actions: ['Email CS team', 'Create task', 'Tag in CRM'],
    usage: 456,
  },
  {
    id: 't3',
    name: 'Revenue Milestone',
    description: 'Celebrate when MRR hits milestones',
    trigger: 'MRR Milestone',
    conditions: ['MRR increased by VND 50M'],
    actions: ['Send team notification', 'Log to activity feed'],
    usage: 89,
  },
];

// Pre-built triggers
const triggers = [
  { id: 'lead_created', label: 'Lead Created', icon: '👤', category: 'Leads' },
  { id: 'lead_score_changed', label: 'Lead Score Changed', icon: '📊', category: 'Leads' },
  { id: 'conversion', label: 'Lead Converted', icon: '✅', category: 'Sales' },
  { id: 'churn_risk', label: 'Churn Risk Detected', icon: '⚠️', category: 'Retention' },
  { id: 'mrr_milestone', label: 'MRR Milestone', icon: '💰', category: 'Revenue' },
  { id: 'api_error', label: 'API Error Spike', icon: '🔴', category: 'Performance' },
  { id: 'schedule', label: 'Schedule (Daily/Weekly)', icon: '⏰', category: 'Time' },
  { id: 'user_signup', label: 'New User Signup', icon: '🎉', category: 'Users' },
];

// Pre-built actions
const actions = [
  { id: 'send_email', label: 'Send Email', icon: '📧' },
  { id: 'send_slack', label: 'Send Slack Message', icon: '💬' },
  { id: 'assign_lead', label: 'Assign Lead to Rep', icon: '👨‍💼' },
  { id: 'create_task', label: 'Create Task', icon: '✅' },
  { id: 'update_crm', label: 'Update CRM', icon: '🔄' },
  { id: 'webhook', label: 'Trigger Webhook', icon: '🌐' },
  { id: 'notify', label: 'In-App Notification', icon: '🔔' },
  { id: 'tag_lead', label: 'Tag Lead', icon: '🏷️' },
];

const conditions = [
  { id: 'lead_score', label: 'Lead Score', operators: ['>', '<', '=', '>=', '<=', 'between'] },
  { id: 'lead_status', label: 'Lead Status', operators: ['is', 'is not'] },
  { id: 'lead_source', label: 'Lead Source', operators: ['is', 'is not', 'contains'] },
  { id: 'revenue', label: 'Revenue', operators: ['>', '<', '=', '>=', '<='] },
  { id: 'mrr', label: 'MRR', operators: ['>', '<', '=', '>=', '<=', 'increased by', 'decreased by'] },
  { id: 'usage', label: 'Usage %', operators: ['>', '<', '=', '>=', '<=', 'between'] },
  { id: 'time', label: 'Time', operators: ['is', 'is between', 'is after', 'is before'] },
];

export default function AutomationCenter() {
  const [automations, setAutomations] = useState([]);
  const [activeTab, setActiveTab] = useState('automations');
  const [showBuilder, setShowBuilder] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [executionLog, setExecutionLog] = useState([]);
  const [loading, setLoading] = useState(true);

  // Builder state
  const [builderName, setBuilderName] = useState('');
  const [builderTrigger, setBuilderTrigger] = useState(null);
  const [builderConditions, setBuilderConditions] = useState([]);
  const [builderActions, setBuilderActions] = useState([]);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setAutomations([
        { id: 1, name: 'High-Value Lead Alert', trigger: 'Lead Created', status: 'active', runs: 234, lastRun: '2 hours ago', successRate: 98 },
        { id: 2, name: 'Churn Prevention', trigger: 'Usage Dropped', status: 'active', runs: 89, lastRun: '1 day ago', successRate: 95 },
        { id: 3, name: 'Weekly Report', trigger: 'Schedule (Weekly)', status: 'active', runs: 12, lastRun: '3 days ago', successRate: 100 },
        { id: 4, name: 'API Error Alert', trigger: 'API Error Spike', status: 'paused', runs: 45, lastRun: '1 week ago', successRate: 92 },
        { id: 5, name: 'Welcome Email', trigger: 'New User Signup', status: 'active', runs: 567, lastRun: '30 min ago', successRate: 99 },
      ]);
      setExecutionLog([
        { id: 1, name: 'High-Value Lead Alert', trigger: 'Lead Created', status: 'success', time: '2 hours ago', duration: '1.2s' },
        { id: 2, name: 'Weekly Report', trigger: 'Schedule (Weekly)', status: 'success', time: '3 days ago', duration: '4.5s' },
        { id: 3, name: 'API Error Alert', trigger: 'API Error Spike', status: 'failed', time: '1 week ago', duration: '0.3s', error: 'Webhook timeout' },
        { id: 4, name: 'Welcome Email', trigger: 'New User Signup', status: 'success', time: '30 min ago', duration: '2.1s' },
        { id: 5, name: 'Churn Prevention', trigger: 'Usage Dropped', status: 'success', time: '1 day ago', duration: '1.8s' },
      ]);
      setLoading(false);
    }, 600);
  }, []);

  const toggleAutomation = (id) => {
    setAutomations(prev => prev.map(a =>
      a.id === id ? { ...a, status: a.status === 'active' ? 'paused' : 'active' } : a
    ));
  };

  const deleteAutomation = (id) => {
    setAutomations(prev => prev.filter(a => a.id !== id));
  };

  const openBuilder = (template = null) => {
    setSelectedTemplate(template);
    setBuilderName(template?.name || '');
    setBuilderTrigger(null);
    setBuilderConditions([]);
    setBuilderActions([]);
    setShowBuilder(true);
  };

  const addCondition = () => {
    setBuilderConditions(prev => [...prev, { field: 'lead_score', operator: '>', value: '' }]);
  };

  const removeCondition = (index) => {
    setBuilderConditions(prev => prev.filter((_, i) => i !== index));
  };

  const addAction = () => {
    setBuilderActions(prev => [...prev, { action: 'send_email', config: {} }]);
  };

  const removeAction = (index) => {
    setBuilderActions(prev => prev.filter((_, i) => i !== index));
  };

  const saveAutomation = () => {
    if (!builderName || !builderTrigger) return;
    const newAutomation = {
      id: Date.now(),
      name: builderName,
      trigger: builderTrigger.label,
      status: 'active',
      runs: 0,
      lastRun: 'Never',
      successRate: 100,
    };
    setAutomations(prev => [newAutomation, ...prev]);
    setShowBuilder(false);
  };

  if (loading) {
    return (
      <div className="automation-center-page">
        <div className="loading-state">
          <div className="automation-icon">⚙️</div>
          <p>Loading automations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="automation-center-page">
      <div className="page-header">
        <div>
          <h1>Automation Center</h1>
          <p className="subtitle">Build intelligent workflows - triggers, conditions, and actions</p>
        </div>
        <button className="btn-primary" onClick={() => openBuilder()}>
          + Create Automation
        </button>
      </div>

      {/* Stats */}
      <div className="automation-stats">
        <div className="stat-card">
          <div className="stat-value">{automations.length}</div>
          <div className="stat-label">Total Automations</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{automations.filter(a => a.status === 'active').length}</div>
          <div className="stat-label">Active</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{automations.reduce((sum, a) => sum + a.runs, 0).toLocaleString()}</div>
          <div className="stat-label">Total Runs</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{Math.round(automations.reduce((sum, a) => sum + a.successRate * a.runs, 0) / Math.max(automations.reduce((sum, a) => sum + a.runs, 1), 1))}%</div>
          <div className="stat-label">Avg Success Rate</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button className={`tab ${activeTab === 'automations' ? 'active' : ''}`} onClick={() => setActiveTab('automations')}>
          ⚙️ Automations
        </button>
        <button className={`tab ${activeTab === 'templates' ? 'active' : ''}`} onClick={() => setActiveTab('templates')}>
          📋 Templates
        </button>
        <button className={`tab ${activeTab === 'execution' ? 'active' : ''}`} onClick={() => setActiveTab('execution')}>
          📜 Execution Log
        </button>
      </div>

      {activeTab === 'automations' && (
        <div className="automations-list">
          {automations.map(a => (
            <div key={a.id} className="automation-card">
              <div className="automation-header">
                <div className="automation-info">
                  <h4>{a.name}</h4>
                  <span className="trigger-badge">{a.trigger}</span>
                </div>
                <div className="automation-controls">
                  <label className="toggle">
                    <input type="checkbox" checked={a.status === 'active'} onChange={() => toggleAutomation(a.id)} />
                    <span className="toggle-slider"></span>
                  </label>
                  <button className="btn-icon" onClick={() => deleteAutomation(a.id)}>🗑️</button>
                </div>
              </div>
              <div className="automation-stats-row">
                <div className="mini-stat">
                  <span className="mini-value">{a.runs.toLocaleString()}</span>
                  <span className="mini-label">Runs</span>
                </div>
                <div className="mini-stat">
                  <span className="mini-value">{a.successRate}%</span>
                  <span className="mini-label">Success</span>
                </div>
                <div className="mini-stat">
                  <span className="mini-value">{a.lastRun}</span>
                  <span className="mini-label">Last Run</span>
                </div>
              </div>
              <div className="automation-actions-row">
                <button className="btn-action">Edit</button>
                <button className="btn-action secondary">View Runs</button>
                <button className="btn-action secondary">Run Now</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'templates' && (
        <div className="templates-grid">
          {templates.map(t => (
            <div key={t.id} className="template-card">
              <div className="template-icon">⚡</div>
              <h4>{t.name}</h4>
              <p>{t.description}</p>
              <div className="template-meta">
                <span>📌 {t.trigger}</span>
                <span>🔄 {t.actions.length} actions</span>
              </div>
              <div className="template-usage">{t.usage.toLocaleString()} automations created</div>
              <button className="btn-primary" onClick={() => openBuilder(t)}>Use Template</button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'execution' && (
        <div className="execution-log">
          <table className="log-table">
            <thead>
              <tr>
                <th>Automation</th>
                <th>Trigger</th>
                <th>Status</th>
                <th>Time</th>
                <th>Duration</th>
                <th>Error</th>
              </tr>
            </thead>
            <tbody>
              {executionLog.map(log => (
                <tr key={log.id}>
                  <td>{log.name}</td>
                  <td>{log.trigger}</td>
                  <td>
                    <span className={`status-badge ${log.status}`}>
                      {log.status === 'success' ? '✅' : '❌'} {log.status}
                    </span>
                  </td>
                  <td>{log.time}</td>
                  <td>{log.duration}</td>
                  <td>{log.error || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Automation Builder Modal */}
      {showBuilder && (
        <div className="modal-overlay" onClick={() => setShowBuilder(false)}>
          <div className="modal-content builder-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedTemplate ? 'Use Template' : 'Create Automation'}</h3>
              <button className="btn-icon" onClick={() => setShowBuilder(false)}>✕</button>
            </div>

            <div className="builder-body">
              <div className="builder-section">
                <label>Automation Name</label>
                <input
                  type="text"
                  value={builderName}
                  onChange={e => setBuilderName(e.target.value)}
                  placeholder="e.g., High-Value Lead Alert"
                  className="input"
                />
              </div>

              <div className="builder-section">
                <label>🔔 Trigger</label>
                <p className="section-hint">When should this automation run?</p>
                <div className="trigger-grid">
                  {triggers.map(t => (
                    <button
                      key={t.id}
                      className={`trigger-option ${builderTrigger?.id === t.id ? 'selected' : ''}`}
                      onClick={() => setBuilderTrigger(t)}
                    >
                      <span>{t.icon}</span>
                      <span>{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="builder-section">
                <div className="section-header">
                  <label>🔍 Conditions (optional)</label>
                  <button className="btn-add" onClick={addCondition}>+ Add Condition</button>
                </div>
                <p className="section-hint">Only run if these conditions are met</p>
                {builderConditions.map((c, i) => (
                  <div key={i} className="condition-row">
                    <select className="input small" value={c.field} onChange={e => {
                      const updated = [...builderConditions];
                      updated[i].field = e.target.value;
                      setBuilderConditions(updated);
                    }}>
                      {conditions.map(cn => <option key={cn.id} value={cn.id}>{cn.label}</option>)}
                    </select>
                    <select className="input small" value={c.operator} onChange={e => {
                      const updated = [...builderConditions];
                      updated[i].operator = e.target.value;
                      setBuilderConditions(updated);
                    }}>
                      {conditions.find(cn => cn.id === builderConditions[i].field)?.operators.map(op => (
                        <option key={op} value={op}>{op}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      className="input small"
                      placeholder="Value"
                      onChange={e => {
                        const updated = [...builderConditions];
                        updated[i].value = e.target.value;
                        setBuilderConditions(updated);
                      }}
                    />
                    <button className="btn-icon" onClick={() => removeCondition(i)}>✕</button>
                  </div>
                ))}
              </div>

              <div className="builder-section">
                <div className="section-header">
                  <label>⚡ Actions</label>
                  <button className="btn-add" onClick={addAction}>+ Add Action</button>
                </div>
                <p className="section-hint">What should happen when triggered?</p>
                {builderActions.map((a, i) => (
                  <div key={i} className="action-row">
                    <select className="input" value={a.action} onChange={e => {
                      const updated = [...builderActions];
                      updated[i].action = e.target.value;
                      setBuilderActions(updated);
                    }}>
                      {actions.map(act => (
                        <option key={act.id} value={act.id}>{act.icon} {act.label}</option>
                      ))}
                    </select>
                    <button className="btn-icon" onClick={() => removeAction(i)}>✕</button>
                  </div>
                ))}
                {builderActions.length === 0 && (
                  <p className="empty-hint">No actions added yet. Click "+ Add Action" above.</p>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowBuilder(false)}>Cancel</button>
              <button className="btn-primary" onClick={saveAutomation} disabled={!builderName || !builderTrigger}>
                {selectedTemplate ? 'Create from Template' : 'Save Automation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
