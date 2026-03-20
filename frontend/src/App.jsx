/**
 * AI City Dashboard
 * Main application entry point
 */
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import './App.css';

// Lazy load pages for code splitting
const AgentMarketplace = lazy(() => import('./pages/AgentMarketplace'));
const AgentMarketplaceDashboard = lazy(() => import('./pages/AgentMarketplaceDashboard'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Leads = lazy(() => import('./pages/Leads'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Reports = lazy(() => import('./pages/Reports'));
const Onboarding = lazy(() => import('./pages/Onboarding'));
const Agents = lazy(() => import('./pages/Agents'));
const CEODashboard = lazy(() => import('./pages/CEODashboard'));
const MRRDashboard = lazy(() => import('./pages/MRRDashboard'));
const Globe = lazy(() => import('./pages/Globe'));
const HierarchyView = lazy(() => import('./pages/HierarchyView'));
const AgentFeed = lazy(() => import('./pages/AgentFeed'));
const InsightsPanel = lazy(() => import('./pages/InsightsPanel'));
const Telesales = lazy(() => import('./pages/Telesales'));

function PageLoader() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <div className="loader"></div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/agent-marketplace" element={<AgentMarketplace />} />
          <Route path="/agent-dashboard" element={<Layout><AgentMarketplaceDashboard /></Layout>} />
          <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
          <Route path="/leads" element={<Layout><Leads /></Layout>} />
          <Route path="/analytics" element={<Layout><Analytics /></Layout>} />
          <Route path="/reports" element={<Layout><Reports /></Layout>} />
          <Route path="/onboarding" element={<Layout><Onboarding /></Layout>} />
          <Route path="/agents" element={<Layout><Agents /></Layout>} />
          <Route path="/ceo-dashboard" element={<Layout><CEODashboard /></Layout>} />
          <Route path="/mrr-dashboard" element={<Layout><MRRDashboard /></Layout>} />
          <Route path="/globe" element={<Layout><Globe /></Layout>} />
          <Route path="/hierarchy" element={<Layout><HierarchyView /></Layout>} />
          <Route path="/agent-feed" element={<Layout><AgentFeed /></Layout>} />
          <Route path="/insights" element={<Layout><InsightsPanel /></Layout>} />
          <Route path="/telesales" element={<Layout><Telesales /></Layout>} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;