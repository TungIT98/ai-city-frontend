# Globe AI City — Anno 117 Architecture Spec

> **CPO Design Spec v1.0** | Based on Anno 117 Province System
> Parent: AIC-491 | Task: AIC-492

---

## 1. Design Philosophy

Globe AI City mimics the Anno 117 city-builder paradigm adapted for B2B SaaS:
- **Modular Provinces** — Each industry/region is an independent province with its own data layer
- **Production Chains** — Lead → Customer flow visualized as supply chains
- **Discovery Tree** — Expandable tech/business discovery navigation
- **Cultural Choices** — Filterable by Industry × Company Size × Priority

---

## 2. Province System

### 2.1 Province Grid (3D Globe Surface)

| Province | Industry | Region | Company Size | Color | Icon |
|---|---|---|---|---|---|
| VN-Fintech-Startup | Fintech | Vietnam | Startup | `#00C9A7` | 🏦 |
| VN-Ecom-SME | E-commerce | Vietnam | SME | `#FF6B6B` | 🛒 |
| VN-Mfg-Enterprise | Manufacturing | Vietnam | Enterprise | `#4ECDC4` | 🏭 |
| SEA-Fintech-SME | Fintech | SEA | SME | `#45B7D1` | 🏦 |
| SEA-Ecom-Startup | E-commerce | SEA | Startup | `#96CEB4` | 🛒 |
| SEA-Mfg-Enterprise | Manufacturing | SEA | Enterprise | `#DDA0DD` | 🏭 |
| GLOBAL-Fintech-Enterprise | Fintech | Global | Enterprise | `#F7DC6F` | 🏦 |
| GLOBAL-Ecom-Enterprise | E-commerce | Global | Enterprise | `#BB8FCE` | 🛒 |
| GLOBAL-Mfg-Enterprise | Manufacturing | Global | Enterprise | `#85C1E9` | 🏭 |

### 2.2 Province Node Data Structure

```typescript
interface ProvinceNode {
  id: string;                    // "VN-FINTECH-STARTUP"
  label: string;                 // "Vietnam · Fintech · Startup"
  lat: number;
  lng: number;
  industry: 'fintech' | 'ecommerce' | 'manufacturing';
  region: 'VN' | 'SEA' | 'GLOBAL';
  companySize: 'startup' | 'sme' | 'enterprise';
  color: string;
  icon: string;
  metrics: ProvinceMetrics;
  productionChain: ProductionChain;
  subNodes: SubNode[];
  status: 'active' | 'developing' | 'exploring';
}

interface ProvinceMetrics {
  totalLeads: number;
  totalContacts: number;
  qualifiedLeads: number;
  totalCustomers: number;
  revenue: number;
  growthRate: number;        // % YoY
  conversionRate: number;    // Lead → Customer %
  avgDealSize: number;
}

interface SubNode {
  id: string;
  label: string;
  type: 'company' | 'contact' | 'deal' | 'campaign';
  lat: number;              // offset from province center
  lng: number;
  value: number;            // revenue / deal size
  status: 'hot' | 'warm' | 'cold';
}
```

### 2.3 Globe Layout (3D Canvas)

- **Globe radius**: 200px (2D projected)
- **Province markers**: Pulsing circles at lat/lng coordinates
- **Connection arcs**: Bezier curves between provinces showing data flow
- **Zoom levels**:
  - Level 1 (world): Show only province dots with size = totalLeads
  - Level 2 (region): Show province clusters with sub-nodes
  - Level 3 (province): Full sub-node detail with company names

---

## 3. Production Chains

### 3.1 Lead Pipeline Chain

```
[Crawl] → [Process] → [Analyze] → [Visualize]
   ↓          ↓          ↓           ↓
[Raw Data] [Cleaned] [Scored] [Dashboard]
   ↓          ↓          ↓           ↓
[Leads]   [Contacts] [Qualified] [Customers]
```

### 3.2 Chain Visualization (Side Panel)

Each province shows a vertical pipeline with animated progress bars:

```
Province: VN-Fintech-Startup
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌐 Crawl     ████████████░░░░  82%
   └─ Sources: 12 active
⚙️ Process   █████████░░░░░░░░  65%
   └─ Deduplicated: 4,231
🔍 Analyze   ███████░░░░░░░░░░  48%
   └─ Qualified: 1,847
📊 Visualize █████░░░░░░░░░░░░  32%
   └─ Hot leads: 234
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📈 Revenue   $1.2M    ↑18%
🎯 Conv Rate 12.4%   ↑2.1%
⏱ Avg Cycle  14 days  ↓3d
```

### 3.3 Data Flow Arcs (Globe)

- **Lead sources → Province**: Thin grey arcs (crawling feeds)
- **Cross-province**: Colored arcs showing referral/handoff
- **Customer exit**: Golden arc pointing outward

---

## 4. Discovery Tree

### 4.1 Tree Structure

```
🌍 Discovery Tree
├── 🔬 Technology
│   ├── 🤖 AI Agents (12 nodes)
│   │   ├── Sales Agent
│   │   ├── Marketing Agent
│   │   ├── Support Agent
│   │   └── ...
│   ├── ⚡ Automation (8 nodes)
│   │   ├── Email Automation
│   │   ├── Lead Scoring
│   │   └── ...
│   └── 📊 Analytics (6 nodes)
│       ├── Real-time Analytics
│       ├── Predictive Analytics
│       └── ...
├── 💼 Business
│   ├── 📈 Sales (9 nodes)
│   │   ├── Lead Generation
│   │   ├── Pipeline Management
│   │   └── ...
│   ├── 📣 Marketing (7 nodes)
│   │   ├── Campaign Manager
│   │   ├── Email Sequences
│   │   └── ...
│   └── ⚙️ Operations (5 nodes)
│       ├── Workflow Builder
│       └── ...
└── 🚀 Growth
    ├── 📐 Scaling (4 nodes)
    ├── 👥 Hiring (3 nodes)
    └── 💰 Funding (2 nodes)
```

### 4.2 Discovery Actions

Clicking a tree node:
1. Highlights connected provinces on globe
2. Opens detail panel with node-specific metrics
3. Shows cross-province impact analysis

---

## 5. Cultural Choices (Filters)

### 5.1 Filter Bar

```
┌─────────────────────────────────────────────────────────────┐
│ 🌐 All   |  🏦 Fintech  |  🛒 E-commerce  |  🏭 Manufacturing │
│ 🌐 All   |  🇻🇳 VN       |  🌏 SEA        |  🌍 Global       │
│ 🌐 All   |  🚀 Startup  |  💼 SME        |  🏢 Enterprise    │
│ Priority: [Revenue ▼] [Efficiency] [Innovation]             │
└─────────────────────────────────────────────────────────────┘
```

### 5.2 Active Filter State

- Inactive: Grey text, transparent bg
- Active: Bold, colored bg matching province palette
- Filters stack (AND logic) — e.g., "Fintech + VN + Startup"

---

## 6. UI/UX Screens

### 6.1 Screen: Globe View (Main)

```
┌──────────────────────────────────────────────────────────────────┐
│ [Logo] AI City Globe    [Filters Bar]         [🔔] [⚙️] [👤]    │
├────────────┬─────────────────────────────────────┬──────────────┤
│            │                                     │              │
│ Discovery  │         🌍 3D GLOBE CANVAS           │  Province    │
│ Tree       │                                     │  Detail      │
│            │    • Province nodes (pulsing)        │  Panel       │
│ [Tree]     │    • Connection arcs                 │              │
│            │    • Zoom controls                   │ [Metrics]    │
│            │    • Region labels                   │ [Pipeline]   │
│            │                                     │ [Actions]    │
├────────────┴─────────────────────────────────────┴──────────────┤
│ [Status Bar: X provinces active | Y leads today | Z conversion] │
└──────────────────────────────────────────────────────────────────┘
```

### 6.2 Screen: Province Detail (Slide-in Panel)

```
┌─────────────────────────────────────┐
│ ← Back              VN-Fintech-SME  │
├─────────────────────────────────────┤
│ 🏦 Vietnam · Fintech · SME          │
│ Status: ● Active    Growth: ↑18%    │
├─────────────────────────────────────┤
│ [Metric Cards Row]                  │
│ ┌───────┐ ┌───────┐ ┌───────┐       │
│ │ Leads │ │ Conv  │ │ Rev   │       │
│ │ 2,341 │ │ 12.4% │ │ $1.2M │       │
│ └───────┘ └───────┘ └───────┘       │
├─────────────────────────────────────┤
│ Production Chain                    │
│ [Crawl ████░] → [Process ███░░]     │
│ [Analyze ██░░░] → [Visualize █░░░] │
├─────────────────────────────────────┤
│ Sub-Nodes (Companies)               │
│ 🔴 Moca Tech    $45K    Hot         │
│ 🟡 ViettelPay  $120K   Warm         │
│ 🟢 GrabFin      $890K   Customer    │
├─────────────────────────────────────┤
│ [View Full Pipeline →]              │
│ [Compare Provinces]                 │
└─────────────────────────────────────┘
```

### 6.3 Screen: Cross-Province Comparison

Side-by-side metrics for 2-4 selected provinces.

---

## 7. Data Structure

### 7.1 Core Entities

```typescript
// Globe state
interface GlobeState {
  selectedProvinces: string[];
  filterIndustry: string | null;
  filterRegion: string | null;
  filterSize: string | null;
  filterPriority: string | null;
  zoomLevel: 1 | 2 | 3;
  selectedNodeId: string | null;
  timeRange: '7d' | '30d' | '90d' | '1y';
}

// Province config (static)
interface ProvinceConfig {
  id: string;
  label: string;
  lat: number;
  lng: number;
  color: string;
  icon: string;
  industry: Industry;
  region: Region;
  companySize: CompanySize;
}

// Metrics (dynamic, fetched)
interface ProvinceData {
  provinceId: string;
  timestamp: string;
  metrics: ProvinceMetrics;
  subNodes: SubNode[];
  productionChain: ProductionChain;
}
```

### 7.2 Globe Node Map

```javascript
const PROVINCE_COORDS = {
  'VN-FINTECH-STARTUP':  { lat: 21.0285, lng: 105.8542 },  // Hanoi
  'VN-ECOM-SME':         { lat: 10.8231, lng: 106.6297 },  // HCMC
  'VN-MFG-ENTERPRISE':   { lat: 16.0544, lng: 108.2022 },  // Da Nang
  'SEA-FINTECH-SME':     { lat: 1.3521,  lng: 103.8198 },  // Singapore
  'SEA-ECOM-STARTUP':    { lat: 13.7563, lng: 100.5018 },  // Bangkok
  'SEA-MFG-ENTERPRISE':  { lat: 3.139,   lng: 101.6869 },  // KL
  'GLOBAL-FINTECH-ENTERPRISE': { lat: 40.7128, lng: -74.006 }, // NYC
  'GLOBAL-ECOM-ENTERPRISE':    { lat: 37.7749, lng: -122.4194 }, // SF
  'GLOBAL-MFG-ENTERPRISE':     { lat: 51.5074, lng: -0.1278 },  // London
};
```

---

## 8. Component Inventory

| Component | File | Description |
|---|---|---|
| `GlobeCanvas` | `CanvasGlobe.jsx` | 3D globe with 2D projection, province markers, arcs |
| `DiscoveryTree` | `DiscoveryTree.jsx` | Collapsible tree navigation |
| `FilterBar` | `FilterBar.jsx` | Industry/Region/Size/Priority filters |
| `ProvincePanel` | `ProvincePanel.jsx` | Slide-in detail panel |
| `ProductionChain` | `ProductionChain.jsx` | Animated pipeline bars |
| `ProvinceCard` | `ProvinceCard.jsx` | Metric summary card for a province |
| `SubNodeList` | `SubNodeList.jsx` | Company/contact/deal list within province |
| `GlobeControls` | `GlobeControls.jsx` | Zoom, rotate, reset buttons |
| `ComparisonView` | `ComparisonView.jsx` | Cross-province metrics comparison |

---

## 9. Implementation Phases

### Phase A (MVP — 1 sprint)
- Globe canvas with 9 province nodes at fixed coordinates
- Province click → detail panel
- Basic metric cards per province
- Filter bar (Industry × Region × Size)

### Phase B (Data Flow — 1 sprint)
- Production chain visualization
- Animated arcs between provinces
- Discovery tree panel
- Sub-node list per province

### Phase C (Polish — 1 sprint)
- 3D globe rotation/zoom
- Cross-province comparison view
- Time range selector (7d/30d/90d/1y)
- Export to PDF/PNG

---

## 10. Technical Notes

- **Globe rendering**: Canvas 2D API with perspective projection (no WebGL dependency)
- **Animations**: CSS transitions + requestAnimationFrame for arcs
- **Data**: Mock data with realistic values; API hooks ready
- **Performance**: Province data lazy-loaded on zoom/filter change
- **Bundle impact**: ~5KB gzipped (Canvas only, no three.js)
