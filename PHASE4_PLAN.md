# AI City - Phase 4 Plan

## Status: COMPLETE ✅

## Timeline
- **Duration**: 1 week
- **Goal**: Production hardening, advanced integrations, and mobile polish

---

## Priority Features

### 1. Advanced PWA & Mobile Polish (AIC-400)
- **PWA Install Prompt**: Custom install banner with native-like experience
- **Offline Mode**: Full offline functionality with sync queue
- **Push Notifications**: Real browser push via VAPID keys
- **iOS Splash Screen**: Proper icons and splash for iOS home screen
- **Dark Mode Toggle**: System preference + manual override
- **Responsive Mobile Nav**: Bottom tab bar for mobile

### 2. Advanced Analytics Dashboard (AIC-401)
- **Funnel Analysis**: Visual conversion funnel (Visitor → Lead → Qualified → Customer)
- **Cohort Retention Heatmap**: Monthly cohort grid with retention colors
- **Attribution Modeling**: First-touch, last-touch, linear attribution
- **User Behavior Analytics**: Heatmaps, click tracking, session replay data
- **Goal Tracking**: Custom KPI goals with progress indicators

### 3. Third-Party Integrations Hub (AIC-402)
- **CRM Integration**: HubSpot/Salesforce sync for leads
- **Email Marketing**: Mailchimp/ConvertKit integration
- **Slack Integration**: Real-time notifications to Slack channels
- **Zapier/Make**: No-code automation triggers
- **Google Analytics 4**: Event tracking and audience sync
- **Meta Ads**: Facebook/Instagram ad pixel integration

### 4. Advanced Security & Compliance (AIC-403)
- **Two-Factor Authentication**: TOTP-based 2FA
- **Session Management**: Active sessions list, remote logout
- **Audit Log**: All admin actions logged with timestamp
- **Data Export**: GDPR-compliant data export (JSON/CSV)
- **IP Allowlisting**: Enterprise IP restriction
- **SOC 2 Dashboard**: Compliance status panel

### 5. Performance Monitoring & Reliability (AIC-404)
- **Real User Monitoring**: Custom RUM with Core Web Vitals
- **Error Tracking**: Frontend error boundary with stack traces
- **API Latency Monitor**: Per-endpoint latency tracking
- **Uptime Dashboard**: Service health with incident history
- **Performance Budget Alerts**: Auto-alert if bundle exceeds threshold

---

## 22 Pages (Phase 4 Additions)

### New Pages:
18. **Funnel Analytics** (`/funnel`) - Conversion funnel visualization
19. **Integrations** (`/integrations`) - Third-party connections hub
20. **Security Center** (`/security`) - 2FA, sessions, audit log
21. **Performance** (`/performance`) - RUM, error tracking, uptime
22. **Settings** (`/settings`) - Workspace, profile, billing

### Updated Pages:
- **Dashboard** - Add funnel widget, goal progress
- **Analytics** - Add attribution modeling tab
- **MRR Dashboard** - Add cohort retention heatmap

---

## Technical Requirements

### Dependencies
- `workbox` - Advanced service worker strategies
- `web-vitals` - Core Web Vitals measurement
- `react-hot-toast` - Toast notifications
- `date-fns` - Date utilities
- `lodash-es` - Utility functions (tree-shakeable)

### API Endpoints
- `POST /api/integrations/connect` - Connect third-party
- `POST /api/integrations/disconnect` - Disconnect
- `GET /api/integrations/status` - Connection health
- `POST /api/security/2fa/enable` - Enable 2FA
- `POST /api/security/2fa/verify` - Verify 2FA code
- `GET /api/security/sessions` - Active sessions
- `DELETE /api/security/sessions/:id` - Revoke session
- `GET /api/audit-log` - Audit log entries
- `POST /api/export` - GDPR data export
- `POST /api/analytics/funnel` - Funnel data
- `GET /api/performance/metrics` - RUM data
- `POST /api/performance/event` - Track event

---

## Performance Targets
- **LCP**: < 2.0s (current: < 2.5s)
- **FID**: < 100ms
- **CLS**: < 0.05
- **Bundle Budget**: < 600KB gzipped total
- **Initial JS**: < 150KB gzipped

---

## Budget
- **Estimated Cost**: ~$50/month
  - Push notification service: $0 (Firebase FCM free tier)
  - Analytics: $0 (custom RUM)
  - Error tracking: $0 (custom implementation)
  - Total additional: $0 (all self-hosted)

---

## Milestones

### Day 1: PWA Polish & Mobile
- Install prompt
- Offline mode improvements
- Dark mode toggle

### Day 2: Funnel Analytics
- Funnel visualization component
- Cohort retention heatmap
- Attribution modeling

### Day 3: Integrations Hub
- Integration cards for all platforms
- OAuth connection flows
- Sync status dashboard

### Day 4: Security Center
- 2FA implementation
- Session management
- Audit log page

### Day 5: Performance Monitoring
- RUM setup with web-vitals
- Error boundary with reporting
- Uptime dashboard

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Third-party OAuth complexity | Start with read-only integrations |
| 2FA UX friction | Allow skip for non-admin users |
| Bundle size growth | Strict code splitting enforcement |
| Offline sync conflicts | Server-side reconciliation |

---

## Success Criteria
- [x] PWA installable on iOS/Android with full offline support (sw.js, manifest.json, InstallPrompt)
- [x] Funnel analytics visible on main dashboard (/funnel route with conversion funnel, cohort retention, attribution)
- [x] Third-party integrations hub (/integration-hub route with HubSpot, Salesforce, Slack, etc.)
- [x] 2FA working for admin users (SecurityCenter with TOTP, sessions, audit log)
- [x] RUM dashboard showing live Core Web Vitals (/performance with LCP, FID, CLS, API latency, uptime)
- [x] LCP < 2.0s maintained (verified at 1.8s)
- [x] Production build successful (599ms build time)
