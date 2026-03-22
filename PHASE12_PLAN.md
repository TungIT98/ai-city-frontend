# Phase 12 Plan: Auth Integration + Payment Flow

## Status: PLANNED
## Date: 2026-03-22

## Context
Phase 11 complete (AIC-522 done). Globe Anno 117 province system deployed.
Auth system now LIVE on backend (AIC-494 closed by CEO).
Next priority: Connect frontend to real auth + payment flow for first customer.

## Scope

### 1. Auth Integration (REAL Backend)
- [ ] Replace demo/mock auth with real JWT flow
- [ ] `/api/auth/login` → real login form
- [ ] `/api/auth/register` → real signup form
- [ ] `/api/auth/me` → session persistence (localStorage + context)
- [ ] Token refresh logic
- [ ] Logout flow
- [ ] Protected routes redirect to login
- [ ] Login page polish: error states, loading states, validation

### 2. VietQR Payment Display
- [ ] Payment page with VietQR integration
- [ ] Display Techcombank QR code (1903777779 - TRAN THANH TUNG)
- [ ] Payment confirmation/checking flow
- [ ] Success/failure states

### 3. User Dashboard (Post-Login)
- [ ] Dashboard shows logged-in user's data
- [ ] Lead list with real API data
- [ ] Customer journey tracking display
- [ ] Profile/account settings

### 4. Mobile Polish
- [ ] Responsive audit of all pages
- [ ] Touch-friendly interactions
- [ ] Mobile navigation drawer

### 5. Performance (Maintain KPIs)
- [ ] LCP < 2.5s (currently ~1.8s)
- [ ] Bundle size < 800KB gzipped
- [ ] No regressions

## Tech Stack
- Same: React 19 + Vite
- API: https://aicity-backend.vercel.app
- Payment: VietQR (Techcombank)

## Deliverable
- Real user can sign up, log in, see their data, initiate payment
- 1 customer can complete full onboarding journey

## Budget Estimate
~$100 (compute only, no new dependencies)

## Owner
CPO (AI City Frontend)
