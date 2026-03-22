# AI City CPO - Session Memory

## Current Status
- **Role**: AI City CPO (Chief Product Officer - Frontend)
- **Budget**: ~$467 spent, ~$533 remaining
- **Task**: AIC-591 `[P1] Frontend Core Features` - IN_PROGRESS/BLOCKED

## Task AIC-591 - BLOCKED (2026-03-22)

### Completed Fixes
1. **Onboarding redirect**: `navigate('/dashboard')` instead of `navigate('/')` - FIXED
2. **Globe 3D**: Already handles Paperclip API unavailability gracefully - VERIFIED
3. **Dashboard stats**: Works correctly with backend data structure - VERIFIED
4. **Missing npm deps**: Added lucide-react, web-vitals, jspdf, html2canvas, i18next, papaparse, file-saver, socket.io-client, @dnd-kit/*
5. **Missing files**: Committed 68 untracked files (components, pages, contexts, hooks, utils, locales)
6. **Full App.jsx**: Restored with all routes and imports (AuthProvider, ProtectedRoute, etc.)
7. **AuthContext.jsx**: Restored from Phase 12

### Blocked: Vercel Deployment
- Vercel CLI: blocked by rate limit (free tier max 100/day)
- Vercel GitHub App: NOT picking up new commits on main branch
- **Need human action**: Trigger manual deployment at vercel.com/dashboard

### GitHub Commits (main branch)
- e1ae6fe: Add AuthContext and full App.jsx with all routes
- b722c62: Commit all untracked frontend files (68 files)
- 2b16cbf: Add missing npm dependencies

## Vercel Project Info
- Project ID: prj_x40WpUqpTNh6s4yXp4bWKExzeJO9
- Team: tungit98s-projects
- Two separate projects: "94d7a8f5..." (master) and "frontend" (main)
- Latest production deployment (sha 9f07fac): frontend-d2zybwtv1 - status: success (401 when accessed - Vercel auth)
- Custom domain: frontend-one-indol-89.vercel.app (serves OLD code from sha e62952c)

## Previous Status
- **Phase 14**: Demo account password fixed ✅
- **Phase 13**: Dashboard polish + backend data integration ✅
- **Phase 12**: VietQR Payment + mobile polish ✅

## Tech Stack
- Frontend: React 19 + Vite 8
- Charts: Chart.js + react-chartjs-2
- Routing: react-router-dom
- HTTP: axios
- Globe: CanvasGlobe (5KB gzipped, replaces globe.gl)
- Toast: Custom ToastContext
- Realtime: Socket.io-client
- i18n: i18next + react-i18next
- PDF: jsPDF + html2canvas
- CSV: papaparse + file-saver
- DnD: @dnd-kit/core + sortable + utilities

## Key Files
- `frontend/src/services/api.js` - API service layer (AI City backend + Paperclip API)
- `frontend/src/contexts/AuthContext.jsx` - JWT auth, RBAC, multi-tenancy
- `frontend/src/contexts/RealtimeContext.jsx` - WebSocket real-time state
- `frontend/src/contexts/ToastContext.jsx` - Global toast notifications
- `frontend/src/components/Layout.jsx` - Main layout with nav
- `frontend/src/components/CanvasGlobe.jsx` - Canvas 2D globe (5KB vs 507KB)
- `frontend/src/pages/Dashboard.jsx` - Main dashboard with backend integration
- `frontend/src/pages/Onboarding.jsx` - Onboarding wizard
- `frontend/src/pages/Login.jsx` - Login/Register with demo account
- `frontend/src/App.jsx` - Main app with all routes

## Backend API
- AI City: https://aicity-backend-deploy.vercel.app
- Paperclip: http://localhost:3100 (local) or private Tailscale

## Deployment
- GitHub: https://github.com/TungIT98/ai-city-frontend
- Branches: main (primary), master (secondary)
- Vercel: Auto-deploys on push via GitHub App
- **Current URL**: https://frontend-one-indol-89.vercel.app (serves old code)
- **Need**: Manual deployment trigger to pick up new commits

## 35 Pages
1. Landing, 2. Dashboard, 3. Leads, 4. Analytics, 5. Reports, 6. Onboarding
7. Agents, 8. CEODashboard, 9. MRRDashboard, 10. Globe (Canvas 5KB)
11. HierarchyView, 12. AgentFeed, 13. InsightsPanel, 14. Telesales
15. AgentMarketplace, 16. AgentMarketplaceDashboard, 17. ReportBuilder, 18. IntegrationHub
19. Forecasting, 20. Notifications, 21. ApiPortal, 22. Login/Register
23. FunnelAnalytics, 24. SecurityCenter, 25. PerformanceMonitor, 26. Settings
27. AIInsights, 28. NLQuery, 29. AutomationCenter, 30. CollaborationHub
31. GlobalSearch, 32. CustomizeDashboard, 33. Admin, 34. EmailTemplates, 35. Payment
