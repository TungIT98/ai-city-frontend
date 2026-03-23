/**
 * AI City Canvas Globe
 * Lightweight 2D canvas-based globe visualization (~8KB vs 500KB+)
 * Renders a 3D-looking sphere with agent dots, arcs, and pulsing effects
 */
import { useEffect, useRef, useCallback } from 'react';
import './CanvasGlobe.css';

// Division colors
const DIVISION_COLORS = {
  backend: '#3b82f6', cto: '#3b82f6', cfo: '#3b82f6',
  frontend: '#a855f7', cpo: '#a855f7',
  marketing: '#22c55e', cmo: '#22c55e',
  devops: '#f97316', operations: '#f97316',
  sales: '#eab308', ceo: '#ec4899',
};

const STATUS_COLORS = {
  running: '#22c55e', idle: '#eab308',
  paused: '#6b7280', error: '#ef4444', stopped: '#6b7280',
};

const getAgentColor = (agent, viewMode) => {
  if (viewMode === 'division') {
    const role = (agent.role || agent.title || '').toLowerCase();
    for (const [key, color] of Object.entries(DIVISION_COLORS)) {
      if (role.includes(key)) return color;
    }
    return '#6b7280';
  }
  return STATUS_COLORS[agent.status] || '#6b7280';
};

// Convert lat/lng to canvas 2D coordinates (simple orthographic projection)
const latLngToCanvas = (lat, lng, cx, cy, radius) => {
  const latRad = (lat * Math.PI) / 180;
  const lngRad = (lng * Math.PI) / 180;
  const cosLat = Math.cos(latRad);
  const cosLng = Math.cos(lngRad);
  const sinLat = Math.sin(latRad);
  const sinLng = Math.sin(lngRad);
  // Simple orthographic
  const x = cx + radius * cosLat * sinLng;
  const y = cy - radius * sinLat;
  const z = cosLat * cosLng; // depth for visibility
  const visible = z > -0.1; // near-back cull
  return { x, y, z, visible };
};

// Simple continent outline data (major landmass approximations)
const CONTINENTS = [
  // North America
  [[-125, 50], [-95, 25], [-75, 40], [-60, 65], [-125, 50]],
  // South America
  [[-80, 10], [-35, -5], [-40, -55], [-70, -20], [-80, 10]],
  // Europe
  [[-10, 35], [30, 70], [60, 55], [40, 35], [-10, 35]],
  // Africa
  [[-15, 35], [50, 10], [40, -35], [-15, -35], [-15, 35]],
  // Asia
  [[40, 70], [180, 65], [140, 5], [60, 10], [40, 70]],
  // Australia
  [[115, -10], [150, -15], [155, -40], [115, -35], [115, -10]],
  // Greenland
  [[-45, 60], [-20, 75], [-45, 83], [-70, 70], [-45, 60]],
];

function CanvasGlobe({ agents = [], issues = [], selectedLayer = 'all', selectedView = 'status', onAgentClick, onTooltip }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const stateRef = useRef({
    rotation: 0,
    autoRotate: true,
    lastX: null,
    isDragging: false,
    dots: [],
    arcs: [],
    rings: [],
  });

  // Generate stable positions for agents on globe surface
  const generatePositions = useCallback((agentsList) => {
    if (!Array.isArray(agentsList)) return [];
    return agentsList.map((agent, idx) => {
      const lat = (Math.random() * 140 - 70);
      const lng = ((idx / Math.max(agentsList.length, 1)) * 360 - 180);
      return { ...agent, lat, lng };
    });
  }, []);

  // Generate arcs between agents
  const generateArcs = useCallback((agentsList) => {
    if (!Array.isArray(agentsList) || agentsList.length < 2) return [];
    const arcs = [];
    for (let i = 0; i < 8; i++) {
      const from = i % agentsList.length;
      const to = (i + 3) % agentsList.length;
      arcs.push({
        from: agentsList[from],
        to: agentsList[to],
        color: ['#3b82f6', '#22c55e', '#eab308'][i % 3],
        progress: Math.random(),
      });
    }
    return arcs;
  }, []);

  // Main draw loop
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const { width, height } = canvas;
    const cx = width / 2;
    const cy = height / 2;
    const radius = Math.min(width, height) * 0.38;
    const state = stateRef.current;

    // Get current positions
    const safeAgents = Array.isArray(agents) ? agents : [];
    const safeIssues = Array.isArray(issues) ? issues : [];
    let dots = state.dots;
    if (dots.length === 0 || dots.length !== safeAgents.length) {
      dots = generatePositions(safeAgents);
      state.dots = dots;
    }
    if (state.arcs.length === 0 || state.arcs.length !== safeAgents.length) {
      state.arcs = generateArcs(dots);
    }

    // Auto-rotate
    if (state.autoRotate && !state.isDragging) {
      state.rotation += 0.003;
    }

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Night sky background
    const bgGrad = ctx.createRadialGradient(cx, cy, radius * 0.5, cx, cy, radius * 2);
    bgGrad.addColorStop(0, '#0a0a1a');
    bgGrad.addColorStop(1, '#020208');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Stars
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    for (let i = 0; i < 80; i++) {
      const sx = (Math.sin(i * 127.1 + state.rotation * 0.01) * 0.5 + 0.5) * width;
      const sy = (Math.cos(i * 311.7) * 0.5 + 0.5) * height;
      const size = (Math.sin(i * 43.3) * 0.5 + 0.5) * 1.5 + 0.5;
      ctx.beginPath();
      ctx.arc(sx, sy, size, 0, Math.PI * 2);
      ctx.fill();
    }

    // Globe shadow/depth
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius + 4, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.filter = 'blur(8px)';
    ctx.fill();
    ctx.filter = 'none';
    ctx.restore();

    // Globe base gradient
    const globeGrad = ctx.createRadialGradient(cx - radius * 0.3, cy - radius * 0.3, 0, cx, cy, radius);
    globeGrad.addColorStop(0, '#1a3a5c');
    globeGrad.addColorStop(0.5, '#0f2540');
    globeGrad.addColorStop(1, '#061225');
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fillStyle = globeGrad;
    ctx.fill();

    // Clip to globe
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.clip();

    // Draw continents
    ctx.strokeStyle = 'rgba(34, 197, 94, 0.25)';
    ctx.lineWidth = 1;
    ctx.fillStyle = 'rgba(34, 197, 94, 0.08)';
    CONTINENTS.forEach(continent => {
      ctx.beginPath();
      continent.forEach(([lng, lat], i) => {
        const adjustedLng = lng + (state.rotation * 180) / Math.PI;
        const { x, y } = latLngToCanvas(lat, adjustedLng, cx, cy, radius);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.closePath();
      ctx.stroke();
      ctx.fill();
    });

    // Grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 0.5;
    for (let lat = -60; lat <= 60; lat += 30) {
      ctx.beginPath();
      for (let lng = -180; lng <= 180; lng += 5) {
        const adjustedLng = lng + (state.rotation * 180) / Math.PI;
        const { x, y } = latLngToCanvas(lat, adjustedLng, cx, cy, radius);
        if (lng === -180) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    for (let lng = -180; lng <= 180; lng += 30) {
      ctx.beginPath();
      for (let lat = -90; lat <= 90; lat += 5) {
        const adjustedLng = lng + (state.rotation * 180) / Math.PI;
        const { x, y } = latLngToCanvas(lat, adjustedLng, cx, cy, radius);
        if (lat === -90) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    ctx.restore(); // end clip

    // Globe edge glow
    const edgeGrad = ctx.createRadialGradient(cx, cy, radius - 2, cx, cy, radius + 10);
    edgeGrad.addColorStop(0, 'rgba(58, 34, 138, 0.6)');
    edgeGrad.addColorStop(1, 'rgba(58, 34, 138, 0)');
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.strokeStyle = edgeGrad;
    ctx.lineWidth = 12;
    ctx.stroke();

    // Atmosphere glow
    ctx.beginPath();
    ctx.arc(cx, cy, radius + 6, 0, Math.PI * 2);
    const atmosGrad = ctx.createRadialGradient(cx, cy, radius, cx, cy, radius + 15);
    atmosGrad.addColorStop(0, 'rgba(58, 34, 138, 0.3)');
    atmosGrad.addColorStop(1, 'rgba(58, 34, 138, 0)');
    ctx.strokeStyle = atmosGrad;
    ctx.lineWidth = 15;
    ctx.stroke();

    // Draw arcs (task flows)
    if (selectedLayer === 'all' || selectedLayer === 'tasks') {
      state.arcs.forEach(arc => {
        const adjustedFromLng = arc.from.lng + (state.rotation * 180) / Math.PI;
        const adjustedToLng = arc.to.lng + (state.rotation * 180) / Math.PI;
        const from = latLngToCanvas(arc.from.lat, adjustedFromLng, cx, cy, radius);
        const to = latLngToCanvas(arc.to.lat, adjustedToLng, cx, cy, radius);
        if (!from.visible && !to.visible) return;

        const mx = (from.x + to.x) / 2;
        const my = Math.min(from.y, to.y) - radius * 0.4;

        // Arc curve
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.quadraticCurveTo(mx, my, to.x, to.y);
        ctx.strokeStyle = arc.color;
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = 0.5;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.globalAlpha = 1;

        // Animated dot along arc
        arc.progress = (arc.progress + 0.005) % 1;
        const dotT = arc.progress;
        const dotX = (1 - dotT) * (1 - dotT) * from.x + 2 * (1 - dotT) * dotT * mx + dotT * dotT * to.x;
        const dotY = (1 - dotT) * (1 - dotT) * from.y + 2 * (1 - dotT) * dotT * my + dotT * dotT * to.y;
        ctx.beginPath();
        ctx.arc(dotX, dotY, 3, 0, Math.PI * 2);
        ctx.fillStyle = arc.color;
        ctx.fill();
      });
    }

    // Draw agent dots
    if (selectedLayer === 'all' || selectedLayer === 'agents' || selectedLayer === 'revenue') {
      dots.forEach((dot, idx) => {
        const adjustedLng = dot.lng + (state.rotation * 180) / Math.PI;
        const { x, y, z, visible } = latLngToCanvas(dot.lat, adjustedLng, cx, cy, radius);
        if (!visible) return;

        const color = getAgentColor(dot, selectedView);
        const size = 4 + Math.min((safeIssues.filter(i => i.assigneeAgentId === dot.id).length) * 0.8, 5);

        // Pulsing ring for active agents
        if ((dot.status === 'running') && selectedView === 'status') {
          const pulse = (Math.sin(Date.now() * 0.003 + idx) * 0.5 + 0.5);
          ctx.beginPath();
          ctx.arc(x, y, size + 4 + pulse * 6, 0, Math.PI * 2);
          ctx.strokeStyle = color;
          ctx.globalAlpha = 0.3 + pulse * 0.3;
          ctx.lineWidth = 1.5;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }

        // Dot glow
        const glowGrad = ctx.createRadialGradient(x, y, 0, x, y, size * 2.5);
        glowGrad.addColorStop(0, color);
        glowGrad.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(x, y, size * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = glowGrad;
        ctx.globalAlpha = 0.4;
        ctx.fill();
        ctx.globalAlpha = 1;

        // Dot
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();

        // Inner highlight
        ctx.beginPath();
        ctx.arc(x - size * 0.3, y - size * 0.3, size * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.fill();
      });
    }

    animationRef.current = requestAnimationFrame(draw);
  }, [agents, issues, selectedLayer, selectedView, generatePositions, generateArcs]);

  // Setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      const ctx = canvas.getContext('2d');
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Mouse drag for rotation
    const onDown = (e) => {
      stateRef.current.isDragging = true;
      stateRef.current.lastX = e.clientX || e.touches?.[0]?.clientX;
    };
    const onMove = (e) => {
      if (!stateRef.current.isDragging) return;
      const x = e.clientX || e.touches?.[0]?.clientX;
      if (stateRef.current.lastX !== null) {
        stateRef.current.rotation += (x - stateRef.current.lastX) * 0.005;
      }
      stateRef.current.lastX = x;
    };
    const onUp = () => {
      stateRef.current.isDragging = false;
      stateRef.current.lastX = null;
    };

    canvas.addEventListener('mousedown', onDown);
    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseup', onUp);
    canvas.addEventListener('mouseleave', onUp);
    canvas.addEventListener('touchstart', onDown, { passive: true });
    canvas.addEventListener('touchmove', onMove, { passive: true });
    canvas.addEventListener('touchend', onUp);

    // Tooltip on hover
    const onHover = (e) => {
      if (!onTooltip) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const { width, height } = canvas;
      const cx = width / 2;
      const cy = height / 2;
      const radius = Math.min(width, height) * 0.38;
      const dots = stateRef.current.dots;

      let found = null;
      for (const dot of dots) {
        const adjustedLng = dot.lng + (stateRef.current.rotation * 180) / Math.PI;
        const pos = latLngToCanvas(dot.lat, adjustedLng, cx, cy, radius);
        const dist = Math.sqrt((x - pos.x) ** 2 + (y - pos.y) ** 2);
        if (dist < 10) {
          found = dot;
          break;
        }
      }
      onTooltip(found ? { x: e.clientX, y: e.clientY, data: found } : null);
    };
    canvas.addEventListener('mousemove', onHover);

    // Start animation
    stateRef.current.dots = [];
    stateRef.current.arcs = [];
    animationRef.current = requestAnimationFrame(draw);

    return () => {
      ro.disconnect();
      canvas.removeEventListener('mousedown', onDown);
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('mouseup', onUp);
      canvas.removeEventListener('mouseleave', onUp);
      canvas.removeEventListener('touchstart', onDown);
      canvas.removeEventListener('touchmove', onMove);
      canvas.removeEventListener('touchend', onUp);
      canvas.removeEventListener('mousemove', onHover);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [draw, onTooltip]);

  return (
    <canvas
      ref={canvasRef}
      className="canvas-globe-canvas"
      style={{ cursor: 'grab', touchAction: 'none' }}
    />
  );
}

export default CanvasGlobe;
