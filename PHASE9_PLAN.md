# AI City - Phase 9 Plan

## Status: PLANNED

## Timeline
- **Duration**: 1 week
- **Goal**: Backend Integration Testing, Real-User Metrics, Bug Fixes, Mobile Companion App

---

## Priority Features

### 1. Real Backend Integration (AIC-900)
- **API Integration Testing**: Test all 35 pages against real backend endpoints
- **Auth Flow**: JWT token refresh, logout, session expiry handling
- **Error Handling**: Map all backend error codes to user-friendly messages
- **Data Pagination**: Implement proper pagination for all list endpoints (leads, agents, reports)
- **CRUD Operations**: Test create/edit/delete flows on leads, agents, templates
- **Real-time Data**: Replace simulated WebSocket data with real backend streams
- **WebSocket Events**: Map backend events to frontend state updates

### 2. Real-User Metrics & Monitoring (AIC-901)
- **PerformanceObserver**: Instrument LCP, FID, CLS, TTFB, INP tracking
- **Error Tracking**: Global error boundary with stack trace reporting
- **User Analytics**: Page views, time on page, click heatmaps (lightweight)
- **API Latency Dashboard**: Real-time API response time monitoring in PerformanceMonitor
- **Error Rate Dashboard**: Track 4xx/5xx rates per endpoint
- **User Session Recording**: Record basic user journeys for debugging

### 3. Bug Fixes & Edge Cases (AIC-902)
- **Form Validation**: Add validation to all forms (login, register, lead create, agent create)
- **Loading States**: Ensure all async operations have loading indicators
- **Error States**: Consistent error UI for API failures, network offline
- **Empty States**: Beautiful empty states for all list views with actionable CTAs
- **Responsive Fixes**: Fix layout issues on tablet (768px-1024px)
- **Date/Time Zones**: Handle timezone differences across all date displays
- **Long Text Truncation**: Handle very long names, emails, descriptions gracefully
- **Navigation Guards**: Prevent navigation during unsaved form changes
- **Memory Leaks**: Fix any React useEffect cleanup issues

### 4. Mobile Companion App (AIC-903)
- **PWA Enhancements**: Push notifications, install prompt, standalone mode
- **Responsive Dashboard**: Fully responsive layouts for all pages on mobile (320px-768px)
- **Bottom Navigation**: Mobile-optimized bottom tab bar with 5 key pages
- **Touch Gestures**: Swipe-to-dismiss for notifications, pull-to-refresh for lists
- **Offline Mode**: Full offline support with background sync when back online
- **Mobile Charts**: Touch-friendly chart interactions (pinch-to-zoom on Globe)
- **Quick Actions**: Floating action button for most common actions on mobile

### 5. Enterprise Features - Phase 1 (AIC-904)
- **SSO Stub**: SSO configuration UI (Google, Microsoft, SAML stubs)
- **Audit Log Enhancement**: Searchable, filterable audit log with export
- **Role-Based UI**: Conditionally render UI elements based on user role
- **Bulk Operations**: Bulk select + bulk action for leads, agents
- **Data Export**: CSV export for all data tables
- **Import**: CSV import for leads with validation preview

---

## Technical Requirements

### New Dependencies
- `web-vitals` - Real-user metrics collection
- `react-helmet-async` - Dynamic meta tags per page
- `@sentry/react` - Error tracking (free tier: 5K events/mo)
- `file-saver` - CSV export
- `papaparse` - CSV parsing for import

### Code Changes
- Global error boundary enhancement with error reporting
- API layer upgrade: add request/response interceptors for metrics
- Service worker enhancement: background sync for offline operations
- All pages: add proper loading/error/empty states
- Responsive CSS: add tablet breakpoint (768px-1024px)

---

## Performance Targets (Phase 9)
- **LCP**: < 1.0s (from 1.8s)
- **FID**: < 30ms
- **CLS**: < 0.02
- **INP**: < 100ms (new metric)
- **Total Gzipped**: < 650KB
- **Build Time**: < 1.0s

---

## Budget
- **Estimated Cost**: $0/month
- Sentry free tier (5K events/month)
- All other features use existing dependencies

---

## Milestones

### Day 1: Backend Integration
- Audit all API calls across all pages
- Add request/response interceptors for auth tokens
- Test login/register flow end-to-end
- Implement proper error mapping for all API calls

### Day 2: Real-User Metrics
- Integrate web-vitals library
- Add PerformanceObserver to all pages
- Enhance PerformanceMonitor with real data
- Add error tracking with Sentry

### Day 3: Bug Fixes
- Form validation on all input forms
- Loading/error/empty states audit
- Responsive fixes for tablet
- Navigation guard implementation

### Day 4: Mobile Enhancements
- PWA push notifications
- Mobile responsive audit
- Bottom navigation bar
- Touch gesture support

### Day 5: Enterprise & Polish
- CSV export on all data tables
- Bulk operations UI
- SSO configuration stub
- Final regression testing
- Production build verification

---

## Success Criteria
- [ ] All 35 pages integrate with real backend
- [ ] Real-user metrics (web-vitals) integrated
- [ ] All forms have validation
- [ ] All async operations have loading/error/empty states
- [ ] PWA installable on mobile
- [ ] CSV export works on all data tables
- [ ] LCP < 1.0s maintained
- [ ] Total bundle < 650KB gzipped
- [ ] Build < 1.0s
- [ ] Zero critical bugs

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Backend not ready | Build mock API layer that can be swapped |
| Sentry rate limit | Use sampling, only track errors |
| Mobile complexity | Focus on responsive-first, not native |
| Performance regression | Run web-vitals on every PR |
