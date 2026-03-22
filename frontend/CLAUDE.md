# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI City Dashboard - A React-based visualization platform for AI agent ecosystems. Displays agent status, task flows, revenue data, leads, and analytics on an interactive 3D globe.

**Company**: AI City (Paperclip) - Company ID: `70eea0cf-b5ee-47bd-b715-9aa8291e2a64`

## Tech Stack

- **Framework**: React 19 + Vite 8
- **Routing**: React Router 7 (SPA with lazy loading)
- **Charts**: Chart.js 4 + react-chartjs-2
- **3D Globe**: Custom Canvas 2D globe with world-atlas GeoJSON (~5KB gzipped + 39KB GeoJSON)
- **HTTP Client**: axios
- **Styling**: CSS modules

## Commands

```bash
npm run dev      # Start dev server (localhost:5173)
npm run build    # Production build to /dist
npm run preview  # Preview production build
npm run lint     # ESLint check
```

## Architecture

### Routing Structure
All routes in `src/App.jsx` with lazy loading via `React.lazy()`:
- `/` and `/landing` - Landing page
- `/login` and `/register` - Authentication (no layout wrapper)
- `/dashboard` - Main dashboard
- `/leads` - Lead management
- `/analytics` - Analytics overview
- `/agents` - Agent management
- `/globe` - 3D globe visualization
- `/ceo-dashboard` - CEO metrics (DAU, feature usage, MRR)
- `/mrr-dashboard` - MRR/ARR metrics
- `/forecasting` - Predictive analytics & ML forecasting
- `/hierarchy` - Agent hierarchy view
- `/agent-feed` - Agent activity feed
- `/agent-marketplace` - Agent marketplace
- `/insights` - Insights panel
- `/telesales` - Telesales dashboard
- `/reports` - Reports
- `/report-builder` - Custom report builder
- `/integration-hub` - Data integration hub
- `/notifications` - Notification & alerting center
- `/api-portal` - API developer portal (docs, keys, webhooks)
- `/onboarding` - Onboarding flow
- `/search` - Global search across all data
- `/dashboard/customize` - Drag-drop dashboard widget customization

**All routes except `/`, `/landing`, `/login`, `/register` are protected by AuthProvider.**

### API Services (`src/services/api.js`)
Two API services exported:
- **`api`** - AI City backend (`VITE_API_URL`)
  - Endpoints: `/health`, `/leads`, `/analytics`, `/agents`, `/reports`, `/auth`, `/notifications`, `/webhooks`, `/api-keys`, `/workspaces`, `/users`
- **`paperclipApi`** - Paperclip platform (`VITE_PAPERCLIP_API`)
  - Endpoints: `/api/agents/me`, `/api/companies/:id/agents`, `/api/companies/:id/issues`

### Auth Context (`src/contexts/AuthContext.jsx`)
Provides authentication state and methods:
- `login(email, password)` / `register(name, email, password, workspaceName)`
- `logout()` / `switchWorkspace(id)`
- `hasPermission(permission)` - RBAC check
- Roles: `admin`, `manager`, `agent`, `viewer`

### Page Components
Pages are in `src/pages/` and use CSS modules. Pages wrapped in `Layout` component (from `src/components/Layout.jsx`) have the app shell (sidebar, header).

## Environment Variables

```env
VITE_API_URL=https://aicity-backend-deploy.vercel.app  # Backend API
VITE_PAPERCLIP_API=http://localhost:3100                # Paperclip platform API
```

## Deployment

Deployed on Vercel with SPA routing. The `vercel.json` rewrites all routes to `/index.html` for React Router.

```bash
# Deploy to Vercel
vercel deploy --prod --yes --force --token "$VERCEL_TOKEN" --scope tungit98s-projects
```

## Globe Visualization (`/globe`)

The globe (`src/pages/Globe.jsx`) visualizes three data layers:
1. **Agent Status** - Agents colored by status (running/idle/paused/error) or division
2. **Task Flow** - Inter-agent communication arcs with animated dashes
3. **Revenue Heatmap** - Geographic revenue distribution

Canvas globe (`CanvasGlobe.jsx`) is lazy-loaded (~5KB gzipped, +39KB GeoJSON). Uses Canvas 2D API with world-atlas GeoJSON. Supports 3 data layers: agent dots, task flow arcs, revenue heatmap.

## Database

Neon PostgreSQL connection via backend:
- Host: `ep-weathered-river-ad127i3j-pooler.c-2.us-east-1.aws.neon.tech`
- Database: `neondb`
- Requires `sslmode=require`
