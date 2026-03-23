/**
 * AI City Dashboard
 * Main application entry point
 * Phase 8: Globe Optimization, PDF Export, Admin Panel, Email Templates (AIC-800)
 */
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ErrorBoundary } from './components/ErrorBoundary';
import { DemoModeBanner } from './components/DemoModeBanner';
import { OnboardingTour } from './components/OnboardingTour';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import './App.css';

// Lazy load pages for code splitting
const AgentMarketplace = lazy(() => import('./pages/AgentMarketplace'));
const AgentMarketplaceDashboard = lazy(() => import('./pages/AgentMarketplaceDashboard'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Leads = lazy(() => import('./pages/Leads'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Reports = lazy(() => import('./pages/Reports'));
const ReportBuilder = lazy(() => import('./pages/ReportBuilder'));
const Onboarding = lazy(() => import('./pages/Onboarding'));
const Agents = lazy(() => import('./pages/Agents'));
const CEODashboard = lazy(() => import('./pages/CEODashboard'));
const MRRDashboard = lazy(() => import('./pages/MRRDashboard'));
const Globe = lazy(() => import('./pages/Globe'));
const HierarchyView = lazy(() => import('./pages/HierarchyView'));
const AgentFeed = lazy(() => import('./pages/AgentFeed'));
const InsightsPanel = lazy(() => import('./pages/InsightsPanel'));
const Telesales = lazy(() => import('./pages/Telesales'));
const IntegrationHub = lazy(() => import('./pages/IntegrationHub'));
const FunnelAnalytics = lazy(() => import('./pages/FunnelAnalytics'));
const SecurityCenter = lazy(() => import('./pages/SecurityCenter'));
const PerformanceMonitor = lazy(() => import('./pages/PerformanceMonitor'));
const Settings = lazy(() => import('./pages/Settings'));
const Forecasting = lazy(() => import('./pages/Forecasting'));
const Notifications = lazy(() => import('./pages/Notifications'));
const ApiPortal = lazy(() => import('./pages/ApiPortal'));
const AIInsights = lazy(() => import('./pages/AIInsights'));
const NLQuery = lazy(() => import('./pages/NLQuery'));
const AutomationCenter = lazy(() => import('./pages/AutomationCenter'));
const CollaborationHub = lazy(() => import('./pages/CollaborationHub'));
const GlobalSearch = lazy(() => import('./pages/GlobalSearch'));
const CustomizeDashboard = lazy(() => import('./pages/CustomizeDashboard'));
const Admin = lazy(() => import('./pages/Admin'));
const EmailTemplates = lazy(() => import('./pages/EmailTemplates'));
const Payment = lazy(() => import('./pages/Payment'));

function PageLoader() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <div className="loader"></div>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          {/* Skip to main content for accessibility */}
          <a href="#main-content" className="skip-to-content">
            Skip to main content
          </a>
          <DemoModeBanner />
          <OnboardingTour />
          <Suspense fallback={<PageLoader />}>
            <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/landing" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Login />} />
            <Route path="/signup" element={<Login />} />
            <Route path="/agent-marketplace" element={<AgentMarketplace />} />
            <Route
              path="/agent-dashboard"
              element={<ProtectedRoute><Layout><AgentMarketplaceDashboard /></Layout></ProtectedRoute>}
            />
            <Route
              path="/dashboard"
              element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>}
            />
            <Route
              path="/leads"
              element={<ProtectedRoute><Layout><Leads /></Layout></ProtectedRoute>}
            />
            <Route
              path="/analytics"
              element={<ProtectedRoute><Layout><Analytics /></Layout></ProtectedRoute>}
            />
            <Route
              path="/reports"
              element={<ProtectedRoute><Layout><Reports /></Layout></ProtectedRoute>}
            />
            <Route
              path="/report-builder"
              element={<ProtectedRoute><Layout><ReportBuilder /></Layout></ProtectedRoute>}
            />
            <Route
              path="/onboarding"
              element={<ProtectedRoute><Layout><Onboarding /></Layout></ProtectedRoute>}
            />
            <Route
              path="/agents"
              element={<ProtectedRoute><Layout><Agents /></Layout></ProtectedRoute>}
            />
            <Route
              path="/ceo-dashboard"
              element={<ProtectedRoute requiredPermission="read"><Layout><CEODashboard /></Layout></ProtectedRoute>}
            />
            <Route
              path="/mrr-dashboard"
              element={<ProtectedRoute><Layout><MRRDashboard /></Layout></ProtectedRoute>}
            />
            <Route
              path="/globe"
              element={<ProtectedRoute><Layout><Globe /></Layout></ProtectedRoute>}
            />
            <Route
              path="/hierarchy"
              element={<ProtectedRoute><Layout><HierarchyView /></Layout></ProtectedRoute>}
            />
            <Route
              path="/agent-feed"
              element={<ProtectedRoute><Layout><AgentFeed /></Layout></ProtectedRoute>}
            />
            <Route
              path="/insights"
              element={<ProtectedRoute><Layout><InsightsPanel /></Layout></ProtectedRoute>}
            />
            <Route
              path="/telesales"
              element={<ProtectedRoute><Layout><Telesales /></Layout></ProtectedRoute>}
            />
            <Route
              path="/integration-hub"
              element={<ProtectedRoute><Layout><IntegrationHub /></Layout></ProtectedRoute>}
            />
            <Route
              path="/funnel"
              element={<ProtectedRoute><Layout><FunnelAnalytics /></Layout></ProtectedRoute>}
            />
            <Route
              path="/security"
              element={<ProtectedRoute requiredPermission="admin"><Layout><SecurityCenter /></Layout></ProtectedRoute>}
            />
            <Route
              path="/performance"
              element={<ProtectedRoute><Layout><PerformanceMonitor /></Layout></ProtectedRoute>}
            />
            <Route
              path="/settings"
              element={<ProtectedRoute><Layout><Settings /></Layout></ProtectedRoute>}
            />
            <Route
              path="/forecasting"
              element={<ProtectedRoute><Layout><Forecasting /></Layout></ProtectedRoute>}
            />
            <Route
              path="/notifications"
              element={<ProtectedRoute><Layout><Notifications /></Layout></ProtectedRoute>}
            />
            <Route
              path="/api-portal"
              element={<ProtectedRoute requiredPermission="read"><Layout><ApiPortal /></Layout></ProtectedRoute>}
            />
            <Route
              path="/ai-insights"
              element={<ProtectedRoute><Layout><AIInsights /></Layout></ProtectedRoute>}
            />
            <Route
              path="/nl-query"
              element={<ProtectedRoute><Layout><NLQuery /></Layout></ProtectedRoute>}
            />
            <Route
              path="/automation"
              element={<ProtectedRoute><Layout><AutomationCenter /></Layout></ProtectedRoute>}
            />
            <Route
              path="/collaboration"
              element={<ProtectedRoute><Layout><CollaborationHub /></Layout></ProtectedRoute>}
            />
            <Route
              path="/search"
              element={<ProtectedRoute><Layout><GlobalSearch /></Layout></ProtectedRoute>}
            />
            <Route
              path="/dashboard/customize"
              element={<ProtectedRoute><Layout><CustomizeDashboard /></Layout></ProtectedRoute>}
            />
            <Route
              path="/admin"
              element={<ProtectedRoute requiredPermission="admin"><Layout><Admin /></Layout></ProtectedRoute>}
            />
            <Route
              path="/email-templates"
              element={<ProtectedRoute><Layout><EmailTemplates /></Layout></ProtectedRoute>}
            />
            <Route
              path="/payment"
              element={<ProtectedRoute><Layout><Payment /></Layout></ProtectedRoute>}
            />
          </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;