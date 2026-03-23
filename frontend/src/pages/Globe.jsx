/**
 * AI City Globe Visualization
 * Shows agents, tasks, and revenue on a lightweight canvas globe
 * Uses CanvasGlobe instead of globe.gl (11KB vs 500KB)
 */
import { useState, useEffect, useCallback } from 'react';
import CanvasGlobe from '../components/CanvasGlobe';
import { paperclipApi } from '../services/api';
import './Globe.css';

// Company Health DEFCON levels
const DEFCON_LEVELS = {
  1: { label: 'DEFCON 1', color: '#ef4444', description: 'Critical - Immediate action required' },
  2: { label: 'DEFCON 2', color: '#f97316', description: 'High Alert - Serious issues detected' },
  3: { label: 'DEFCON 3', color: '#eab308', description: 'Increased Readiness - Monitor closely' },
  4: { label: 'DEFCON 4', color: '#22c55e', description: 'High Readiness - Normal operations' },
  5: { label: 'DEFCON 5', color: '#3b82f6', description: 'All Clear - Optimal performance' },
};

const calculateCompanyHealth = (agents) => {
  if (!Array.isArray(agents)) return 5;
  const errorCount = agents.filter(a => a.status === 'error').length;
  const pausedCount = agents.filter(a => a.status === 'paused').length;
  const idleCount = agents.filter(a => a.status === 'idle').length;
  const total = agents.length;
  if (errorCount > 0 || pausedCount > total * 0.3) return 2;
  if (idleCount > total * 0.5) return 3;
  if (errorCount === 0 && pausedCount === 0) return 5;
  return 4;
};

// Mock data for demo when Paperclip API is unreachable (CORS / private network)
const MOCK_AGENTS = [
  { id: 'agent-1', name: 'Nova CEO', role: 'ceo', status: 'running' },
  { id: 'agent-2', name: 'AI City CTO', role: 'cto', status: 'running' },
  { id: 'agent-3', name: 'AI City CPO', role: 'cpo', status: 'running' },
  { id: 'agent-4', name: 'AI City CMO', role: 'cmo', status: 'running' },
  { id: 'agent-5', name: 'AI City CFO', role: 'cfo', status: 'running' },
  { id: 'agent-6', name: 'AI City DevOps', role: 'devops', status: 'idle' },
  { id: 'agent-7', name: 'AI City Backend', role: 'backend', status: 'running' },
  { id: 'agent-8', name: 'AI City Frontend', role: 'frontend', status: 'running' },
  { id: 'agent-9', name: 'AI City Marketing', role: 'marketing', status: 'idle' },
  { id: 'agent-10', name: 'AI City Security', role: 'security', status: 'paused' },
  { id: 'agent-11', name: 'AI City Sales', role: 'sales', status: 'running' },
  { id: 'agent-12', name: 'AI City MRR', role: 'operations', status: 'running' },
];

const MOCK_ISSUES = Array.from({ length: 20 }, (_, i) => ({
  id: `issue-${i}`,
  title: `Task ${i + 1}`,
  assigneeAgentId: MOCK_AGENTS[i % MOCK_AGENTS.length].id,
  status: ['todo', 'in_progress', 'done'][i % 3],
}));

function GlobePage() {
  const [agents, setAgents] = useState([]);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLayer, setSelectedLayer] = useState('all');
  const [selectedView, setSelectedView] = useState('status');
  const [companyHealth, setCompanyHealth] = useState(5);
  const [tooltip, setTooltip] = useState(null);
  const [usingMockData, setUsingMockData] = useState(false);

  // Fetch data from Paperclip API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const me = await paperclipApi.getMe();
        const [agentsData, issuesData] = await Promise.all([
          paperclipApi.getAgents(me.companyId),
          paperclipApi.getIssues(me.companyId, { status: 'todo,in_progress,done' })
        ]);
        const safeAgents = Array.isArray(agentsData) ? agentsData : [];
        const safeIssues = Array.isArray(issuesData) ? issuesData : [];
        setAgents(safeAgents);
        setIssues(safeIssues);
        setCompanyHealth(calculateCompanyHealth(safeAgents));
      } catch (err) {
        console.warn('Paperclip API unreachable, using demo data:', err.message);
        setUsingMockData(true);
        setAgents(MOCK_AGENTS);
        setIssues(MOCK_ISSUES);
        setCompanyHealth(calculateCompanyHealth(MOCK_AGENTS));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleTooltip = useCallback((tooltipData) => {
    setTooltip(tooltipData);
  }, []);

  if (loading) {
    return (
      <div className="globe-page loading">
        <div className="loading-spinner"></div>
        <p>Loading AI City data...</p>
      </div>
    );
  }

  return (
    <div className="globe-page">
      <div className="globe-header">
        {usingMockData && (
          <div style={{
            background: 'linear-gradient(90deg, #fef3c7, #fde68a)',
            border: '1px solid #f59e0b',
            borderRadius: '8px',
            padding: '8px 16px',
            marginBottom: '12px',
            fontSize: '13px',
            color: '#92400e',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <span style={{ fontWeight: 600 }}>Demo Mode:</span>
            Hiển thị dữ liệu mẫu — Kết nối Paperclip API để xem dữ liệu thực
          </div>
        )}
        <div className="header-left">
          <h1>AI City Globe</h1>
          <div className="company-health" style={{ '--health-color': DEFCON_LEVELS[companyHealth].color }}>
            <span className="health-level">{DEFCON_LEVELS[companyHealth].label}</span>
            <span className="health-desc">{DEFCON_LEVELS[companyHealth].description}</span>
          </div>
        </div>
        <div className="layer-selector">
          <button className={selectedLayer === 'all' ? 'active' : ''} onClick={() => setSelectedLayer('all')}>All Layers</button>
          <button className={selectedLayer === 'agents' ? 'active' : ''} onClick={() => setSelectedLayer('agents')}>Agents</button>
          <button className={selectedLayer === 'tasks' ? 'active' : ''} onClick={() => setSelectedLayer('tasks')}>Tasks</button>
          <button className={selectedLayer === 'revenue' ? 'active' : ''} onClick={() => setSelectedLayer('revenue')}>Revenue</button>
        </div>
        {selectedLayer === 'agents' && (
          <div className="view-selector">
            <button className={selectedView === 'status' ? 'active' : ''} onClick={() => setSelectedView('status')}>By Status</button>
            <button className={selectedView === 'division' ? 'active' : ''} onClick={() => setSelectedView('division')}>By Division</button>
          </div>
        )}
      </div>

      <div className="globe-stats">
        <div className="stat">
          <span className="stat-value">{agents.length}</span>
          <span className="stat-label">Agents</span>
        </div>
        <div className="stat">
          <span className="stat-value">{issues.length}</span>
          <span className="stat-label">Tasks</span>
        </div>
        <div className="stat">
          <span className="stat-value">{agents.filter(a => a.status === 'running').length}</span>
          <span className="stat-label">Active</span>
        </div>
        <div className="stat">
          <span className="stat-value">{agents.filter(a => a.status === 'error').length}</span>
          <span className="stat-label">Errors</span>
        </div>
      </div>

      <div className="globe-legend">
        <h4>Legend</h4>
        {selectedLayer === 'tasks' ? (
          <div className="legend-items">
            <div className="legend-item"><span className="line-sample" style={{ background: '#3b82f6' }}></span> Data Calls</div>
            <div className="legend-item"><span className="line-sample" style={{ background: '#22c55e' }}></span> Billing Calls</div>
            <div className="legend-item"><span className="line-sample" style={{ background: '#eab308' }}></span> Task Calls</div>
            <div className="legend-hint">Line thickness = call volume</div>
          </div>
        ) : selectedView === 'status' ? (
          <div className="legend-items">
            <div className="legend-item"><span className="dot active"></span> Active (running)</div>
            <div className="legend-item"><span className="dot idle"></span> Idle</div>
            <div className="legend-item"><span className="dot paused"></span> Paused</div>
            <div className="legend-item"><span className="dot error"></span> Error</div>
          </div>
        ) : (
          <div className="legend-items">
            <div className="legend-item"><span className="dot" style={{ background: '#3b82f6' }}></span> Backend</div>
            <div className="legend-item"><span className="dot" style={{ background: '#a855f7' }}></span> Frontend</div>
            <div className="legend-item"><span className="dot" style={{ background: '#22c55e' }}></span> Marketing</div>
            <div className="legend-item"><span className="dot" style={{ background: '#f97316' }}></span> DevOps</div>
            <div className="legend-item"><span className="dot" style={{ background: '#6b7280' }}></span> Other</div>
          </div>
        )}
      </div>

      <div className="globe-container">
        <CanvasGlobe
          agents={agents}
          issues={issues}
          selectedLayer={selectedLayer}
          selectedView={selectedView}
          onTooltip={handleTooltip}
        />
      </div>

      {tooltip && (
        <div className="globe-tooltip" style={{ left: tooltip.x + 12, top: tooltip.y - 8 }}>
          <strong>{tooltip.data.name}</strong>
          <div className="tooltip-row"><span>Role</span><span>{tooltip.data.role || 'Agent'}</span></div>
          <div className="tooltip-row"><span>Status</span><span className={`status-${tooltip.data.status}`}>{tooltip.data.status}</span></div>
          <div className="tooltip-row"><span>Tasks</span><span>{issues.filter(i => i.assigneeAgentId === tooltip.data.id).length}</span></div>
        </div>
      )}
    </div>
  );
}

export default GlobePage;
