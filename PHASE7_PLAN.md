# AI City - Phase 7 Plan

## Status: PLANNED

## Timeline
- **Duration**: 1 week
- **Goal**: Production Hardening, Backend Integration & Polish

---

## Priority Features

### 1. Backend Integration & Real API (AIC-700)
- **Real API Connection**: Replace all mock data with live backend calls
- **Error Boundaries**: Global error handling for all page components
- **Loading States**: Consistent skeleton/loader states across all pages
- **Retry Logic**: Auto-retry failed API calls with exponential backoff
- **Data Validation**: Schema validation for API responses
- **Offline Detection**: Graceful degradation when API unavailable

### 2. Advanced Charts & Visualization (AIC-701)
- **Drill-down Charts**: Click-through from summary to detailed data on all chart pages
- **Chart Export**: PNG export for all charts, CSV for all tables
- **Real-time Charts**: Live-updating charts on Dashboard and Analytics
- **Map Integration**: Add geographic visualization beyond Globe (region filters)
- **Sparklines**: Mini trend lines in metric cards
- **Heatmap Tables**: Conditional formatting in data tables

### 3. Accessibility & UX Polish (AIC-702)
- **WCAG 2.1 AA Compliance**: Keyboard navigation, focus management
- **Screen Reader Support**: ARIA labels, roles, live regions
- **Color Contrast**: Ensure all text meets 4.5:1 contrast ratio
- **Skip Navigation**: Skip-to-content link for keyboard users
- **Reduced Motion**: Respect `prefers-reduced-motion` media query
- **Dark Mode Full Coverage**: Ensure all 32 pages support dark/light themes

### 4. Internationalization (AIC-703)
- **i18n Setup**: Install react-i18next
- **Language Switcher**: EN/VN toggle in settings
- **Translated Pages**: All UI strings externalized (labels, buttons, messages)
- **Number/Date Formatting**: Locale-aware currency, dates, numbers
- **RTL Ready**: Layout structure supports RTL languages

### 5. Performance Deep Optimization (AIC-704)
- **Bundle Analysis**: Run `npx vite-bundle-analyzer` to identify large chunks
- **Tree Shaking**: Ensure unused code eliminated
- **Image Optimization**: Lazy load images, use WebP format
- **Prefetching**: Preload critical routes based on navigation patterns
- **Service Worker Tuning**: Fine-tune cache strategies per route
- **Memory Profiling**: Fix any potential memory leaks in real-time components
- **Core Web Vitals Audit**: LCP, FID, CLS, TTFB, INP deep-dive

---

## New Pages (Phase 7)

### New Routes:
None - Phase 7 focuses on quality over new pages.

---

## Technical Requirements

### Dependencies
- `react-i18next`, `i18next` - Internationalization
- `@tanstack/react-query` - Data fetching, caching, retry logic (optional, replaces axios pattern)

### API Endpoints (Expected from Backend)
- Full CRUD for all entities (leads, agents, reports)
- Real-time WebSocket events
- Search API with pagination
- Export endpoints (PNG, CSV, PDF)

---

## Performance Targets
- **LCP**: < 1.5s (improve from 1.8s)
- **FID**: < 50ms (improve from 45ms)
- **CLS**: < 0.03 (improve from 0.04)
- **Bundle Budget**: < 800KB gzipped total
- **Initial JS**: < 160KB gzipped (i18n added)
- **Accessibility**: WCAG 2.1 AA compliant

---

## Budget
- **Estimated Cost**: $0/month
- All features use existing infrastructure + open-source libraries

---

## Milestones

### Day 1: Backend Integration
- Audit all mock data usages
- Replace mock data with real API calls
- Add error boundaries per page
- Add consistent loading skeletons

### Day 2: Charts & Export
- Add drill-down to all charts
- Implement PNG/CSV export
- Add real-time chart updates
- Add sparklines to metric cards

### Day 3: Accessibility
- Audit keyboard navigation
- Add ARIA labels to all interactive elements
- Fix color contrast issues
- Test with screen reader

### Day 4: i18n
- Set up react-i18next
- Extract all UI strings
- Create EN/VN translation files
- Add language switcher

### Day 5: Performance & Polish
- Run bundle analyzer
- Implement image optimization
- Fine-tune service worker
- Final accessibility audit
- Production build verification

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Backend API incomplete | Use mock fallback with clear "demo mode" indicator |
| i18n complexity | Start with most-used strings, prioritize |
| Accessibility scope creep | Focus on critical path (navigation, forms, charts) |
| Performance regression | Run bundle analyzer before/after each change |

---

## Success Criteria
- [ ] All 32 pages connected to real API (with mock fallback)
- [ ] Error boundaries prevent white screens
- [ ] Consistent loading states across all pages
- [ ] All charts have drill-down capability
- [ ] Export (PNG/CSV) works on all charts/tables
- [ ] WCAG 2.1 AA keyboard navigation
- [ ] EN/VN language toggle works
- [ ] LCP < 1.5s maintained
- [ ] Production build successful
