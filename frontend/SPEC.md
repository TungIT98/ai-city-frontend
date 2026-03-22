# AI City Agent Universe - Visualization Specification

## Overview
3D globe visualization showing AI City agent ecosystem with status, task flow, and revenue data layers.

## Data Layers

### 1. Agent Status Layer
- **Purpose**: Display all AI City agents on the globe
- **Coordinate mapping**: Agents distributed evenly around globe (index-based longitude)
- **Visual encoding**:
  - Dot size: Based on task load (0.3 - 1.2)
  - Color by status:
    - Running: `#22c55e` (green)
    - Idle: `#eab308` (yellow)
    - Paused: `#6b7280` (gray)
    - Error: `#ef4444` (red)
  - Color by division:
    - Backend/CTO/CFO: `#3b82f6` (blue)
    - Frontend/CPO: `#a855f7` (purple)
    - Marketing/CMO: `#22c55e` (green)
    - DevOps/Operations: `#f97316` (orange)
    - Sales: `#eab308` (yellow)
    - CEO: `#ec4899` (pink)
- **Animation**: Pulsing rings for running agents with active tasks

### 2. Task Flow Layer
- **Purpose**: Show inter-agent communication/calls
- **Visual encoding**:
  - Arc between agents
  - Color by call type:
    - Data calls: `#3b82f6` (blue)
    - Billing calls: `#22c55e` (green)
    - Task calls: `#eab308` (yellow)
  - Arc thickness: Call volume (0.3 - 1.5)
  - Animated dash pattern
- **Data**: Mock call data (15 flows)

### 3. Revenue Heatmap Layer
- **Purpose**: Display revenue by geographic region
- **Regions**:
  - North America (lat: 40, lng: -100)
  - Europe (lat: 50, lng: 10)
  - Asia Pacific (lat: 25, lng: 120)
  - Latin America (lat: -15, lng: -60)
  - Middle East (lat: 25, lng: 45)
  - Africa (lat: 0, lng: 20)
  - Oceania (lat: -25, lng: 135)
  - India (lat: 20, lng: 78)
- **Visual encoding**:
  - Brightness: Revenue density (dark purple → bright gold)
  - Size: Revenue magnitude (0.4 - 1.2)
  - Customer clusters: Small dots around main points
  - Glow rings: High revenue regions

## Color Coding Summary

### Status Colors
| Status | Color | Hex |
|--------|-------|-----|
| Running | Green | `#22c55e` |
| Idle | Yellow | `#eab308` |
| Paused | Gray | `#6b7280` |
| Error | Red | `#ef4444` |

### Division Colors
| Division | Color | Hex |
|----------|-------|-----|
| Backend | Blue | `#3b82f6` |
| Frontend | Purple | `#a855f7` |
| Marketing | Green | `#22c55e` |
| DevOps | Orange | `#f97316` |
| Sales | Yellow | `#eab308` |
| CEO | Pink | `#ec4899` |

### Revenue Heatmap
| Level | Color |
|-------|-------|
| Low | `rgba(30, 0, 60, 0.3-0.8)` |
| Medium | `rgba(80, 20, 120, 0.5-0.8)` |
| High | `rgba(180, 80, 40, 0.7-0.9)` |
| Very High | `rgba(255, 200, 50, 0.85-1.0)` |

## UI Components

### Header
- Title: "AI City Globe"
- DEFCON level indicator (company health)
- Layer selector (All/Agents/Tasks/Revenue)
- View selector (By Status/By Division) - for Agents layer
- Auto-refresh toggle - for Revenue layer
- Last update timestamp

### Stats Panel
- Agents mode: Total Agents, Tasks, Active, Errors
- Revenue mode: Total Revenue, Customers, Regions, Growing

### Legend
- Dynamic based on selected layer
- Color keys with visual samples
- Helpful hints

### Globe Container
- Dark earth image
- Topology bump map
- Night sky background
- Atmosphere effect (purple glow)
- Responsive sizing

### Tooltips
- Agent tooltip: Name, Role, Status, Task count
- Call tooltip: Call type, From → To, Volume
- Revenue tooltip: Region, Revenue value, Customer count, Trend

## Interactions

### Layer Selection
- Toggle between: All Layers, Agents, Tasks, Revenue
- Smooth transition between data sets

### View Modes (Agents layer)
- Status view: Color by agent status
- Division view: Color by organizational division

### Auto-refresh (Revenue layer)
- 10-second update interval
- Toggle on/off
- Shows last update time

## Data Sources

### Paperclip API Integration
- `GET /api/agents/me` - Get company context
- `GET /api/companies/:companyId/agents` - Fetch all agents
- `GET /api/companies/:companyId/issues` - Fetch tasks for workload

### Fallback Data
- Mock revenue data with time-based variance
- Mock call flows for task layer

## Performance

- Canvas-based globe (~5KB gzipped + 39KB GeoJSON) replaces globe.gl
- Code splitting via React.lazy()
- Initial bundle ~150KB gzipped
- Target LCP < 1.5s
- Total gzipped ~650KB

## Phase 3 Features

### Authentication & Multi-Tenancy
- JWT-based authentication with login/register
- Role-based access control (Admin, Manager, Agent, Viewer)
- Multi-workspace support
- Session persistence via localStorage
- Demo account for quick access

### Forecasting & Analytics
- Revenue forecast with ML confidence bands
- Lead volume prediction by temperature
- Conversion rate trend analysis
- Cohort retention predictions
- Model insights and risk alerts

### Notification & Alerting System
- In-app notification center with filtering
- Alert rule management (enable/disable)
- Channel integrations (Email, Slack, Discord, SMS, Webhook)
- Notification bell dropdown in sidebar
- Priority-based display (high/medium/low)

### PWA Support
- Web app manifest with shortcuts
- Service worker for offline caching
- Installable on mobile/desktop
- Push notification infrastructure

### API Developer Portal
- Interactive API documentation with endpoint browser
- API key management (create, rotate, delete)
- Webhook configuration (enable, set URL)
- Rate limit monitoring and per-endpoint limits
- Full-width globe container
- Collapsible stats panel
- Touch-enabled rotation/zoom

## Phase 4 Features (March 2026)

### PWA & Mobile Polish
- Custom install prompt banner with 3-second delay
- Dark/Light theme toggle with system preference detection
- iOS splash screen meta tags
- Mobile bottom tab navigation (5 key items)
- Background sync queue via IndexedDB
- Stale-while-revalidate caching strategy

### Funnel Analytics (/funnel)
- Conversion funnel visualization (Visitor → Lead → Qualified → Opportunity → Customer)
- Stage-by-stage conversion rates with trend indicators
- Cohort retention heatmap with monthly cohorts
- Attribution modeling comparison (First Touch, Last Touch, Linear, Time Decay)

### Integrations Hub (/integrations)
- 12 integration cards (HubSpot, Salesforce, Mailchimp, Slack, Discord, Zapier, Make, GA4, Meta Ads, Stripe, WooCommerce, Shopify)
- Category filtering
- Connection modal with API key input
- Sync status and last sync timestamp
- Connected count indicator

### Security Center (/security)
- Security score gauge (0-100)
- 2FA management (TOTP app, SMS recovery, backup codes)
- Active session management with device/location/IP info
- Remote session revocation
- Audit log with action type, user, IP, timestamp, status
- CSV export for audit logs

### Performance Monitor (/performance)
- Core Web Vitals dashboard (LCP, FID, CLS, TTFB, INP)
- Traffic overview line chart
- API latency table (avg, P95, P99 per endpoint)
- Error tracking with level indicators (error/warn)
- Service health uptime dashboard

### Settings (/settings)
- Profile settings (name, email, role, timezone)
- Workspace settings (name, URL)
- Appearance (theme toggle, compact mode, language)
- Notifications settings
- Billing & subscription (Pro plan display, team members, API calls)
- Data export (JSON/CSV) and account deletion

## Phase 5 Features (AI & Automation)

### AI Insights Engine (/ai-insights)
- Anomaly detection with health score (0-100)
- Smart recommendations with impact/effort matrix
- Trend analysis (growth trends, seasonal patterns)
- Metric correlations and leading indicators

### Natural Language Query (/nl-query)
- Conversational analytics interface
- Visual chart responses (bar, line, pie, area)
- Query history and suggested prompts
- Dark-themed chat interface

### Automation Center (/automation)
- Visual workflow builder with triggers/conditions/actions
- 5 trigger types (schedule, event, webhook, lead score, API)
- Execution log with status, duration, credits
- Enable/disable workflow toggles

### Collaboration Hub (/collaboration)
- Shared dashboards with edit/view permissions
- Comment threads on dashboard widgets
- Activity feed (comments, edits, shares, reactions)
- Workspace tabs for team switching

## Phase 6 Features (Enterprise)

### Global Search (/search)
- Unified search across all data types
- Category filters, recent searches
- Keyboard shortcut (Cmd/Ctrl + K)
- Results grouped by type

### Dashboard Customization (/dashboard/customize)
- Drag-and-drop widget arrangement
- Widget visibility toggles
- 12+ pre-built widgets
- Auto-save to localStorage

## Phase 7 Features (Telesales)

### Telesales Dashboard (/telesales)
- Active calls counter with queue status
- Call disposition breakdown (connected, voicemail, no-answer, callback)
- Revenue per call metrics
- Campaign performance tables
- Real-time activity feed

### Agent Marketplace (/agent-marketplace, /agent-marketplace-dashboard)
- Browse, install, and manage AI agents
- Agent cards with ratings, downloads, category
- Search and category filtering
- Agent detail modal with configuration options

## Phase 8 Features (Polish & Optimization)

### Globe Chunk Optimization (AIC-800)
- Canvas 2D globe replaces globe.gl (507KB → 5KB)
- 3 data layers: agents, task flow, revenue heatmap
- Mouse drag rotation, scroll zoom, hover tooltips

### PDF Report Export (AIC-801)
- jsPDF + html2canvas integration
- Multi-page branded PDF with charts
- 3 pre-built templates: Weekly Summary, Monthly MRR, Lead Pipeline
- Export buttons on Reports page

### Admin Panel (/admin)
- 5 tabs: Users, Teams, Workspaces, Audit Log, API Usage
- User management with invite, role change, status toggle
- Team management with revenue stats
- CSV export for audit log

### Email Template Editor (/email-templates)
- 6 pre-built templates (Welcome, Lead Alert, Weekly Report, etc.)
- 10 dynamic variables with insertion toolbar
- Desktop/Mobile preview modes
- Test email send functionality

### Final Polish (AIC-804)
- 5-step onboarding tour (session-based)
- Print-optimized CSS (@page, hide nav)
- Admin and Email Templates in sidebar nav
- Empty states, error states, loading skeletons