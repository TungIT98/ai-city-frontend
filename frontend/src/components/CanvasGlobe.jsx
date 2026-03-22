/**
 * AI City - Lightweight Canvas Globe
 * Replaces globe.gl (~507KB) with Canvas 2D + world-atlas GeoJSON (~30KB)
 * Phase 8: AIC-800 - Globe Chunk Optimization
 */
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { paperclipApi } from '../services/api';
import './CanvasGlobe.css';

const DEFCON_LEVELS = {
  1: { label: 'DEFCON 1', color: '#ef4444', description: 'Critical' },
  2: { label: 'DEFCON 2', color: '#f97316', description: 'High Alert' },
  3: { label: 'DEFCON 3', color: '#eab308', description: 'Increased Readiness' },
  4: { label: 'DEFCON 4', color: '#22c55e', description: 'High Readiness' },
  5: { label: 'DEFCON 5', color: '#3b82f6', description: 'All Clear' },
};

const DIVISION_COLORS = {
  backend: '#3b82f6', cto: '#3b82f6', cfo: '#3b82f6',
  frontend: '#a855f7', cpo: '#a855f7',
  marketing: '#22c55e', cmo: '#22c55e',
  devops: '#f97316', operations: '#f97316',
  sales: '#eab308', ceo: '#ec4899',
};

const STATUS_COLORS = {
  running: '#22c55e', idle: '#eab308', paused: '#6b7280', error: '#ef4444',
};

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

// Convert lat/lng to 2D canvas coordinates
const projectPoint = (lat, lng, rotation, width, height) => {
  const lambda = ((lng + rotation) * Math.PI) / 180;
  const phi = (lat * Math.PI) / 180;
  const x = width / 2 + (width / 2) * lambda;
  const y = height / 2 - (height / 2) * phi;
  const radius = Math.min(width, height) * 0.45;
  const cx = width / 2, cy = height / 2;
  const dx = x - cx, dy = y - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);
  if (dist > radius) return null;
  const scale = Math.sqrt(1 - (dist / radius) ** 2);
  return { x: cx + dx, y: cy + dy - radius * scale * 0.3, visible: true, dist };
};

function CanvasGlobe({ selectedLayer, selectedView, onCompanyHealthChange, provinces = [], onProvinceClick }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const animationRef = useRef(null);
  const [geoData, setGeoData] = useState(null);
  const [agents, setAgents] = useState([]);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tooltip, setTooltip] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMouse, setLastMouse] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ w: 800, h: 600 });
  const [pulsePhase, setPulsePhase] = useState(0);
  const [revenueData, setRevenueData] = useState([]);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [companyHealth, setCompanyHealth] = useState(5);

  const generateRevenueData = useCallback(() => {
    const now = Date.now();
    return REVENUE_REGIONS.map(region => {
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

  // Load GeoJSON data
  useEffect(() => {
    Promise.all([
      import('world-atlas/countries-110m.json'),
      import('topojson-client'),
    ]).then(([worldData, topoClient]) => {
      try {
        const { feature } = topoClient;
        const countries = feature(worldData.default, worldData.default.objects.countries);
        setGeoData(countries.features);
      } catch {
        setGeoData([]);
      }
    }).catch(() => {
      setGeoData([]);
    });
  }, []);

  // Fetch agent data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const me = await paperclipApi.getMe();
        // If API unavailable or me is invalid, use demo data
        if (!me || !me.companyId) {
          setAgents([]);
          setIssues([]);
          setCompanyHealth(5);
          if (onCompanyHealthChange) onCompanyHealthChange(5);
          setRevenueData(generateRevenueData());
          setLastUpdate(new Date());
          setLoading(false);
          return;
        }
        const [agentsData, issuesData] = await Promise.all([
          paperclipApi.getAgents(me.companyId),
          paperclipApi.getIssues(me.companyId, { status: 'todo,in_progress,done' })
        ]);
        // Normalize to array - handle {data: null, isDemo: true} from failed API calls
        const normalizedAgents = Array.isArray(agentsData) ? agentsData : [];
        const normalizedIssues = Array.isArray(issuesData) ? issuesData : [];
        setAgents(normalizedAgents);
        setIssues(normalizedIssues);

        const errCount = normalizedAgents.filter(a => a.status === 'error').length;
        const pausedCount = normalizedAgents.filter(a => a.status === 'paused').length;
        const idleCount = normalizedAgents.filter(a => a.status === 'idle').length;
        const total = normalizedAgents.length;
        const health = errCount > 0 || pausedCount > total * 0.3 ? 2 : idleCount > total * 0.5 ? 3 : errCount === 0 && pausedCount === 0 ? 5 : 4;
        setCompanyHealth(health);
        if (onCompanyHealthChange) onCompanyHealthChange(health);

        setRevenueData(generateRevenueData());
        setLastUpdate(new Date());
        setLoading(false);
      } catch (err) {
        console.error('Globe data fetch error:', err);
        setError(err.message);
        setRevenueData(generateRevenueData());
        setLoading(false);
      }
    };
    fetchData();
  }, [generateRevenueData, onCompanyHealthChange]);

  // Real-time revenue updates
  useEffect(() => {
    if (!autoRefresh || loading) return;
    const interval = setInterval(() => {
      setRevenueData(generateRevenueData());
      setLastUpdate(new Date());
    }, 10000);
    return () => clearInterval(interval);
  }, [autoRefresh, loading, generateRevenueData]);

  // Pulse animation
  useEffect(() => {
    let start = Date.now();
    const animate = () => {
      setPulsePhase((Date.now() - start) / 1000);
      animationRef.current = requestAnimationFrame(animate);
    };
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, []);

  // Resize handler
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setSize({ w: rect.width, h: rect.height });
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mouse interactions
  const handleMouseDown = useCallback((e) => {
    setIsDragging(true);
    setLastMouse({ x: e.clientX, y: e.clientY });
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (isDragging) {
      const dx = e.clientX - lastMouse.x;
      setRotation(prev => prev + dx * 0.3);
      setLastMouse({ x: e.clientX, y: e.clientY });
    }

    // Tooltip detection
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const cx = size.w / 2, cy = size.h / 2;

    if (selectedLayer === 'province' && provinces.length > 0) {
      const maxRevenue = Math.max(...provinces.map(p => p.metrics?.revenue || 0), 1);
      for (const province of provinces) {
        const projected = projectPoint(province.lat, province.lng, rotation, size.w, size.h);
        if (!projected) continue;
        const scaledX = cx + (projected.x - cx) * zoom;
        const scaledY = cy + (projected.y - cy) * zoom;
        const ratio = (province.metrics?.revenue || 0) / maxRevenue;
        const size = (0.3 + ratio * 0.7) * 18 * zoom;
        const dist = Math.sqrt((mx - scaledX) ** 2 + (my - scaledY) ** 2);
        if (dist < Math.max(size, 12)) {
          setTooltip({ x: e.clientX, y: e.clientY, data: province, type: 'province' });
          return;
        }
      }
    } else if (selectedLayer === 'revenue') {
      for (const region of revenueData) {
        const projected = projectPoint(region.lat, region.lng, rotation, size.w, size.h);
        if (!projected) continue;
        const scaledX = cx + (projected.x - cx) * zoom;
        const scaledY = cy + (projected.y - cy) * zoom;
        const dist = Math.sqrt((mx - scaledX) ** 2 + (my - scaledY) ** 2);
        if (dist < 15) {
          setTooltip({ x: e.clientX, y: e.clientY, data: region, type: 'revenue' });
          return;
        }
      }
    } else {
      const taskLoadMap = {};
      issues.forEach(issue => {
        const id = issue.assigneeAgentId;
        if (id) taskLoadMap[id] = (taskLoadMap[id] || 0) + 1;
      });

      for (let i = 0; i < agents.length; i++) {
        const agent = agents[i];
        const lat = (Math.random() * 140 - 70);
        const lng = ((i / Math.max(agents.length, 1)) * 360 - 180);
        const projected = projectPoint(lat, lng, rotation, size.w, size.h);
        if (!projected) continue;
        const scaledX = cx + (projected.x - cx) * zoom;
        const scaledY = cy + (projected.y - cy) * zoom;
        const agentSize = (0.3 + Math.min((taskLoadMap[agent.id] || 0) * 0.15, 0.9)) * 8 * zoom;
        const dist = Math.sqrt((mx - scaledX) ** 2 + (my - scaledY) ** 2);
        if (dist < Math.max(agentSize, 8)) {
          setTooltip({ x: e.clientX, y: e.clientY, data: { ...agent, taskLoad: taskLoadMap[agent.id] || 0 }, type: 'agent' });
          return;
        }
      }
    }
    setTooltip(null);
  }, [isDragging, lastMouse, rotation, zoom, size, agents, issues, revenueData, selectedLayer, provinces]);

  const handleMouseUp = useCallback(() => setIsDragging(false), []);

  const handleClick = useCallback((e) => {
    if (selectedLayer !== 'province' || provinces.length === 0 || !onProvinceClick) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const cx = size.w / 2, cy = size.h / 2;
    const maxRevenue = Math.max(...provinces.map(p => p.metrics?.revenue || 0), 1);
    for (const province of provinces) {
      const projected = projectPoint(province.lat, province.lng, rotation, size.w, size.h);
      if (!projected) continue;
      const scaledX = cx + (projected.x - cx) * zoom;
      const scaledY = cy + (projected.y - cy) * zoom;
      const ratio = (province.metrics?.revenue || 0) / maxRevenue;
      const pSize = (0.3 + ratio * 0.7) * 18 * zoom;
      const dist = Math.sqrt((mx - scaledX) ** 2 + (my - scaledY) ** 2);
      if (dist < Math.max(pSize, 12)) {
        onProvinceClick(province);
        return;
      }
    }
  }, [selectedLayer, provinces, rotation, zoom, size, onProvinceClick]);
  const handleWheel = useCallback((e) => {
    e.preventDefault();
    setZoom(prev => Math.max(0.5, Math.min(3, prev - e.deltaY * 0.001)));
  }, []);

  // Canvas rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !geoData) return;
    const ctx = canvas.getContext('2d');
    const { w, h } = size;
    canvas.width = w;
    canvas.height = h;
    const cx = w / 2, cy = h / 2;
    const radius = Math.min(w, h) * 0.45 * zoom;

    ctx.clearRect(0, 0, w, h);

    // Background gradient
    const bgGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 1.5);
    bgGrad.addColorStop(0, '#0a0a1a');
    bgGrad.addColorStop(1, '#000008');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Stars
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    for (let i = 0; i < 80; i++) {
      const sx = ((i * 137.508) % 1) * w;
      const sy = ((i * 97.381) % 1) * h;
      const ss = ((i * 3.141) % 1) * 1.5 + 0.5;
      ctx.beginPath();
      ctx.arc(sx, sy, ss, 0, Math.PI * 2);
      ctx.fill();
    }

    // Atmosphere glow
    const atmGrad = ctx.createRadialGradient(cx, cy, radius * 0.9, cx, cy, radius * 1.15);
    atmGrad.addColorStop(0, 'rgba(58, 34, 138, 0)');
    atmGrad.addColorStop(0.5, 'rgba(58, 34, 138, 0.15)');
    atmGrad.addColorStop(1, 'rgba(58, 34, 138, 0)');

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.15, 0, Math.PI * 2);
    ctx.fillStyle = atmGrad;
    ctx.fill();

    // Globe circle (earth)
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    const earthGrad = ctx.createRadialGradient(cx - radius * 0.3, cy - radius * 0.3, 0, cx, cy, radius);
    earthGrad.addColorStop(0, '#1a1a2e');
    earthGrad.addColorStop(0.5, '#0f0f1a');
    earthGrad.addColorStop(1, '#050508');
    ctx.fillStyle = earthGrad;
    ctx.fill();

    // Country borders
    if (geoData.length > 0) {
      ctx.strokeStyle = 'rgba(255,255,255,0.08)';
      ctx.lineWidth = 0.5;
      geoData.forEach(country => {
        if (!country.geometry) return;
        const ring = country.geometry.type === 'Polygon'
          ? country.geometry.coordinates[0]
          : country.geometry.coordinates[0]?.[0];
        if (!ring) return;
        ctx.beginPath();
        let started = false;
        ring.forEach(coord => {
          const projected = projectPoint(coord[1], coord[0], rotation, w, h);
          if (projected) {
            const sx = cx + (projected.x - cx) * zoom;
            const sy = cy + (projected.y - cy) * zoom;
            if (!started) { ctx.moveTo(sx, sy); started = true; }
            else ctx.lineTo(sx, sy);
          }
        });
        ctx.stroke();
      });
    }

    // Revenue heatmap layer
    if (selectedLayer === 'all' || selectedLayer === 'revenue') {
      const maxRevenue = Math.max(...revenueData.map(r => r.revenue), 1);
      revenueData.forEach(region => {
        const projected = projectPoint(region.lat, region.lng, rotation, w, h);
        if (!projected) return;
        const sx = cx + (projected.x - cx) * zoom;
        const sy = cy + (projected.y - cy) * zoom;
        const r = (0.4 + (region.revenue / maxRevenue) * 0.8) * 25 * zoom;
        const ratio = region.revenue / maxRevenue;

        // Glow
        const glowGrad = ctx.createRadialGradient(sx, sy, 0, sx, sy, r * 2);
        if (ratio < 0.25) glowGrad.addColorStop(0, `rgba(30,0,60,${0.3 + ratio})`);
        else if (ratio < 0.5) glowGrad.addColorStop(0, `rgba(80,20,120,${0.5 + ratio * 0.3})`);
        else if (ratio < 0.75) glowGrad.addColorStop(0, `rgba(180,80,40,${0.7 + ratio * 0.2})`);
        else glowGrad.addColorStop(0, `rgba(255,200,50,${0.85 + ratio * 0.15})`);
        glowGrad.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(sx, sy, r * 2, 0, Math.PI * 2);
        ctx.fillStyle = glowGrad;
        ctx.fill();

        // Main dot
        ctx.beginPath();
        ctx.arc(sx, sy, r, 0, Math.PI * 2);
        if (ratio < 0.25) ctx.fillStyle = `rgba(30,0,60,${0.5 + ratio})`;
        else if (ratio < 0.5) ctx.fillStyle = `rgba(80,20,120,${0.6 + ratio * 0.3})`;
        else if (ratio < 0.75) ctx.fillStyle = `rgba(180,80,40,${0.7 + ratio * 0.2})`;
        else ctx.fillStyle = `rgba(255,200,50,${0.85 + ratio * 0.15})`;
        ctx.fill();

        // Ring for high revenue
        if (ratio > 0.6) {
          ctx.beginPath();
          ctx.arc(sx, sy, r * (1.5 + Math.sin(pulsePhase * 2) * 0.2), 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(255,200,50,${0.3 - Math.sin(pulsePhase * 2) * 0.15})`;
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      });
    }

    // Agent layer
    if (selectedLayer === 'all' || selectedLayer === 'agents') {
      const taskLoadMap = {};
      issues.forEach(issue => {
        const id = issue.assigneeAgentId;
        if (id) taskLoadMap[id] = (taskLoadMap[id] || 0) + 1;
      });

      agents.forEach((agent, i) => {
        const lat = (Math.random() * 140 - 70);
        const lng = ((i / Math.max(agents.length, 1)) * 360 - 180);
        const projected = projectPoint(lat, lng, rotation, w, h);
        if (!projected) return;

        const sx = cx + (projected.x - cx) * zoom;
        const sy = cy + (projected.y - cy) * zoom;
        const taskLoad = taskLoadMap[agent.id] || 0;
        const agentRadius = (0.3 + Math.min(taskLoad * 0.15, 0.9)) * 8 * zoom;

        const color = selectedView === 'division'
          ? (Object.entries(DIVISION_COLORS).find(([k]) => (agent.role || '').toLowerCase().includes(k))?.[1] || '#6b7280')
          : (STATUS_COLORS[agent.status] || '#6b7280');

        // Pulsing ring for running agents with tasks
        if (agent.status === 'running' && taskLoad > 0 && selectedView === 'status') {
          const pulseR = agentRadius * (1.5 + Math.sin(pulsePhase * 3) * 0.5);
          ctx.beginPath();
          ctx.arc(sx, sy, pulseR, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(34, 197, 94, ${0.5 - Math.abs(Math.sin(pulsePhase * 3)) * 0.4})`;
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        // Agent dot
        ctx.beginPath();
        ctx.arc(sx, sy, agentRadius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();

        // Glow
        const glowGrad = ctx.createRadialGradient(sx, sy, 0, sx, sy, agentRadius * 2);
        glowGrad.addColorStop(0, color.replace(')', ', 0.3)').replace('rgb', 'rgba'));
        glowGrad.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(sx, sy, agentRadius * 2, 0, Math.PI * 2);
        ctx.fillStyle = glowGrad;
        ctx.fill();
      });
    }

    // Task flow arcs
    if (selectedLayer === 'all' || selectedLayer === 'tasks') {
      const callTypes = ['data', 'billing', 'task'];
      const callColors = { data: '#3b82f6', billing: '#22c55e', task: '#eab308' };

      for (let i = 0; i < 15; i++) {
        const fromIdx = i % Math.max(agents.length, 1);
        const toIdx = (i + Math.floor(Math.random() * (Math.max(agents.length, 1) - 1)) + 1) % Math.max(agents.length, 1);
        const fromLat = (Math.random() * 140 - 70);
        const fromLng = ((fromIdx / Math.max(agents.length, 1)) * 360 - 180);
        const toLat = (Math.random() * 140 - 70);
        const toLng = ((toIdx / Math.max(agents.length, 1)) * 360 - 180);
        const fromP = projectPoint(fromLat, fromLng, rotation, w, h);
        const toP = projectPoint(toLat, toLng, rotation, w, h);
        if (!fromP || !toP) continue;

        const sx = cx + (fromP.x - cx) * zoom;
        const sy = cy + (fromP.y - cy) * zoom;
        const ex = cx + (toP.x - cx) * zoom;
        const ey = cy + (toP.y - cy) * zoom;
        const callType = callTypes[i % 3];
        const color = callColors[callType];

        // Animated arc
        const mx = (sx + ex) / 2;
        const my = (sy + ey) / 2 - Math.abs(ex - sx) * 0.3;
        const dashOffset = (pulsePhase * 50) % 30;

        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.quadraticCurveTo(mx, my, ex, ey);
        ctx.strokeStyle = color;
        ctx.lineWidth = (0.3 + Math.random() * 0.5) * zoom;
        ctx.setLineDash([8, 4]);
        ctx.lineDashOffset = -dashOffset;
        ctx.globalAlpha = 0.6;
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.globalAlpha = 1;
      }
    }

    // Province layer (Anno 117)
    if (selectedLayer === 'province' && provinces.length > 0) {
      const maxRevenue = Math.max(...provinces.map(p => p.metrics?.revenue || 0), 1);

      // Draw connection arcs between provinces
      for (let i = 0; i < Math.min(provinces.length - 1, 5); i++) {
        const from = provinces[i];
        const to = provinces[(i + 3) % provinces.length];
        const fromP = projectPoint(from.lat, from.lng, rotation, w, h);
        const toP = projectPoint(to.lat, to.lng, rotation, w, h);
        if (!fromP || !toP) continue;

        const sx = cx + (fromP.x - cx) * zoom;
        const sy = cy + (fromP.y - cy) * zoom;
        const ex = cx + (toP.x - cx) * zoom;
        const ey = cy + (toP.y - cy) * zoom;
        const mx = (sx + ex) / 2;
        const my = (sy + ey) / 2 - Math.abs(ex - sx) * 0.2;
        const dashOffset = (pulsePhase * 30) % 20;

        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.quadraticCurveTo(mx, my, ex, ey);
        ctx.strokeStyle = `rgba(59, 130, 246, 0.25)`;
        ctx.lineWidth = 1.5 * zoom;
        ctx.setLineDash([6, 4]);
        ctx.lineDashOffset = -dashOffset;
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Draw province markers
      provinces.forEach(province => {
        const projected = projectPoint(province.lat, province.lng, rotation, w, h);
        if (!projected) return;

        const sx = cx + (projected.x - cx) * zoom;
        const sy = cy + (projected.y - cy) * zoom;
        const revenue = province.metrics?.revenue || 0;
        const ratio = revenue / maxRevenue;
        const baseSize = (0.3 + ratio * 0.7) * 18 * zoom;
        const pulseR = baseSize * (1 + Math.sin(pulsePhase * 2 + province.lat) * 0.15);

        // Outer glow ring
        const glowGrad = ctx.createRadialGradient(sx, sy, baseSize, sx, sy, baseSize * 2.5);
        glowGrad.addColorStop(0, province.color + '60');
        glowGrad.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(sx, sy, baseSize * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = glowGrad;
        ctx.fill();

        // Pulsing ring
        ctx.beginPath();
        ctx.arc(sx, sy, pulseR * 1.3, 0, Math.PI * 2);
        ctx.strokeStyle = province.color + '40';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Main dot
        ctx.beginPath();
        ctx.arc(sx, sy, baseSize, 0, Math.PI * 2);
        ctx.fillStyle = province.color;
        ctx.fill();

        // Inner highlight
        ctx.beginPath();
        ctx.arc(sx - baseSize * 0.25, sy - baseSize * 0.25, baseSize * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.2)';
        ctx.fill();

        // Label
        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        ctx.font = `${Math.max(9, 11 * zoom)}px 'Inter', sans-serif`;
        ctx.textAlign = 'center';
        const labels = province.id.split('-');
        ctx.fillText(labels[0], sx, sy + baseSize + 14 * zoom);
        if (zoom > 0.9) {
          ctx.fillStyle = 'rgba(255,255,255,0.5)';
          ctx.font = `${Math.max(8, 9 * zoom)}px 'Inter', sans-serif`;
          ctx.fillText(labels.slice(1).join(' '), sx, sy + baseSize + 26 * zoom);
        }
      });
    }

    // Globe border
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(58, 34, 138, 0.5)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Atmosphere overlay
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fillStyle = atmGrad;
    ctx.fill();
    ctx.restore();

  }, [geoData, agents, issues, revenueData, rotation, zoom, size, selectedLayer, selectedView, pulsePhase, provinces]);

  if (loading) {
    return (
      <div className="canvas-globe-loading">
        <div className="loading-spinner"></div>
        <p>Loading AI City Globe...</p>
      </div>
    );
  }

  return (
    <div className="canvas-globe-wrapper" ref={containerRef}>
      <canvas
        ref={canvasRef}
        className="canvas-globe-canvas"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onClick={handleClick}
        style={{ cursor: isDragging ? 'grabbing' : selectedLayer === 'province' ? 'pointer' : 'grab' }}
      />

      {/* Tooltip */}
      {tooltip && (
        <div
          className="globe-tooltip"
          style={{ left: tooltip.x + 12, top: tooltip.y - 10, position: 'fixed', pointerEvents: 'none' }}
        >
          {tooltip.type === 'province' ? (
            <>
              <strong>{tooltip.data.label}</strong>
              <div className="tooltip-row">
                <span>Revenue:</span>
                <span>${((tooltip.data.metrics?.revenue || 0) / 1000000).toFixed(1)}M</span>
              </div>
              <div className="tooltip-row">
                <span>Customers:</span>
                <span>{tooltip.data.metrics?.totalCustomers?.toLocaleString()}</span>
              </div>
              <div className="tooltip-row">
                <span>Conv Rate:</span>
                <span>{tooltip.data.metrics?.conversionRate}%</span>
              </div>
              <div className="tooltip-row">
                <span>Growth:</span>
                <span style={{ color: (tooltip.data.metrics?.growthRate || 0) > 10 ? '#22c55e' : 'inherit' }}>
                  ↑{tooltip.data.metrics?.growthRate}%
                </span>
              </div>
              <div className="tooltip-click-hint">Click to view details</div>
            </>
          ) : tooltip.type === 'revenue' ? (
            <>
              <strong>{tooltip.data.name}</strong>
              <div className="tooltip-row">
                <span>Revenue:</span>
                <span>${tooltip.data.revenue.toLocaleString()}</span>
              </div>
              <div className="tooltip-row">
                <span>Customers:</span>
                <span>{tooltip.data.customerCount}</span>
              </div>
              <div className="tooltip-row">
                <span>Trend:</span>
                <span className={`trend-${tooltip.data.trend}`}>
                  {tooltip.data.trend === 'up' ? '↑' : tooltip.data.trend === 'down' ? '↓' : '→'}
                </span>
              </div>
            </>
          ) : (
            <>
              <strong>{tooltip.data.name}</strong>
              <div className="tooltip-row">
                <span>Role:</span>
                <span>{tooltip.data.role || 'Agent'}</span>
              </div>
              <div className="tooltip-row">
                <span>Status:</span>
                <span className={`status-${tooltip.data.status}`}>{tooltip.data.status}</span>
              </div>
              <div className="tooltip-row">
                <span>Tasks:</span>
                <span>{tooltip.data.taskLoad}</span>
              </div>
            </>
          )}
        </div>
      )}

      {/* Controls hint */}
      <div className="globe-hint">
        <span>🖱️ Drag to rotate</span>
        <span>⚙️ Scroll to zoom</span>
      </div>
    </div>
  );
}

export { CanvasGlobe, DEFCON_LEVELS, REVENUE_REGIONS };
