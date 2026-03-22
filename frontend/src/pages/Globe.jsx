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

// Revenue region data with coordinates
const REVENUE_REGIONS = [
  { name: 'North America', lat: 40, lng: -100, baseRevenue: 45000, customers: 45 },
  { name: 'Europe', lat: 50, lng: 10, baseRevenue: 38000, customers: 38 },
  { name: 'Asia Pacific', lat: 25, lng: 120, baseRevenue: 28000, customers: 32 },
  { name: 'Latin America', lat: -15, lng: -60, baseRevenue: 12000, customers: 18 },
  { name: 'Middle East', lat: 25, lng: 45, baseRevenue: 8500, customers: 12 },
  { name: 'Africa', lat: 0, lng: 20, baseRevenue: 3500, customers: 8 },
  { name: 'Oceania', lat: -25, lng: 135, baseRevenue: 7500, customers: 10 },
  { name: 'India', lat: 20, lng: 78, baseRevenue: 15000, customers: 22 },
];

// Generate heatmap color based on revenue (dark -> bright gradient)
const getHeatmapColor = (revenue, maxRevenue) => {
  const ratio = Math.min(revenue / maxRevenue, 1);
  // Dark purple/blue for low revenue -> bright gold/white for high revenue
  if (ratio < 0.25) {
    return `rgba(30, 0, 60, ${0.3 + ratio * 0.5})`;
  } else if (ratio < 0.5) {
    return `rgba(80, 20, 120, ${0.5 + ratio * 0.3})`;
  } else if (ratio < 0.75) {
    return `rgba(180, 80, 40, ${0.7 + ratio * 0.2})`;
  } else {
    return `rgba(255, 200, 50, ${0.85 + ratio * 0.15})`;
  }
};

// Generate glow intensity based on revenue
const getGlowIntensity = (revenue, maxRevenue) => {
  return Math.min(0.3 + (revenue / maxRevenue) * 0.7, 1);
};

function GlobePage() {
  const globeRef = useRef();
  const [agents, setAgents] = useState([]);
  const [issues, setIssues] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLayer, setSelectedLayer] = useState('all');
  const [selectedView, setSelectedView] = useState('status'); // status or division
  const [companyId, setCompanyId] = useState(null);
  const [tooltip, setTooltip] = useState(null);
  const globeInstance = useRef(null);
  const [companyHealth, setCompanyHealth] = useState(5);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Generate mock revenue data with real-time updates
  const generateRevenueData = useCallback(() => {
    const now = Date.now();
    return REVENUE_REGIONS.map(region => {
      // Add some variance based on time for real-time effect
      const timeVariance = Math.sin(now / 10000 + region.lng) * 0.1;
      const revenue = region.baseRevenue * (1 + timeVariance + (Math.random() - 0.5) * 0.2);
      return {
        ...region,
        revenue: Math.max(0, revenue),
        customerCount: region.customers + Math.floor(Math.random() * 3 - 1),
        trend: revenue > region.baseRevenue ? 'up' : revenue < region.baseRevenue ? 'down' : 'stable',
      };
    });
  }, []);

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
        setRevenueData(generateRevenueData());
        setLastUpdate(new Date());
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch Paperclip data:', err);
        setError(err.message);
        // Still show revenue data even if Paperclip fails
        setRevenueData(generateRevenueData());
        setLoading(false);
      }
    };

    fetchData();
  }, [generateRevenueData]);

  // Real-time revenue updates
  useEffect(() => {
    if (!autoRefresh || loading) return;

    const interval = setInterval(() => {
      setRevenueData(generateRevenueData());
      setLastUpdate(new Date());
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, [autoRefresh, loading, generateRevenueData]);

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
      if (globeInstance.current) {
        globeInstance.current._renderer.dispose && globeInstance.current._renderer.dispose();
        globeInstance.current = null;
      }
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

    // Revenue Heatmap Layer (brightness = revenue density)
    if (selectedLayer === 'all' || selectedLayer === 'revenue') {
      const maxRevenue = Math.max(...revenueData.map(r => r.revenue), 1);

      // Create heatmap points with brightness based on revenue
      const heatmapPoints = revenueData.map(region => {
        const normalizedRevenue = region.revenue / maxRevenue;
        const brightness = getGlowIntensity(region.revenue, maxRevenue);
        const size = 0.4 + normalizedRevenue * 0.8; // Size based on revenue

        return {
          lat: region.lat,
          lng: region.lng,
          size,
          brightness,
          revenue: region.revenue,
          region: region.name,
          customerCount: region.customerCount,
          trend: region.trend,
          // Generate sub-points for customer clustering
          clusters: Array.from({ length: Math.min(region.customerCount, 5) }, (_, i) => ({
            lat: region.lat + (Math.random() - 0.5) * 10,
            lng: region.lng + (Math.random() - 0.5) * 10,
            size: 0.1 + Math.random() * 0.15,
          })),
        };
      });

      // Main heatmap points (regions)
      world.pointsData(heatmapPoints)
        .pointAltitude(0.03)
        .pointColor(d => getHeatmapColor(d.revenue, maxRevenue))
        .pointRadius('size')
        .pointLabel((d) => `
          <div class="globe-tooltip revenue-tooltip">
            <strong>${d.region}</strong><br/>
            <span class="revenue-value">$${d.revenue.toLocaleString()}</span><br/>
            <span class="customer-count">${d.customerCount} customers</span><br/>
            <span class="trend ${d.trend}">${d.trend === 'up' ? '↑' : d.trend === 'down' ? '↓' : '→'} trend</span>
          </div>
        `);

      // Add glow/rings for high-revenue regions
      const highRevenueRegions = heatmapPoints.filter(d => d.brightness > 0.6);
      world.ringsData(highRevenueRegions)
        .ringColor(() => 'rgba(255, 200, 50, 0.3)')
        .ringAltitude(0.04)
        .ringRadius(d => d.size * 0.5)
        .ringPropagationSpeed(1.5)
        .ringRepeatPeriod(2000);

      // Customer cluster points (smaller dots around main points)
      const clusterPoints = heatmapPoints.flatMap(region =>
        region.clusters.map(cluster => ({
          lat: cluster.lat,
          lng: cluster.lng,
          size: cluster.size,
          parentRegion: region.region,
        }))
      );

      if (clusterPoints.length > 0) {
        world.pointsData(clusterPoints)
          .pointAltitude(0.025)
          .pointColor(() => 'rgba(255, 255, 255, 0.4)')
          .pointRadius('size')
          .pointLabel((d) => `
            <div class="globe-tooltip">
              <strong>Customer Cluster</strong><br/>
              <span>${d.parentRegion}</span>
            </div>
          `);
      }
    }

  }, [agents, issues, selectedLayer, selectedView, loading, revenueData]);

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
        {selectedLayer === 'revenue' && (
          <div className="revenue-controls">
            <label className="auto-refresh-toggle">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
              />
              <span className="toggle-label">Auto-refresh</span>
            </label>
            {lastUpdate && (
              <span className="last-update">
                Updated: {lastUpdate.toLocaleTimeString()}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="globe-stats">
        {selectedLayer === 'revenue' ? (
          <>
            <div className="stat">
              <span className="stat-value">
                ${(revenueData.reduce((sum, r) => sum + r.revenue, 0) / 1000).toFixed(0)}k
              </span>
              <span className="stat-label">Total Revenue</span>
            </div>
            <div className="stat">
              <span className="stat-value">
                {revenueData.reduce((sum, r) => sum + r.customerCount, 0)}
              </span>
              <span className="stat-label">Customers</span>
            </div>
            <div className="stat">
              <span className="stat-value">{revenueData.length}</span>
              <span className="stat-label">Regions</span>
            </div>
            <div className="stat">
              <span className="stat-value">
                {revenueData.filter(r => r.trend === 'up').length}
              </span>
              <span className="stat-label">Growing</span>
            </div>
          </>
        ) : (
          <>
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
          </>
        )}
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
        ) : selectedLayer === 'revenue' ? (
          <div className="legend-items revenue-legend">
            <div className="legend-item">
              <span className="heatmap-gradient"></span>
              <span>Brightness = Revenue</span>
            </div>
            <div className="legend-item">
              <span className="dot" style={{ background: 'rgba(30, 0, 60, 0.8)' }}></span> Low Revenue
            </div>
            <div className="legend-item">
              <span className="dot" style={{ background: 'rgba(80, 20, 120, 0.8)' }}></span> Medium
            </div>
            <div className="legend-item">
              <span className="dot" style={{ background: 'rgba(180, 80, 40, 0.8)' }}></span> High
            </div>
            <div className="legend-item">
              <span className="dot" style={{ background: 'rgba(255, 200, 50, 0.9)' }}></span> Very High
            </div>
            <div className="legend-hint">Glow ring = high revenue region</div>
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