/**
 * Layout Component
 * Main dashboard layout with navigation
 */
import { Link, useLocation } from 'react-router-dom';
import NotificationBell from './NotificationBell';
import ConnectionStatus from './ConnectionStatus';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import InstallPrompt from './InstallPrompt';
import { Search, Menu, X } from 'lucide-react';
import { useState } from 'react';
import './Layout.css';

const Layout = ({ children }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/ceo-dashboard', label: 'CEO Dashboard', icon: '🏢' },
    { path: '/mrr-dashboard', label: 'MRR Dashboard', icon: '💰' },
    { path: '/forecasting', label: 'Forecasting', icon: '🔮' },
    { path: '/globe', label: '3D Globe', icon: '🌍' },
    { path: '/hierarchy', label: 'Hierarchy', icon: '🏢' },
    { path: '/agent-feed', label: 'Agent Feed', icon: '📱' },
    { path: '/insights', label: 'AI Insights', icon: '💡' },
    { path: '/ai-insights', label: 'AI Insights Engine', icon: '🧠' },
    { path: '/nl-query', label: 'NL Query', icon: '💬' },
    { path: '/automation', label: 'Automation', icon: '⚙️' },
    { path: '/collaboration', label: 'Collaboration', icon: '👥' },
    { path: '/agents', label: 'AI Agents', icon: '🤖' },
    { path: '/agent-dashboard', label: 'Agent Marketplace', icon: '🛒' },
    { path: '/leads', label: 'Leads', icon: '👥' },
    { path: '/telesales', label: 'Telesales', icon: '📞' },
    { path: '/analytics', label: 'Analytics', icon: '📈' },
    { path: '/funnel', label: 'Funnel', icon: '🎯' },
    { path: '/reports', label: 'Reports', icon: '📋' },
    { path: '/report-builder', label: 'Report Builder', icon: '🛠️' },
    { path: '/integration-hub', label: 'Integrations', icon: '🔌' },
    { path: '/notifications', label: 'Notifications', icon: '🔔' },
    { path: '/api-portal', label: 'API Portal', icon: '📖' },
    { path: '/security', label: 'Security', icon: '🔒' },
    { path: '/performance', label: 'Performance', icon: '⚡' },
    { path: '/settings', label: 'Settings', icon: '⚙️' },
    { path: '/onboarding', label: 'Onboarding', icon: '🚀' },
    { path: '/search', label: 'Global Search', icon: '🔍' },
    { path: '/dashboard/customize', label: 'Customize', icon: '🎨' },
    { path: '/admin', label: 'Admin', icon: '🛡️' },
    { path: '/email-templates', label: 'Email Templates', icon: '📧' },
  ];

  // Mobile bottom nav items
  const mobileNavItems = navItems.filter(item =>
    ['/dashboard', '/globe', '/leads', '/analytics', '/notifications'].includes(item.path)
  );

  return (
    <div className="layout">
      {/* Mobile header */}
      <header className="mobile-header">
        <button className="hamburger-btn" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Toggle menu">
          {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
        <span className="mobile-logo">AI City</span>
        <Link to="/search" className="header-search-btn" title="Global Search">
          <Search size={18} />
        </Link>
      </header>

      {/* Sidebar overlay for mobile */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="logo">
          <button className="mobile-close-btn" onClick={() => setSidebarOpen(false)} aria-label="Close menu">
            <X size={20} />
          </button>
          <h1>AI City</h1>
          <span className="subtitle">Dashboard</span>
        </div>
        <nav className="nav">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="sidebar-footer">
          <NotificationBell />
          <button className="theme-toggle" onClick={toggleTheme} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <LanguageSwitcher />
          <div className="user-menu">
            <div className="user-info">
              <div className="user-avatar">👤</div>
              <div className="user-details">
                <span className="user-name">{user?.name || 'User'}</span>
                <span className="user-role">{user?.role || 'viewer'}</span>
              </div>
            </div>
            <button className="logout-btn" onClick={logout} title="Logout">🚪</button>
          </div>
        </div>
      </aside>
      <main id="main-content" className="main-content" tabIndex="-1">
        <div className="content-header">
          <ConnectionStatus />
        </div>
        {children}
      </main>
      {/* Mobile bottom navigation */}
      <nav className="mobile-bottom-nav">
        {mobileNavItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={`mobile-nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </Link>
        ))}
      </nav>
      <InstallPrompt />
    </div>
  );
};

export default Layout;
