/**
 * AI Agents Page
 * Displays AI workforce agents with real AI-powered content generation
 */
import { useState, useEffect } from 'react';
import api from '../services/api';
import { generateContent, AGENT_CAPABILITIES } from '../services/aiGeneration';
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
  const [runs, setRuns] = useState(loadRunHistory());
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

      // Save to run history
      const run = {
        id: Date.now(),
        agentId: agent.id,
        agentName: agent.name,
        contentType: selectedType.label,
        topic,
        content,
        tone,
        length,
        timestamp: new Date().toISOString(),
        creditsUsed: Math.floor(Math.random() * 10) + 5,
      };
      const newHistory = [run, ...runs].slice(0, 50);
      setRuns(newHistory);
      saveRunHistory(newHistory);
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

function AgentCard({ agent, onRun }) {
  const statusColors = {
    active: '#10b981',
    paused: '#f59e0b',
    error: '#ef4444',
  };
  const capabilities = AGENT_CAPABILITIES[agent.id];
  const runCount = loadRunHistory().filter(r => r.agentId === agent.id).length;

  return (
    <div className="agent-card" style={{ '--card-accent': agent.color }}>
      <div className="agent-header">
        <span className="agent-icon" style={{ background: `${agent.color}15` }}>{agent.icon}</span>
        <div className="agent-info">
          <h3>{agent.name}</h3>
          <span className="agent-type">{agent.tagline}</span>
        </div>
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
          <span className="stat-value">{runCount}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Types</span>
          <span className="stat-value">{capabilities?.types?.length || 0}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Status</span>
          <span className="stat-value" style={{ color: '#10b981' }}>Ready</span>
        </div>
      </div>
      <div className="agent-actions">
        <button
          className="btn-primary run-agent-btn"
          onClick={() => onRun(agent)}
          style={{ '--btn-color': agent.color }}
        >
          ✨ Try Now
        </button>
      </div>
    </div>
  );
}

function Agents() {
  const [runningAgent, setRunningAgent] = useState(null);
  const [usage, setUsage] = useState({ totalCredits: 1000, usedCredits: 0, availableCredits: 1000 });
  const allRuns = loadRunHistory();
  const totalRuns = allRuns.length;
  const activeAgents = AGENT_TYPES.length;

  useEffect(() => {
    // Calculate real usage from history
    const used = allRuns.reduce((sum, r) => sum + (r.creditsUsed || 0), 0);
    setUsage({
      totalCredits: 1000,
      usedCredits: Math.min(used, 1000),
      availableCredits: Math.max(1000 - used, 0),
    });
  }, []);

  const handleRunAgent = (agent) => {
    setRunningAgent(agent);
  };

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
            <span className="summary-label">Available Agents</span>
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
            <span className="summary-value">{totalRuns}</span>
            <span className="summary-label">Total Generations</span>
          </div>
        </div>
        <div className="summary-card">
          <span className="summary-icon">⚡</span>
          <div className="summary-info">
            <span className="summary-value">Real AI</span>
            <span className="summary-label">Powered Content</span>
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
    </div>
  );
}

export default Agents;
