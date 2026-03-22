# AI City CPO Phase 10 Plan

**Date**: 2026-03-22
**Phase**: Phase 10 - Collaboration Deep Dive, Mobile Polish, Toast System

## Background

All three top-priority backlog items (Lead Scoring, Drag-Drop Report Builder, Real-Time Dashboard) are already implemented. Phase 10 targets the next priorities from the feature backlog.

## Goals

- Collaboration Features (Priority 6): Full reply threading, emoji reactions, @mentions
- Mobile Polish (Priority 7): Bottom nav, responsive layout improvements
- Toast System: Global real-time toast notifications
- Advanced Visualizations: Interactive funnel chart with drill-down

---

## Task AIC-1001: Collaboration Deep Dive

**Owner**: AI City CPO
**Priority**: High

### 1.1 Reply Threading
- Enable nested replies on comments (max 2 levels)
- Reply button on each comment opens inline reply box
- Replies stored with parent comment ID

### 1.2 Emoji Reactions
- Add reaction picker with 6 emojis: 👍 👎 ❤️ 🎉 👀 🚀
- Display reaction counts per comment
- Toggle reaction on click

### 1.3 @Mentions
- Detect `@username` in comment text
- Highlight mentions visually
- Store mentions array for notification targeting

### 1.4 Dashboard Annotations
- "Annotate" button on Dashboard charts
- Click chart to place annotation marker
- Annotation popover with text input
- Annotations list sidebar on Dashboard

### 1.5 User Presence
- "Who's viewing" indicator on CollaborationHub
- Avatar stack showing online team members
- Last seen timestamps

---

## Task AIC-1002: Mobile Responsive Polish

**Owner**: AI City CPO
**Priority**: Medium

### 2.1 Bottom Tab Navigation
- 5-item bottom nav on mobile (< 768px): Dashboard, Leads, Globe, Reports, More
- Active tab indicator
- Safe area inset for notched phones

### 2.2 Responsive Dashboard Grid
- Single column on mobile (< 640px)
- Two columns on tablet (640-1024px)
- Four columns on desktop (> 1024px)
- Charts resize responsively

### 2.3 Mobile Table Improvements
- Horizontal scroll on leads/tables for mobile
- Sticky first column
- Pull-to-refresh gesture support

---

## Task AIC-1003: Global Toast Notification System

**Owner**: AI City CPO
**Priority**: Medium

### 3.1 Toast Context
- `ToastContext` with `addToast`, `removeToast`
- Toast types: success, error, warning, info
- Auto-dismiss after 5 seconds
- Max 5 toasts visible at once

### 3.2 Toast Component
- Position: top-right (desktop), top-center (mobile)
- Slide-in animation
- Close button per toast
- Progress bar for auto-dismiss

### 3.3 Integration
- Replace `alert()` calls with `addToast()` across all pages
- WebSocket alerts via RealtimeContext → Toast
- Form submission feedback

---

## Task AIC-1004: Advanced Funnel Chart

**Owner**: AI City CPO
**Priority**: Medium

### 4.1 Interactive Funnel
- SVG funnel with clickable stages
- Stage colors: gradient from blue to green
- Hover tooltips with conversion rate
- Click stage for drill-down breakdown

### 4.2 Attribution Model Toggle
- Tabs: First Touch, Last Touch, Linear, Time Decay
- Recalculate funnel data based on model
- Comparison summary cards

---

## Files to Modify

- `src/pages/CollaborationHub.jsx` - Reply threading, emoji reactions, @mentions, presence
- `src/pages/Dashboard.jsx` - Chart annotations, responsive grid
- `src/components/Layout.jsx` - Bottom nav for mobile
- `src/components/Layout.css` - Bottom nav styles, responsive breakpoints
- `src/index.css` - Mobile responsive variables
- `src/contexts/ToastContext.jsx` - New toast context
- `src/components/Toast.jsx` - Toast notification component
- `src/main.jsx` - Wrap app in ToastProvider
- `src/pages/FunnelAnalytics.jsx` - Interactive funnel chart

---

## Metrics

| Metric | Before | Target |
|--------|--------|--------|
| Mobile nav | None | 5-item bottom tabs |
| CollaborationHub | Mock data only | Full reply/reaction/mention |
| Toast system | alert() calls | Context-based toasts |
| Funnel chart | Static | Interactive drill-down |
| Responsive breakpoints | Partial | Full mobile-first |

---

*Reporting to Nova CEO*
