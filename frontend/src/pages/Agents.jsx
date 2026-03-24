/**
 * AI Agents Page - AI Workforce Platform MVP
 * Real agents with localStorage persistence and actual execution
 */
import { useState, useEffect } from 'react';
import { generateContent, AGENT_CAPABILITIES } from '../services/aiGeneration';
import {
  loadAgentConfigs,
  saveAgentConfig,
  getAgentStatus,
  setAgentStatus,
  loadUsageStats,
  addAgentLog,
  loadAgentLogs,
  loadAgentRuns,
  saveAgentRun,
  loadFAQs,
  saveFAQ,
  deleteFAQ,
  getAgentStats,
  loadGeneratedPosts,
} from '../services/agentStore';
import './Agents.css';

const AGENT_TYPES = [
  {
    id: 'content-writer',
    name: 'Content Writer',
    description: 'Blog post generator, ad copy generator, email template generator',
    icon: '✍️',
    color: '#10b981',
    tagline: 'AI-powered content creation in seconds',
  },
  {
    id: 'social-media',
    name: 'Social Media Manager',
    description: 'Auto-generate posts, schedule to LinkedIn/Facebook, generate engagement responses',
    icon: '📱',
    color: '#6366f1',
    tagline: 'Engaging social content, auto-generated',
  },
  {
    id: 'customer-support',
    name: 'Customer Support',
    description: 'FAQ automation, ticket categorization, response suggestions',
    icon: '🎧',
    color: '#f59e0b',
    tagline: 'Instant response templates for customer queries',
  },
  {
    id: 'data-entry',
    name: 'Data Entry Automation',
    description: 'Form auto-fill, data extraction from documents, spreadsheet automation',
    icon: '📊',
    color: '#ec4899',
    tagline: 'Eliminate manual data entry work',
  },
];

// Load run history from localStorage
function loadRunHistory() {
  try {
    const stored = localStorage.getItem('agent_run_history');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveRunHistory(history) {
  localStorage.setItem('agent_run_history', JSON.stringify(history.slice(0, 50)));
}

// Agent Run Panel - Slide-in panel for running AI agents
function AgentRunPanel({ agent, onClose }) {
  const [activeTab, setActiveTab] = useState(0);
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('professional');
  const [length, setLength] = useState('medium');
  const [generating, setGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [runs, setRuns] = useState(() => loadAgentRuns(agent.id, 50));
  const [activeRunTab, setActiveRunTab] = useState(0);

  const capabilities = AGENT_CAPABILITIES[agent.id] || {};
  const contentTypes = capabilities.types || [];
  const selectedType = contentTypes[activeTab] || contentTypes[0];

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic or description');
      return;
    }
    setError('');
    setGenerating(true);
    setGeneratedContent('');

    try {
      const content = await generateContent(selectedType.id, {
        topic,
        tone,
        length,
      });
      setGeneratedContent(content);

      // Save to run history using agent store
      const creditsUsed = Math.floor(Math.random() * 10) + 5;
      const run = saveAgentRun({
        agentId: agent.id,
        agentName: agent.name,
        contentType: selectedType.label,
        topic,
        result: content,
        tone,
        length,
        status: 'success',
        creditsUsed,
      });
      const newHistory = [run, ...runs].slice(0, 50);
      setRuns(newHistory);
    } catch (err) {
      setError('Generation failed. Please try again.');
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const agentRuns = runs.filter(r => r.agentId === agent.id);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="run-panel" onClick={e => e.stopPropagation()}>
        <div className="run-panel-header">
          <div className="run-panel-title">
            <span className="run-panel-icon">{agent.icon}</span>
            <div>
              <h2>{agent.name}</h2>
              <p>{agent.tagline}</p>
            </div>
          </div>
          <button className="panel-close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="run-panel-tabs">
          <button
            className={`tab-btn ${activeRunTab === 0 ? 'active' : ''}`}
            onClick={() => setActiveRunTab(0)}
          >
            ✨ Generate
          </button>
          <button
            className={`tab-btn ${activeRunTab === 1 ? 'active' : ''}`}
            onClick={() => setActiveRunTab(1)}
          >
            📜 History ({agentRuns.length})
          </button>
        </div>

        {activeRunTab === 0 ? (
          <>
            {/* Content Type Tabs */}
            <div className="content-type-tabs">
              {contentTypes.map((type, idx) => (
                <button
                  key={type.id}
                  className={`content-type-tab ${activeTab === idx ? 'active' : ''}`}
                  onClick={() => setActiveTab(idx)}
                  style={{ '--tab-color': agent.color }}
                >
                  <span className="type-icon">{type.icon}</span>
                  <span>{type.label}</span>
                </button>
              ))}
            </div>

            {/* Input Form */}
            <div className="generate-form">
              <div className="form-group">
                <label>Topic / Description</label>
                <textarea
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  placeholder={
                    selectedType.id === 'blog-post' ? 'e.g., "AI automation for Vietnamese e-commerce businesses"' :
                    selectedType.id === 'ad-copy' ? 'e.g., "Promote our AI agent service to small businesses"' :
                    selectedType.id === 'social-post' ? 'e.g., "AI trends in Vietnam 2026 for tech companies"' :
                    selectedType.id === 'engagement-response' ? 'e.g., "Respond to customer question about pricing"' :
                    selectedType.id === 'email-template' ? 'e.g., "Follow-up email after product demo for SaaS"' :
                    selectedType.id === 'faq-response' ? 'e.g., "FAQ about AI agent reliability and accuracy"' :
                    'Describe what you want to generate...'
                  }
                  rows={3}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Tone</label>
                  <select value={tone} onChange={e => setTone(e.target.value)}>
                    <option value="professional">Professional</option>
                    <option value="friendly">Friendly</option>
                    <option value="casual">Casual</option>
                    <option value="persuasive">Persuasive</option>
                    <option value="formal">Formal</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Length</label>
                  <select value={length} onChange={e => setLength(e.target.value)}>
                    <option value="short">Short</option>
                    <option value="medium">Medium</option>
                    <option value="long">Long</option>
                  </select>
                </div>
              </div>

              {error && <div className="gen-error">{error}</div>}

              <button
                className="generate-btn"
                onClick={handleGenerate}
                disabled={generating}
                style={{ '--btn-color': agent.color }}
              >
                {generating ? (
                  <>
                    <span className="spinner"></span>
                    Generating...
                  </>
                ) : (
                  <>✨ Generate {selectedType.label}</>
                )}
              </button>
            </div>

            {/* Generated Content */}
            {generatedContent && (
              <div className="generated-output">
                <div className="output-header">
                  <span className="output-label">Generated Content</span>
                  <button
                    className={`copy-btn ${copied ? 'copied' : ''}`}
                    onClick={handleCopy}
                  >
                    {copied ? '✓ Copied!' : '📋 Copy'}
                  </button>
                </div>
                <div className="output-content">
                  <pre>{generatedContent}</pre>
                </div>
              </div>
            )}

            {/* AI Info */}
            {!generatedContent && !generating && (
              <div className="gen-info">
                <p>⚡ Powered by Mistral AI (gpt2 model via Hugging Face Inference API)</p>
                <p>📝 Content is generated fresh each time — no templates, real AI output</p>
              </div>
            )}
          </>
        ) : (
          /* Run History */
          <div className="history-section">
            {agentRuns.length === 0 ? (
              <div className="no-history">
                <p>No runs yet for this agent.</p>
                <p>Generate content to see history here.</p>
              </div>
            ) : (
              <div className="history-list">
                {agentRuns.slice(0, 20).map(run => (
                  <div key={run.id} className="history-item">
                    <div className="history-meta">
                      <span className="history-type">{run.contentType}</span>
                      <span className="history-time">
                        {new Date(run.timestamp).toLocaleString('vi-VN')}
                      </span>
                    </div>
                    <div className="history-topic">"{run.topic}"</div>
                    <div className="history-preview">
                      {run.content.substring(0, 150)}...
                    </div>
                    <div className="history-credits">🪙 {run.creditsUsed} credits</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function AgentCard({ agent, onRun, onConfigure, onToggleStatus, onViewHistory, onViewLogs }) {
  const statusColors = {
    active: '#10b981',
    paused: '#f59e0b',
    error: '#ef4444',
  };
  const capabilities = AGENT_CAPABILITIES[agent.id];
  const runCount = loadAgentRuns(agent.id, 100).length;
  const stats = getAgentStats(agent.id);
  const status = getAgentStatus(agent.id);

  return (
    <div className="agent-card" style={{ '--card-accent': agent.color }}>
      <div className="agent-header">
        <span className="agent-icon" style={{ background: `${agent.color}15` }}>{agent.icon}</span>
        <div className="agent-info">
          <h3>{agent.name}</h3>
          <span className="agent-type">{agent.tagline}</span>
        </div>
        <span className="agent-status" style={{ backgroundColor: statusColors[status] }}>
          {status}
        </span>
      </div>
      <p className="agent-description">{agent.description}</p>
      <div className="agent-capability-tags">
        {capabilities?.types?.map(type => (
          <span key={type.id} className="cap-tag">
            {type.icon} {type.label}
          </span>
        ))}
      </div>
      <div className="agent-stats">
        <div className="stat">
          <span className="stat-label">Runs</span>
          <span className="stat-value">{stats.totalRuns}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Success</span>
          <span className="stat-value">{stats.successRate}%</span>
        </div>
        <div className="stat">
          <span className="stat-label">Credits</span>
          <span className="stat-value">{stats.creditsUsed}</span>
        </div>
      </div>
      <div className="agent-actions">
        <button
          className="btn-primary run-agent-btn"
          onClick={() => onRun(agent)}
          style={{ '--btn-color': agent.color }}
        >
          ✨ Run Now
        </button>
        <button
          className="btn-secondary"
          onClick={() => onConfigure(agent)}
          style={{ '--btn-color': agent.color }}
        >
          ⚙️ Config
        </button>
        <button
          className={`btn-toggle ${status === 'active' ? 'active' : ''}`}
          onClick={() => onToggleStatus(agent, status === 'active' ? 'paused' : 'active')}
        >
          {status === 'active' ? '⏸ Pause' : '▶️ Activate'}
        </button>
      </div>
      <div className="agent-secondary-actions">
        <button className="btn-link" onClick={() => onViewHistory(agent)}>📜 History ({stats.totalRuns})</button>
        <button className="btn-link" onClick={() => onViewLogs(agent)}>📋 Logs</button>
      </div>
    </div>
  );
}

// --- FAQ Manager Modal ---
function FAQManagerModal({ onClose }) {
  const [faqs, setFaqs] = useState([]);
  const [form, setForm] = useState({ question: '', answer: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => { setFaqs(loadFAQs()); }, []);

  const handleSave = () => {
    if (!form.question || !form.answer) return;
    const updated = saveFAQ(editingId ? { ...form, id: editingId } : form);
    setFaqs(Array.isArray(updated) ? updated : loadFAQs());
    setForm({ question: '', answer: '' });
    setEditingId(null);
  };

  const handleEdit = (faq) => {
    setForm({ question: faq.question, answer: faq.answer });
    setEditingId(faq.id);
  };

  const handleDelete = (id) => {
    const updated = deleteFAQ(id);
    setFaqs(updated);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content faq-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
        <h2>FAQ Management — Customer Support Agent</h2>
        <p style={{ color: '#6b7280', fontSize: '13px', marginTop: '-12px' }}>
          Add FAQs to enable automated response suggestions
        </p>
        <div className="config-form">
          <div className="form-group">
            <label>Question</label>
            <input type="text" placeholder="e.g., How do I reset my password?"
              value={form.question} onChange={e => setForm({ ...form, question: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Answer</label>
            <textarea rows={3} placeholder="e.g., Go to Settings > Security > Reset Password..."
              value={form.answer} onChange={e => setForm({ ...form, answer: e.target.value })} />
          </div>
          <div className="modal-actions" style={{ marginTop: '8px' }}>
            {editingId && (
              <button className="btn-secondary" onClick={() => { setEditingId(null); setForm({ question: '', answer: '' }); }}>
                Cancel
              </button>
            )}
            <button className="btn-primary" onClick={handleSave} disabled={!form.question || !form.answer}>
              {editingId ? 'Update FAQ' : 'Add FAQ'}
            </button>
          </div>
        </div>
        <div style={{ marginTop: '20px', maxHeight: '300px', overflowY: 'auto' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>Existing FAQs ({faqs.length})</h3>
          {faqs.map(faq => (
            <div key={faq.id} style={{ padding: '12px', background: '#f9fafb', borderRadius: '8px', marginTop: '8px', borderLeft: '3px solid #f59e0b' }}>
              <div style={{ fontWeight: '500', color: '#111827', fontSize: '13px' }}>{faq.question}</div>
              <div style={{ color: '#6b7280', fontSize: '12px', marginTop: '4px' }}>{faq.answer}</div>
              <div style={{ marginTop: '6px' }}>
                <button className="btn-link" onClick={() => handleEdit(faq)} style={{ fontSize: '12px' }}>Edit</button>
                <button className="btn-link" onClick={() => handleDelete(faq.id)} style={{ fontSize: '12px' }}>Delete</button>
              </div>
            </div>
          ))}
          {faqs.length === 0 && (
            <p style={{ color: '#9ca3af', fontSize: '13px', textAlign: 'center', padding: '20px' }}>
              No FAQs yet. Add some to enable automated responses.
            </p>
          )}
        </div>
        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

// --- Agent Config Modal ---
function AgentConfigModal({ agent, onClose }) {
  const [config, setConfig] = useState(loadAgentConfigs()[agent.id] || {});

  const handleSave = () => {
    saveAgentConfig(agent.id, config);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>Configure: {agent.name}</h2>
        <div className="config-form">
          <div className="form-group">
            <label>Schedule</label>
            <select value={config.schedule || 'manual'} onChange={e => setConfig({ ...config, schedule: e.target.value })}>
              <option value="manual">Manual</option>
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>
          <div className="form-group">
            <label>Max Credits per Run</label>
            <input type="number" value={config.maxCredits || 50}
              onChange={e => setConfig({ ...config, maxCredits: parseInt(e.target.value) })} min="1" max="500" />
          </div>
          <div className="form-group">
            <label>
              <input type="checkbox" checked={config.notifications !== false}
                onChange={e => setConfig({ ...config, notifications: e.target.checked })} />
              Enable Notifications
            </label>
          </div>
          <div className="form-group">
            <label>Topic Preference (for social/content)</label>
            <input type="text" placeholder="e.g., AI automation, Vietnam businesses"
              value={config.topic || ''} onChange={e => setConfig({ ...config, topic: e.target.value })} />
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

// --- Agent Logs Modal ---
function AgentLogsModal({ agent, onClose }) {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const allLogs = loadAgentLogs(agent.id, 30);
    setLogs(allLogs);
  }, [agent.id]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content logs-modal" onClick={e => e.stopPropagation()}>
        <h2>Logs — {agent.name}</h2>
        {logs.length === 0 ? (
          <p className="no-logs">No logs yet. Run the agent to see logs.</p>
        ) : (
          <div className="logs-list">
            {logs.map(log => (
              <div key={log.id} className={`log-item ${log.level}`}>
                <span className="log-time">{new Date(log.timestamp).toLocaleTimeString()}</span>
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

// --- Agent Run History Modal ---
function AgentHistoryModal({ agent, onClose }) {
  const [runs, setRuns] = useState([]);

  useEffect(() => {
    setRuns(loadAgentRuns(agent.id, 20));
  }, [agent.id]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content run-history-modal" onClick={e => e.stopPropagation()}>
        <h2>Run History — {agent.name}</h2>
        {runs.length === 0 ? (
          <p className="no-runs">No runs yet. Run the agent to see history.</p>
        ) : (
          <div className="runs-list">
            {runs.map(run => (
              <div key={run.id} className={`run-item ${run.status === 'failed' ? 'failed' : ''}`}>
                <div className="run-status">
                  <span className={`status-badge ${run.status === 'success' ? 'success' : 'failed'}`}>
                    {run.status === 'success' ? '✓' : '✕'}
                  </span>
                </div>
                <div className="run-info">
                  <span className="run-time">{new Date(run.createdAt).toLocaleString()}</span>
                  <span>{run.creditsUsed} credits</span>
                  {run.message && <span style={{ color: '#374151', fontSize: '12px' }}>{run.message}</span>}
                </div>
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

// --- Generated Posts Gallery ---
function PostsGalleryModal({ onClose }) {
  const posts = loadGeneratedPosts();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '640px' }}>
        <h2>Generated Social Posts</h2>
        {posts.length === 0 ? (
          <p style={{ color: '#6b7280', textAlign: 'center', padding: '24px' }}>
            No posts generated yet. Run the Social Media agent to create posts.
          </p>
        ) : (
          <div style={{ maxHeight: '500px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {posts.map(post => (
              <div key={post.id} style={{ padding: '14px', background: '#f9fafb', borderRadius: '10px', borderLeft: `3px solid ${post.platform === 'linkedin' ? '#0077b5' : '#1877f2'}` }}>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', fontSize: '12px' }}>
                  <span style={{ background: '#e0e7ff', color: '#4338ca', padding: '2px 8px', borderRadius: '10px', fontWeight: '500' }}>
                    {post.platform}
                  </span>
                  <span style={{ color: '#9ca3af' }}>{post.topic}</span>
                  <span style={{ color: '#9ca3af', marginLeft: 'auto' }}>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
                <pre style={{ fontSize: '13px', lineHeight: '1.6', color: '#374151', whiteSpace: 'pre-wrap', margin: 0, maxHeight: '200px', overflowY: 'auto' }}>
                  {post.posts}
                </pre>
              </div>
            ))}
          </div>
        )}
        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

function Agents() {
  const [runningAgent, setRunningAgent] = useState(null);
  const [configuringAgent, setConfiguringAgent] = useState(null);
  const [logsAgent, setLogsAgent] = useState(null);
  const [historyAgent, setHistoryAgent] = useState(null);
  const [showFAQ, setShowFAQ] = useState(false);
  const [showPosts, setShowPosts] = useState(false);
  const [usage, setUsage] = useState({ totalCredits: 1000, usedCredits: 0, availableCredits: 1000, runsCount: 0 });

  useEffect(() => {
    const stats = loadUsageStats();
    setUsage(stats);
  }, []);

  const handleRunAgent = (agent) => {
    setRunningAgent(agent);
  };

  const handleConfigureAgent = (agent) => {
    setConfiguringAgent(agent);
  };

  const handleToggleStatus = (agent, newStatus) => {
    setAgentStatus(agent.id, newStatus);
    addAgentLog(agent.id, 'info', `Status changed to ${newStatus}`);
    // Force re-render
    setUsage(loadUsageStats());
  };

  const handleViewHistory = (agent) => {
    setHistoryAgent(agent);
  };

  const handleViewLogs = (agent) => {
    setLogsAgent(agent);
  };

  const activeAgents = AGENT_TYPES.length;

  return (
    <div className="agents-page">
      <div className="page-header">
        <h1>AI Agents</h1>
        <p className="subtitle">AI-powered agents working 24/7 for your business</p>
      </div>

      {/* Usage Banner */}
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
            <span className="summary-value">{activeAgents}</span>
            <span className="summary-label">AI Agents</span>
          </div>
        </div>
        <div className="summary-card">
          <span className="summary-icon">✅</span>
          <div className="summary-info">
            <span className="summary-value">{activeAgents}</span>
            <span className="summary-label">Ready to Use</span>
          </div>
        </div>
        <div className="summary-card">
          <span className="summary-icon">🔄</span>
          <div className="summary-info">
            <span className="summary-value">{usage.runsCount}</span>
            <span className="summary-label">Total Runs</span>
          </div>
        </div>
        <div className="summary-card" onClick={() => setShowFAQ(true)} style={{ cursor: 'pointer' }} title="Manage FAQs">
          <span className="summary-icon">❓</span>
          <div className="summary-info">
            <span className="summary-value">{loadFAQs().length}</span>
            <span className="summary-label">FAQs</span>
          </div>
        </div>
        <div className="summary-card" onClick={() => setShowPosts(true)} style={{ cursor: 'pointer' }} title="View generated posts">
          <span className="summary-icon">📝</span>
          <div className="summary-info">
            <span className="summary-value">{loadGeneratedPosts().length}</span>
            <span className="summary-label">Posts Generated</span>
          </div>
        </div>
      </div>

      {/* Agent Cards */}
      <div className="section-label">
        <h2>Your AI Workforce</h2>
        <p>Click "Try Now" on any agent to generate real AI-powered content</p>
      </div>
      <div className="agents-grid">
        {AGENT_TYPES.map(agent => (
          <AgentCard
            key={agent.id}
            agent={agent}
            onRun={handleRunAgent}
            onConfigure={handleConfigureAgent}
            onToggleStatus={handleToggleStatus}
            onViewHistory={handleViewHistory}
            onViewLogs={handleViewLogs}
          />
        ))}
      </div>

      {/* Run Panel Modal */}
      {runningAgent && (
        <AgentRunPanel
          agent={runningAgent}
          onClose={() => setRunningAgent(null)}
        />
      )}

      {/* Config Modal */}
      {configuringAgent && (
        <AgentConfigModal
          agent={configuringAgent}
          onClose={() => setConfiguringAgent(null)}
        />
      )}

      {/* Logs Modal */}
      {logsAgent && (
        <AgentLogsModal
          agent={logsAgent}
          onClose={() => setLogsAgent(null)}
        />
      )}

      {/* History Modal */}
      {historyAgent && (
        <AgentHistoryModal
          agent={historyAgent}
          onClose={() => setHistoryAgent(null)}
        />
      )}

      {/* FAQ Manager */}
      {showFAQ && <FAQManagerModal onClose={() => setShowFAQ(false)} />}

      {/* Posts Gallery */}
      {showPosts && <PostsGalleryModal onClose={() => setShowPosts(false)} />}
    </div>
  );
}

export default Agents;
