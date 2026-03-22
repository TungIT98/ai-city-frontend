# AI City - Phase 8 Plan

## Status: PLANNED

## Timeline
- **Duration**: 1 week
- **Goal**: Final Polish, Globe Optimization, PDF Export, Admin Panel & Email Templates

---

## Priority Features

### 1. Globe Chunk Optimization (AIC-800)
- **Problem**: globe.gl is 507KB gzipped (~57% of total bundle)
- **Solution**: Replace globe.gl with lightweight Canvas-based globe using world-atlas GeoJSON + D3 projections
- **Target**: Reduce globe chunk from 507KB to < 50KB gzipped
- **Maintain**: All existing functionality (agent dots, task arcs, revenue heatmap, tooltips)
- **Fallback**: Static SVG globe for very slow connections

### 2. PDF Report Export (AIC-801)
- **jsPDF Integration**: Export dashboard pages and reports as PDF
- **Multi-page PDF**: Support for multi-page reports with headers/footers
- **Chart to PDF**: Convert Chart.js charts to PDF with proper formatting
- **Template Reports**: Pre-built report templates (Weekly Summary, Monthly MRR, Lead Pipeline)
- **PDF Preview**: In-browser PDF preview before download

### 3. Admin Panel (AIC-802)
- **User Management**: CRUD operations for users (invite, edit role, deactivate)
- **Workspace Management**: Create/manage multiple workspaces
- **Team Management**: Assign users to teams, manage team permissions
- **Audit Dashboard**: System-wide audit log with filtering
- **API Usage Dashboard**: Per-workspace API call tracking
- **Billing Overview**: Subscription status, usage limits

### 4. Email Template Editor (AIC-803)
- **Visual Editor**: WYSIWYG email template builder for notifications
- **Template Library**: Pre-built templates (Welcome, Lead Alert, Report Ready, etc.)
- **Variable Interpolation**: Dynamic fields (user.name, report.date, etc.)
- **Preview Mode**: Live preview with sample data
- **Test Send**: Send test emails to validate templates

### 5. Final Polish & Edge Cases (AIC-804)
- **Onboarding Flow Enhancement**: Step-by-step interactive tour for new users
- **Notification Preferences**: Granular per-channel notification settings
- **Data Refresh**: Pull-to-refresh on all list views
- **Empty States**: Beautiful empty state illustrations for all list views
- **Error State Design**: Consistent error state UI across all pages
- **Print Styles**: Print-optimized CSS for reports
- **Favicon & Branding**: Custom favicon, app icons

---

## New Pages (Phase 8)

### New Routes:
34. **Admin Panel** (`/admin`) - User, workspace, and team management
35. **Email Templates** (`/email-templates`) - Email template editor and library
36. **PDF Report Viewer** (`/reports/:id/pdf`) - In-browser PDF preview

---

## Technical Requirements

### Dependencies
- `jspdf` - PDF generation
- `jspdf-autotable` - PDF table formatting
- `html2canvas` - Chart-to-image conversion for PDF
- `quill` or `@tiptap/react` - Rich text email editor
- `world-atlas` - GeoJSON for lightweight globe (replaces globe.gl)

### API Endpoints (Expected)
- `GET /admin/users` - List all users
- `POST /admin/users/invite` - Invite user
- `PUT /admin/users/:id` - Update user
- `DELETE /admin/users/:id` - Deactivate user
- `GET /admin/workspaces` - List workspaces
- `POST /admin/workspaces` - Create workspace
- `GET /admin/audit-log` - System audit log
- `GET /admin/api-usage` - API usage metrics
- `GET /email-templates` - List templates
- `POST /email-templates` - Create template
- `PUT /email-templates/:id` - Update template
- `POST /email-templates/:id/test` - Send test email

---

## Performance Targets
- **LCP**: < 1.2s (from 1.8s - Globe reduction + optimizations)
- **FID**: < 30ms (improve from 45ms)
- **CLS**: < 0.02 (improve from 0.04)
- **Total Gzipped**: < 600KB (from ~900KB)
- **Globe Chunk**: < 50KB gzipped (from 507KB)
- **Initial JS**: < 150KB gzipped
- **Build Time**: < 1.5s

---

## Budget
- **Estimated Cost**: $0/month
- All features use open-source libraries
- jsPDF + world-atlas are lightweight alternatives

---

## Milestones

### Day 1: Globe Optimization
- Remove globe.gl dependency
- Implement lightweight Canvas-based globe with world-atlas GeoJSON
- Maintain all 3 data layers (agents, tasks, revenue)
- Test all globe interactions (tooltips, layer toggle, view modes)

### Day 2: PDF Export
- Install jsPDF + html2canvas
- Implement basic PDF export (single page)
- Add chart-to-PDF conversion
- Implement multi-page report generation
- Add PDF preview modal

### Day 3: Admin Panel
- Create Admin page with tabbed layout (Users, Workspaces, Teams, Audit, API Usage)
- Implement user management table with actions
- Add workspace management cards
- Integrate with existing AuthContext for admin-only access

### Day 4: Email Template Editor
- Create EmailTemplates page
- Implement template list with preview thumbnails
- Build WYSIWYG editor using React Quill
- Add variable insertion toolbar
- Implement preview with sample data

### Day 5: Polish & Final Testing
- Add onboarding tour (react-joyride or custom)
- Design empty states for all list views
- Implement print-optimized CSS
- Add custom favicon and meta tags
- Final performance audit
- Production build verification

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Globe replacement loses fidelity | Canvas globe replicates all 3 layers + interactions |
| PDF generation memory issues | Use streaming/chunked generation for large reports |
| Admin panel complexity | Start with read-only views, add write actions incrementally |
| Email editor complexity | Use established library (React Quill) |

---

## Success Criteria
- [ ] Globe loads in < 50KB gzipped (vs 507KB)
- [ ] PDF export works for all report types (single + multi-page)
- [ ] Admin panel accessible for admin role users
- [ ] Email template editor with WYSIWYG editing
- [ ] LCP < 1.2s maintained
- [ ] Total bundle < 600KB gzipped
- [ ] Production build successful
- [ ] All 35 pages functional
