/**
 * AI City Globe Visualization
 * Shows agents, tasks, and revenue on a 3D globe
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import Globe from 'globe.gl';
import { paperclipApi } from '../services/api';
import './Globe.css';

// Division colors mapping
const DIVISION_COLORS = {
  backend: '#3b82f6',    // blue
  cto: '#3b82f6',        // blue
  cfo: '#3b82f6',        // blue
  frontend: '#a855f7',   // purple
  cpo: '#a855f7',        // purple
  marketing: '#22c55e',  // green
  cmo: '#22c55e',        // green
  devops: '#f97316',     // orange
  operations: '#f97316', // orange
  sales: '#eab308',      // yellow
  ceo: '#ec4899',        // pink
};

// Get division color from agent role/title
const getDivisionColor = (agent) => {
  const role = (agent.role || agent.title || '').toLowerCase();
  for (const [key, color] of Object.entries(DIVISION_COLORS)) {
    if (role.includes(key)) return color;
  }
  return '#6b7280'; // default gray
};

// Company Health DEFCON levels
const DEFCON_LEVELS = {
  1: { label: 'DEFCON 1', color: '#ef4444', description: 'Critical - Immediate action required' },
  2: { label: 'DEFCON 2', color: '#f97316', description: 'High Alert - Serious issues detected' },
  3: { label: 'DEFCON 3', color: '#eab308', description: 'Increased Readiness - Monitor closely' },
  4: { label: 'DEFCON 4', color: '#22c55e', description: 'High Readiness - Normal operations' },
  5: { label: 'DEFCON 5', color: '#3b82f6', description: 'All Clear - Optimal performance' },
};

// Calculate company health based on agent statuses
const calculateCompanyHealth = (agents) => {
  const errorCount = agents.filter(a => a.status === 'error').length;
  const pausedCount = agents.filter(a => a.status === 'paused').length;
  const idleCount = agents.filter(a => a.status === 'idle').length;
  const total = agents.length;

  if (errorCount > 0 || pausedCount > total * 0.3) return 2;
  if (idleCount > total * 0.5) return 3;
  if (errorCount === 0 && pausedCount === 0) return 5;
  return 4;
};

function GlobePage() {
  const globeRef = useRef();
  const [agents, setAgents] = useState([]);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLayer, setSelectedLayer] = useState('all');
  const [selectedView, setSelectedView] = useState('status'); // status or division
  const [companyId, setCompanyId] = useState(null);
  const [tooltip, setTooltip] = useState(null);
  const globeInstance = useRef(null);
  const [companyHealth, setCompanyHealth] = useState(5);

  // Fetch data from Paperclip API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const me = await paperclipApi.getMe();
        setCompanyId(me.companyId);

        const [agentsData, issuesData] = await Promise.all([
          paperclipApi.getAgents(me.companyId),
          paperclipApi.getIssues(me.companyId, { status: 'todo,in_progress,done' })
        ]);

        setAgents(agentsData || []);
        setIssues(issuesData || []);
        setCompanyHealth(calculateCompanyHealth(agentsData || []));
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch Paperclip data:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Initialize Globe
  useEffect(() => {
    if (!globeRef.current || globeInstance.current) return;

    const world = Globe()(globeRef.current)
      .globeImageUrl('//unpkg.com/three-globe/example/img/earth-dark.jpg')
      .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
      .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
      .width(window.innerWidth - 280)
      .height(window.innerHeight - 100)
      .showAtmosphere(true)
      .atmosphereColor('#3a228a')
      .atmosphereAltitude(0.15);

    world.controls().enableDamping = true;
    world.controls().dampingFactor = 0.05;
    world.controls().rotateSpeed = 0.5;

    globeInstance.current = world;

    // Handle resize
    const handleResize = () => {
      world.width(window.innerWidth - 280).height(window.innerHeight - 100);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Update globe layers based on selected layer and data
  useEffect(() => {
    if (!globeInstance.current || loading) return;

    const world = globeInstance.current;

    // Generate geo coordinates from agent data (distribute around globe)
    const generateAgentCoords = (index, total) => {
      const lat = (Math.random() * 140 - 70);
      const lng = ((index / total) * 360 - 180);
      return { lat, lng };
    };

    // Count tasks per agent (mock task load based on issues)
    const taskLoadMap = {};
    issues.forEach(issue => {
      const assigneeId = issue.assigneeAgentId;
      if (assigneeId) {
        taskLoadMap[assigneeId] = (taskLoadMap[assigneeId] || 0) + 1;
      }
    });

    // Agent Cluster Layer (dots with division colors and task load)
    if (selectedLayer === 'all' || selectedLayer === 'agents') {
      const agentPoints = agents.map((agent, idx) => {
        const coords = generateAgentCoords(idx, agents.length);
        const taskLoad = taskLoadMap[agent.id] || 0;

        // Color by status or division based on view mode
        const color = selectedView === 'division'
          ? getDivisionColor(agent)
          : (agent.status === 'running' ? '#22c55e'
            : agent.status === 'idle' ? '#eab308'
            : agent.status === 'paused' ? '#6b7280'
            : agent.status === 'error' ? '#ef4444'
            : '#6b7280');

        // Size based on task load (min 0.3, max 1.2)
        const size = 0.3 + Math.min(taskLoad * 0.15, 0.9);

        return {
          lat: coords.lat,
          lng: coords.lng,
          size,
          color,
          name: agent.name,
          role: agent.role,
          status: agent.status,
          taskLoad,
          isPulsing: agent.status === 'running' && taskLoad > 0,
        };
      });

      // Clear previous points and add new ones
      world.pointsData(agentPoints)
        .pointAltitude(0.05)
        .pointColor('color')
        .pointRadius('size')
        .pointLabel((d) => `
          <div class="globe-tooltip">
            <strong>${d.name}</strong><br/>
            <span>${d.role || 'Agent'}</span><br/>
            <span class="status-${d.status}">${d.status}</span><br/>
            <span>Tasks: ${d.taskLoad}</span>
          </div>
        `);

      // Add pulsing effect for active agents with tasks
      if (selectedView === 'status') {
        const pulsingAgents = agentPoints.filter(d => d.isPulsing);
        world.ringsData(pulsingAgents)
          .ringColor(() => '#22c55e')
          .ringAltitude(0.06)
          .ringRadius(0.15)
          .ringPropagationSpeed(2)
          .ringRepeatPeriod(1000);
      }
    }

    // Task Flow Layer (arcs between agents showing calls)
    if (selectedLayer === 'all' || selectedLayer === 'tasks') {
      // Generate mock call data with different types
      const callTypes = ['data', 'billing', 'task'];
      const callTypeColors = {
        data: '#3b82f6',    // blue
        billing: '#22c55e', // green
        task: '#eab308',    // yellow
      };

      // Create call flows between agents
      const callFlows = [];
      for (let i = 0; i < 15; i++) {
        const fromIdx = i % agents.length;
        const toIdx = (i + Math.floor(Math.random() * (agents.length - 1)) + 1) % agents.length;
        const fromCoords = generateAgentCoords(fromIdx, Math.max(agents.length, 1));
        const toCoords = generateAgentCoords(toIdx, Math.max(agents.length, 1));
        const callType = callTypes[i % callTypes.length];
        const callVolume = Math.floor(Math.random() * 10) + 1;

        callFlows.push({
          startLat: fromCoords.lat,
          startLng: fromCoords.lng,
          endLat: toCoords.lat,
          endLng: toCoords.lng,
          color: callTypeColors[callType],
          callType,
          callVolume,
          fromAgent: agents[fromIdx]?.name || 'Agent',
          toAgent: agents[toIdx]?.name || 'Agent',
        });
      }

      world.arcsData(callFlows)
        .arcColor('color')
        .arcStroke(d => Math.max(0.3, d.callVolume * 0.15))
        .arcDashLength(0.5)
        .arcDashGap(0.2)
        .arcDashAnimateTime(1500)
        .arcLabel((d) => `
          <div class="globe-tooltip">
            <strong>${d.callType.toUpperCase()} Call</strong><br/>
            <span>${d.fromAgent}</span> → <span>${d.toAgent}</span><br/>
            <span>Volume: ${d.callVolume} calls</span>
          </div>
        `);
    }

    // Revenue Heatmap Layer (weighted points)
    if (selectedLayer === 'all' || selectedLayer === 'revenue') {
      const revenuePoints = agents.map((agent, idx) => {
        const coords = generateAgentCoords(idx, agents.length);
        const revenue = Math.random() * 1000; // Mock revenue data
        return {
          lat: coords.lat,
          lng: coords.lng,
          size: 0.3 + (revenue / 1000) * 0.7,
          color: revenue > 500 ? '#ef4444' : revenue > 200 ? '#f97316' : '#22c55e',
          revenue,
          agent: agent.name,
        };
      });

      world.pointsData(revenuePoints)
        .pointAltitude(0.02)
        .pointColor('color')
        .pointRadius('size')
        .pointLabel((d) => `
          <div class="globe-tooltip">
            <strong>${d.agent}</strong><br/>
            Revenue: $${d.revenue.toFixed(2)}
          </div>
        `);
    }

  }, [agents, issues, selectedLayer, selectedView, loading]);

  if (loading) {
    return (
      <div className="globe-page loading">
        <div className="loading-spinner"></div>
        <p>Loading AI City data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="globe-page error">
        <p>Error: {error}</p>
        <p className="hint">Make sure Paperclip API is running at http://127.0.0.1:3100</p>
      </div>
    );
  }

  return (
    <div className="globe-page">
      <div className="globe-header">
        <div className="header-left">
          <h1>AI City Globe</h1>
          <div className="company-health" style={{ '--health-color': DEFCON_LEVELS[companyHealth].color }}>
            <span className="health-level">{DEFCON_LEVELS[companyHealth].label}</span>
            <span className="health-desc">{DEFCON_LEVELS[companyHealth].description}</span>
          </div>
        </div>
        <div className="layer-selector">
          <button
            className={selectedLayer === 'all' ? 'active' : ''}
            onClick={() => setSelectedLayer('all')}
          >
            All Layers
          </button>
          <button
            className={selectedLayer === 'agents' ? 'active' : ''}
            onClick={() => setSelectedLayer('agents')}
          >
            Agents
          </button>
          <button
            className={selectedLayer === 'tasks' ? 'active' : ''}
            onClick={() => setSelectedLayer('tasks')}
          >
            Tasks
          </button>
          <button
            className={selectedLayer === 'revenue' ? 'active' : ''}
            onClick={() => setSelectedLayer('revenue')}
          >
            Revenue
          </button>
        </div>
        {selectedLayer === 'agents' && (
          <div className="view-selector">
            <button
              className={selectedView === 'status' ? 'active' : ''}
              onClick={() => setSelectedView('status')}
            >
              By Status
            </button>
            <button
              className={selectedView === 'division' ? 'active' : ''}
              onClick={() => setSelectedView('division')}
            >
              By Division
            </button>
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
            <div className="legend-item">
              <span className="line-sample" style={{ background: '#3b82f6' }}></span> Data Calls
            </div>
            <div className="legend-item">
              <span className="line-sample" style={{ background: '#22c55e' }}></span> Billing Calls
            </div>
            <div className="legend-item">
              <span className="line-sample" style={{ background: '#eab308' }}></span> Task Calls
            </div>
            <div className="legend-hint">Line thickness = call volume</div>
          </div>
        ) : selectedView === 'status' ? (
          <div className="legend-items">
            <div className="legend-item">
              <span className="dot active"></span> Active (running)
            </div>
            <div className="legend-item">
              <span className="dot idle"></span> Idle
            </div>
            <div className="legend-item">
              <span className="dot paused"></span> Paused
            </div>
            <div className="legend-item">
              <span className="dot error"></span> Error
            </div>
          </div>
        ) : (
          <div className="legend-items">
            <div className="legend-item">
              <span className="dot" style={{ background: '#3b82f6' }}></span> Backend
            </div>
            <div className="legend-item">
              <span className="dot" style={{ background: '#a855f7' }}></span> Frontend
            </div>
            <div className="legend-item">
              <span className="dot" style={{ background: '#22c55e' }}></span> Marketing
            </div>
            <div className="legend-item">
              <span className="dot" style={{ background: '#f97316' }}></span> DevOps
            </div>
            <div className="legend-item">
              <span className="dot" style={{ background: '#6b7280' }}></span> Other
            </div>
          </div>
        )}
      </div>

      <div ref={globeRef} className="globe-container"></div>
    </div>
  );
}

export default GlobePage;