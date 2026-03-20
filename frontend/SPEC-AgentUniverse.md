# AI City Agent Universe - 3D Globe Visualization Specification

## Overview

The Agent Universe is a 3D globe visualization that displays AI City agents as interactive nodes on a global map. It provides real-time visibility into agent status, revenue generation, and activity patterns.

---

## 1. Data Layers

### 1.1 Agent Status Layer
| Status | Visual Indicator | Description |
|--------|------------------|-------------|
| **Active** | Pulsing cyan dot | Agent currently processing tasks |
| **Idle** | Static blue dot | Agent available but not working |
| **Paused** | Static orange dot | Agent paused by user |
| **Error** | Flashing red dot | Agent encountered errors |

### 1.2 Revenue Layer
| Revenue Tier | Brightness Level | Color |
|--------------|------------------|-------|
| $0 - 500K | Dim | Dark blue |
| 500K - 1M | Medium | Cyan |
| 1M - 2M | Bright | Light cyan |
| 2M+ | Intense glow | White-cyan |

### 1.3 Activity Layer
- **Task completion**: Ripple effect radiating from agent node
- **New task assigned**: Brief flash + particle trail
- **High activity**: Larger pulse radius + faster animation

---

## 2. Color Coding Scheme

### Primary Palette
```
Background:     #0a0a1a (deep space black)
Globe ocean:    #0d1b2a (dark navy)
Globe land:     #1b263b (muted slate)
Agent active:  #00d4ff (electric cyan)
Agent idle:     #4a90d9 (calm blue)
Agent paused:   #f4a261 (warm orange)
Agent error:    #ef476f (alert red)
Revenue glow:   #00ffaa (bright teal)
```

### Revenue Brightness Scale (0-100%)
```
0%    → rgba(0, 212, 255, 0.1)  // barely visible
25%   → rgba(0, 212, 255, 0.3)  // dim glow
50%   → rgba(0, 212, 255, 0.5)  // medium brightness
75%   → rgba(0, 212, 255, 0.8)  // bright
100%  → rgba(255, 255, 255, 1)  // intense white-cyan
```

---

## 3. Agent Cluster Positioning

### Geographic Mapping Strategy
- **Enterprise agents**: Clustered around major business hubs (US East, US West, EU, Singapore)
- **SMB agents**: Distributed across secondary cities
- **Placement algorithm**: K-means clustering based on customer location data

### Node Sizing
- **Base size**: 8px radius
- **Scaling factor**: log(revenue + 1) * 2
- **Max size**: 24px radius

---

## 4. Agent Info Popup Mockups

### 4.1 Hover Popup (Compact)
```
┌─────────────────────────────┐
│ 🤖 Social Media Manager    │
│ ● Active                   │
│ ─────────────────────────  │
│ 💰 Revenue: ₫2,450,000     │
│ 📊 Tasks: 1,247 completed   │
│ ⏱️ Avg: 2.3 min/task       │
└─────────────────────────────┘
Size: 280px × 160px
Background: rgba(10, 10, 26, 0.95)
Border: 1px solid rgba(0, 212, 255, 0.3)
Border-radius: 12px
```

### 4.2 Click Popup (Detailed)
```
┌──────────────────────────────────────────────┐
│ 🤖 Social Media Manager                       │
│ ┌──────┐  ● Active    ⏳ Running 45m          │
│ │ Icon │  📍 US-East (Virginia)              │
│ └──────┘                                      │
├──────────────────────────────────────────────┤
│ METRICS                                       │
│ ┌─────────────┬─────────────┬─────────────┐   │
│ │ Revenue     │ Tasks      │ Success     │   │
│ │ ₫2,450,000  │ 1,247      │ 98.2%      │   │
│ └─────────────┴─────────────┴─────────────┘   │
├──────────────────────────────────────────────┤
│ CREDIT USAGE                                  │
│ [████████████░░░░░░░] 65% (6,500 / 10,000)   │
├──────────────────────────────────────────────┤
│ CONFIGURATION                                 │
│ Schedule: 9AM-6PM | Max Credits: 10,000/mo   │
│ Notifications: ✓ Email  ✓ Slack             │
├──────────────────────────────────────────────┤
│ [View Logs] [Edit Agent] [Pause] [Delete]    │
└──────────────────────────────────────────────┘
Size: 400px × 380px
```

---

## 5. UI Components

### 5.1 Revenue Stats Panel (Fixed Right Sidebar)
- **Position**: Right side, 320px width
- **Content**:
  - Total MRR displayed at top
  - Agent revenue leaderboard (top 10)
  - Revenue trend sparkline (7 days)
  - Export button (CSV/PNG)

### 5.2 Activity Timeline (Bottom Bar)
- **Height**: 80px
- **Content**: Horizontal scrolling feed of recent agent activities
- **Event types**: task_start, task_complete, error, credit_threshold

### 5.3 Filter Controls (Top Right)
- **Agent Type**: Multi-select dropdown
- **Region**: World regions checkboxes
- **Revenue Range**: Dual-handle slider
- **Status**: Toggle buttons (Active/Idle/Paused/Error)

---

## 6. Real-time Updates

### WebSocket Events
```javascript
// Agent status change
{ type: 'agent_status', agentId: 'xxx', status: 'active', timestamp: '...' }

// Revenue update (aggregated every 5 min)
{ type: 'revenue_update', agentId: 'xxx', revenue: 2500000, period: 'mar_2026' }

// Task completion
{ type: 'task_complete', agentId: 'xxx', taskId: 'yyy', duration: 120, success: true }
```

### Animation Specifications
- **Status pulse**: 2s infinite ease-in-out
- **Revenue glow fade**: 3s transition
- **Task ripple**: 1.5s ease-out, max radius 50px
- **New agent appear**: 0.5s scale-in from 0

---

## 7. Technical Implementation

### Globe Configuration
```javascript
Globe()
  .globeImageUrl('//unpkg.com/three-globe/example/img/earth-dark.png')
  .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
  .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
  .pointsData(agents)
  .pointLat('lat')
  .pointLng('lng')
  .pointColor(pointColor)
  .pointRadius('radius')
  .pointAltitude(0.02)
  .pointLabel(pointLabel)
```

### Performance Targets
- Initial load: < 3 seconds
- Agent count support: 500+ nodes
- Real-time updates: < 100ms latency
- Memory usage: < 200MB

---

## 8. Acceptance Criteria

1. ✅ Globe renders with agent nodes positioned geographically
2. ✅ Color brightness reflects revenue tier accurately
3. ✅ Hover shows compact popup with key metrics
4. ✅ Click opens detailed panel with full agent info
5. ✅ Filters correctly show/hide agent subsets
6. ✅ Real-time status updates animate smoothly
7. ✅ Revenue panel shows accurate MRR data
8. ✅ Mobile responsive (single column, touch-friendly)
9. ✅ Performance: LCP < 2.5s, smooth 60fps animations

---

## 9. Visual Mockup Descriptions

### Main View
```
┌─────────────────────────────────────────────────────────────┐
│ 🌐 Agent Universe                              [Filters ▼]  │
│                                                             │
│     ╭───────────────────────────────────────────────╮      │
│    ╱                                                    ╲    │
│   │          🌐  3D Globe with Agent Nodes           │     │
│   │                                                      │    │
│   │     ● ●      ● ●●    ●       ●                     │    │
│   │   ●      ●    ●    ●        ●●      ●             │    │
│   │     ●●       ●       ●    ●      ●                 │    │
│    ╲                                                    ╱    │
│     ╰───────────────────────────────────────────────╯      │
│                                                             │
│ ┌─────────┐                                    ┌─────────┐ │
│ │Timeline │                                    │ Revenue │ │
│ │ ▫ task  │                                    │ ₫125M   │ │
│ │ ● done  │                                    │ MRR     │ │
│ │ ● error │                                    │         │ │
│ └─────────┘                                    └─────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Interaction Flow
1. **Load**: Globe spins slowly, agents fade in
2. **Hover**: Compact tooltip appears after 200ms
3. **Click**: Panel slides in from right
4. **Filter**: Agents not matching fade to 20% opacity

---

*Document Version: 1.0*
*Created: 2026-03-20*
*Owner: AI City CPO*