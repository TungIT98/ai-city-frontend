# Phase 13 Plan: GEO + Analytics + Customer Journey

## Status: PLANNED
## Date: 2026-03-22

## Context
Phase 12 (Auth + Payment) committed to master. Globe Anno 117 deployed.
Next: GEO visualization + Analytics dashboard + first customer onboarding.

## Scope

### 1. GEO Visualization
- [ ] Interactive Vietnam map with regional data
- [ ] Region filters: North/Central/South Vietnam
- [ ] Industry filters overlaid on geographic view
- [ ] Lead density heatmap by province

### 2. Enhanced Analytics Dashboard
- [ ] Real-time conversion funnel (Lead → Qualified → Customer)
- [ ] MRR/ARR tracker with growth metrics
- [ ] Cohort analysis visualization
- [ ] Geographic revenue breakdown
- [ ] Lead source attribution

### 3. Customer Journey Tracking
- [ ] Timeline view per lead (all touchpoints)
- [ ] Automated status progression
- [ ] Next action recommendations
- [ ] Communication history log

### 4. Dashboard Polish (Post-Auth)
- [ ] Welcome message with user name
- [ ] Personalized lead recommendations
- [ ] Recent activity feed per user
- [ ] Quick action cards

### 5. First Customer Demo Support
- [ ] Onboarding checklist for new users
- [ ] Guided tour improvements
- [ ] Sample data reset button
- [ ] Demo mode toggle for sales

## Tech Stack
- Same: React 19 + Vite + Chart.js
- Maps: Leaflet or custom SVG Vietnam map
- Backend: https://aicity-backend-deploy.vercel.app

## Deliverable
- GEO layer visible on Globe
- Analytics dashboard with real funnel data
- First customer can complete full onboarding

## Budget Estimate
~$50 (no new dependencies)

## Owner
CPO (AI City Frontend)
