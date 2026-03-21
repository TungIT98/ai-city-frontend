/**
 * Layout Component
 * Main dashboard layout with navigation
 */
import { Link, useLocation } from 'react-router-dom';
import './Layout.css';

const Layout = ({ children }) => {
  const location = useLocation();
  const isOnboarding = location.pathname === '/onboarding';

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/ceo-dashboard', label: 'CEO Dashboard', icon: '🏢' },
    { path: '/mrr-dashboard', label: 'MRR Dashboard', icon: '💰' },
    { path: '/globe', label: '3D Globe', icon: '🌍' },
    { path: '/hierarchy', label: 'Hierarchy', icon: '🏢' },
    { path: '/agent-feed', label: 'Agent Feed', icon: '📱' },
    { path: '/insights', label: 'AI Insights', icon: '💡' },
    { path: '/agents', label: 'AI Agents', icon: '🤖' },
    { path: '/agent-dashboard', label: 'Agent Marketplace', icon: '🛒' },
    { path: '/leads', label: 'Leads', icon: '👥' },
    { path: '/telesales', label: 'Telesales', icon: '📞' },
    { path: '/analytics', label: 'Analytics', icon: '📈' },
    { path: '/reports', label: 'Reports', icon: '📋' },
    { path: '/onboarding', label: 'Onboarding', icon: '🚀' },
  ];

  return (
    <div className={`layout ${isOnboarding ? 'no-sidebar' : ''}`}>
      {!isOnboarding && (
        <aside className="sidebar">
          <div className="logo">
            <h1>AI City</h1>
            <span className="subtitle">Dashboard</span>
          </div>
          <nav className="nav">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </Link>
            ))}
          </nav>
          <div className="system-status">
            <h3>System Status</h3>
            <div id="status-check">Checking...</div>
          </div>
        </aside>
      )}
      <main className={`main-content ${isOnboarding ? 'full-width' : ''}`}>
        {children}
      </main>
    </div>
  );
};

export default Layout;