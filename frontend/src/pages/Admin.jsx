/**
 * AI City Admin Panel
 * Phase 8: AIC-802 - User, Workspace, Team Management & Audit
 */
import { useState, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './Admin.css';

const ROLES = ['admin', 'manager', 'agent', 'viewer'];

const MOCK_USERS = [
  { id: 1, name: 'Nguyen Van A', email: 'nguyenva@aicity.com', role: 'admin', team: 'Frontend', status: 'active', lastActive: '2026-03-21T10:30:00', loginCount: 342 },
  { id: 2, name: 'Tran Thi B', email: 'tranthib@aicity.com', role: 'manager', team: 'Marketing', status: 'active', lastActive: '2026-03-21T09:15:00', loginCount: 289 },
  { id: 3, name: 'Le Van C', email: 'levanc@aicity.com', role: 'agent', team: 'Sales', status: 'active', lastActive: '2026-03-20T18:45:00', loginCount: 156 },
  { id: 4, name: 'Pham Thi D', email: 'phamthid@aicity.com', role: 'agent', team: 'Backend', status: 'inactive', lastActive: '2026-03-15T14:20:00', loginCount: 78 },
  { id: 5, name: 'Hoang Van E', email: 'hoangvae@aicity.com', role: 'viewer', team: 'Operations', status: 'active', lastActive: '2026-03-21T08:00:00', loginCount: 45 },
  { id: 6, name: 'Vo Thi F', email: 'vothif@aicity.com', role: 'manager', team: 'Sales', status: 'active', lastActive: '2026-03-21T11:00:00', loginCount: 201 },
  { id: 7, name: 'Dinh Van G', email: 'dinhvg@aicity.com', role: 'agent', team: 'DevOps', status: 'pending', lastActive: null, loginCount: 0 },
];

const MOCK_AUDIT = [
  { id: 1, action: 'user.login', user: 'Nguyen Van A', ip: '192.168.1.1', timestamp: '2026-03-21T10:30:00', status: 'success', details: 'Login successful' },
  { id: 2, action: 'user.create', user: 'Tran Thi B', ip: '192.168.1.2', timestamp: '2026-03-21T09:00:00', status: 'success', details: 'New user invited' },
  { id: 3, action: 'user.role_change', user: 'Admin', ip: '192.168.1.1', timestamp: '2026-03-21T08:45:00', status: 'success', details: 'Le Van C: agent → manager' },
  { id: 4, action: 'report.export', user: 'Nguyen Van A', ip: '192.168.1.1', timestamp: '2026-03-20T16:00:00', status: 'success', details: 'PDF export: Weekly Summary' },
  { id: 5, action: 'auth.fail', user: 'Unknown', ip: '45.33.32.156', timestamp: '2026-03-20T14:22:00', status: 'failed', details: 'Invalid credentials (3 attempts)' },
  { id: 6, action: 'api_key.create', user: 'Tran Thi B', ip: '192.168.1.2', timestamp: '2026-03-20T10:00:00', status: 'success', details: 'New API key created: sk_live_...x7y2' },
];

const MOCK_API_USAGE = [
  { endpoint: '/api/leads', method: 'GET', calls: 12450, avgLatency: 45, p95Latency: 120, errors: 12 },
  { endpoint: '/api/analytics', method: 'GET', calls: 8910, avgLatency: 89, p95Latency: 250, errors: 5 },
  { endpoint: '/api/reports', method: 'GET', calls: 2340, avgLatency: 210, p95Latency: 450, errors: 2 },
  { endpoint: '/api/auth/login', method: 'POST', calls: 1890, avgLatency: 120, p95Latency: 300, errors: 45 },
  { endpoint: '/api/agents', method: 'GET', calls: 5670, avgLatency: 38, p95Latency: 95, errors: 3 },
];

const MOCK_TEAMS = [
  { id: 1, name: 'Frontend', lead: 'Nguyen Van A', members: 4, activeAgents: 12, weeklyRevenue: 425000 },
  { id: 2, name: 'Backend', lead: 'Le Chi K', members: 3, activeAgents: 8, weeklyRevenue: 380000 },
  { id: 3, name: 'Marketing', lead: 'Tran Thi B', members: 3, activeAgents: 6, weeklyRevenue: 295000 },
  { id: 4, name: 'Sales', lead: 'Vo Thi F', members: 5, activeAgents: 10, weeklyRevenue: 512000 },
  { id: 5, name: 'DevOps', lead: 'Dinh Van G', members: 2, activeAgents: 4, weeklyRevenue: 198000 },
];

const MOCK_WORKSPACES = [
  { id: 1, name: 'AI City Main', url: 'aicity', plan: 'Enterprise', users: 24, apiCalls: 45890, createdAt: '2025-01-15' },
  { id: 2, name: 'AI City Dev', url: 'aicity-dev', plan: 'Pro', users: 8, apiCalls: 12340, createdAt: '2025-06-20' },
  { id: 3, name: 'AIC Vietnam', url: 'aic-vn', plan: 'Pro', users: 12, apiCalls: 8920, createdAt: '2025-09-10' },
];

function AdminPage() {
  const { hasPermission, currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState(MOCK_USERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('agent');

  const canAccess = currentUser?.role === 'admin';

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchSearch = !searchQuery || u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchRole = roleFilter === 'all' || u.role === roleFilter;
      return matchSearch && matchRole;
    });
  }, [users, searchQuery, roleFilter]);

  const stats = useMemo(() => ({
    totalUsers: users.length,
    activeUsers: users.filter(u => u.status === 'active').length,
    apiCallsToday: 45890,
    errorRate: '0.12%',
    teamCount: MOCK_TEAMS.length,
    workspaceCount: MOCK_WORKSPACES.length,
  }), [users]);

  const handleInvite = () => {
    if (!inviteEmail) return;
    const newUser = {
      id: Date.now(),
      name: inviteEmail.split('@')[0],
      email: inviteEmail,
      role: inviteRole,
      team: 'Unassigned',
      status: 'pending',
      lastActive: null,
      loginCount: 0,
    };
    setUsers(prev => [...prev, newUser]);
    setInviteEmail('');
    setShowInviteModal(false);
  };

  const handleRoleChange = (userId, newRole) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
  };

  const handleStatusToggle = (userId) => {
    setUsers(prev => prev.map(u => {
      if (u.id !== userId) return u;
      return { ...u, status: u.status === 'active' ? 'inactive' : 'active' };
    }));
  };

  const formatDate = (ts) => ts ? new Date(ts).toLocaleString('vi-VN') : 'Never';

  if (!canAccess) {
    return (
      <div className="admin-page">
        <div className="admin-access-denied">
          <h2>Access Denied</h2>
          <p>You need admin permissions to access this page.</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'users', label: 'Users', count: users.length },
    { id: 'teams', label: 'Teams', count: MOCK_TEAMS.length },
    { id: 'workspaces', label: 'Workspaces', count: MOCK_WORKSPACES.length },
    { id: 'audit', label: 'Audit Log', count: MOCK_AUDIT.length },
    { id: 'api', label: 'API Usage', count: MOCK_API_USAGE.length },
  ];

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Admin Panel</h1>
        <p className="admin-subtitle">Manage users, teams, workspaces, and system settings</p>
      </div>

      <div className="admin-stats-grid">
        {[
          { label: 'Total Users', value: stats.totalUsers, icon: '👥' },
          { label: 'Active Users', value: stats.activeUsers, icon: '✅' },
          { label: 'API Calls Today', value: stats.apiCallsToday.toLocaleString(), icon: '📡' },
          { label: 'Error Rate', value: stats.errorRate, icon: '⚠️' },
          { label: 'Teams', value: stats.teamCount, icon: '🏢' },
          { label: 'Workspaces', value: stats.workspaceCount, icon: '🌐' },
        ].map((stat, i) => (
          <div className="admin-stat-card" key={i}>
            <span className="stat-icon">{stat.icon}</span>
            <div className="stat-info">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="admin-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`admin-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
            <span className="tab-count">{tab.count}</span>
          </button>
        ))}
      </div>

      <div className="admin-content">
        {activeTab === 'users' && (
          <div className="admin-section">
            <div className="section-toolbar">
              <div className="search-filter">
                <input type="text" placeholder="Search users..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="admin-search" />
                <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="admin-filter">
                  <option value="all">All Roles</option>
                  {ROLES.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
                </select>
              </div>
              <button className="btn-primary" onClick={() => setShowInviteModal(true)}>+ Invite User</button>
            </div>
            <div className="admin-table-wrapper">
              <table className="admin-table" aria-label="Users table">
                <thead>
                  <tr>
                    <th scope="col">User</th>
                    <th scope="col">Role</th>
                    <th scope="col">Team</th>
                    <th scope="col">Status</th>
                    <th scope="col">Last Active</th>
                    <th scope="col">Logins</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(user => (
                    <tr key={user.id}>
                      <td>
                        <div className="user-cell">
                          <div className="user-avatar">{user.name[0]}</div>
                          <div>
                            <div className="user-name">{user.name}</div>
                            <div className="user-email">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <select value={user.role} onChange={e => handleRoleChange(user.id, e.target.value)} className="role-select">
                          {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                      </td>
                      <td>{user.team}</td>
                      <td><span className={`status-badge status-${user.status}`}>{user.status}</span></td>
                      <td>{formatDate(user.lastActive)}</td>
                      <td>{user.loginCount}</td>
                      <td>
                        <button
                          className={`btn-icon ${user.status === 'active' ? 'btn-danger' : 'btn-success'}`}
                          onClick={() => handleStatusToggle(user.id)}
                          title={user.status === 'active' ? 'Deactivate' : 'Activate'}
                        >
                          {user.status === 'active' ? '⛔' : '✅'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {showInviteModal && (
              <div className="modal-overlay" onClick={() => setShowInviteModal(false)}>
                <div className="modal-content" onClick={e => e.stopPropagation()}>
                  <h3>Invite New User</h3>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input type="email" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} placeholder="user@example.com" autoFocus />
                  </div>
                  <div className="form-group">
                    <label>Role</label>
                    <select value={inviteRole} onChange={e => setInviteRole(e.target.value)}>
                      {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div className="modal-actions">
                    <button className="btn-secondary" onClick={() => setShowInviteModal(false)}>Cancel</button>
                    <button className="btn-primary" onClick={handleInvite}>Send Invite</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'teams' && (
          <div className="admin-section">
            <div className="section-toolbar">
              <h3>Teams ({MOCK_TEAMS.length})</h3>
              <button className="btn-primary">+ Create Team</button>
            </div>
            <div className="teams-grid">
              {MOCK_TEAMS.map(team => (
                <div className="team-card" key={team.id}>
                  <div className="team-header">
                    <div className="team-icon">{team.name[0]}</div>
                    <div>
                      <h4>{team.name}</h4>
                      <span className="team-lead">Lead: {team.lead}</span>
                    </div>
                  </div>
                  <div className="team-stats">
                    <div className="team-stat"><span className="value">{team.members}</span><span className="label">Members</span></div>
                    <div className="team-stat"><span className="value">{team.activeAgents}</span><span className="label">AI Agents</span></div>
                    <div className="team-stat"><span className="value">${(team.weeklyRevenue / 1000).toFixed(0)}k</span><span className="label">Weekly Rev</span></div>
                  </div>
                  <div className="team-actions">
                    <button className="btn-small">Manage</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'workspaces' && (
          <div className="admin-section">
            <div className="section-toolbar">
              <h3>Workspaces ({MOCK_WORKSPACES.length})</h3>
              <button className="btn-primary">+ Create Workspace</button>
            </div>
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr><th>Workspace</th><th>Plan</th><th>Users</th><th>API Calls</th><th>Created</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {MOCK_WORKSPACES.map(ws => (
                    <tr key={ws.id}>
                      <td>
                        <div className="ws-cell">
                          <span className="ws-name">{ws.name}</span>
                          <span className="ws-url">/{ws.url}</span>
                        </div>
                      </td>
                      <td><span className="plan-badge">{ws.plan}</span></td>
                      <td>{ws.users}</td>
                      <td>{ws.apiCalls.toLocaleString()}</td>
                      <td>{ws.createdAt}</td>
                      <td><button className="btn-small">Settings</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="admin-section">
            <div className="section-toolbar">
              <h3>System Audit Log ({MOCK_AUDIT.length})</h3>
              <button className="btn-secondary" onClick={() => {
                const csv = MOCK_AUDIT.map(e => `${e.timestamp},${e.action},${e.user},${e.status},${e.details}`).join('\n');
                const blob = new Blob(['timestamp,action,user,status,details\n' + csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'audit-log.csv';
                a.click();
              }}>Export CSV</button>
            </div>
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr><th>Timestamp</th><th>Action</th><th>User</th><th>IP</th><th>Status</th><th>Details</th></tr>
                </thead>
                <tbody>
                  {MOCK_AUDIT.map(entry => (
                    <tr key={entry.id}>
                      <td className="timestamp">{formatDate(entry.timestamp)}</td>
                      <td><code className="action-code">{entry.action}</code></td>
                      <td>{entry.user}</td>
                      <td className="ip">{entry.ip}</td>
                      <td><span className={`status-badge status-${entry.status}`}>{entry.status}</span></td>
                      <td className="details">{entry.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'api' && (
          <div className="admin-section">
            <div className="section-toolbar"><h3>API Usage Overview</h3></div>
            <div className="api-summary">
              <div className="api-stat"><span className="value">45,890</span><span className="label">Total Calls</span></div>
              <div className="api-stat"><span className="value">72ms</span><span className="label">Avg Latency</span></div>
              <div className="api-stat"><span className="value">215ms</span><span className="label">P95 Latency</span></div>
              <div className="api-stat"><span className="value">0.12%</span><span className="label">Error Rate</span></div>
            </div>
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr><th>Endpoint</th><th>Method</th><th>Total Calls</th><th>Avg</th><th>P95</th><th>Errors</th><th>Health</th></tr>
                </thead>
                <tbody>
                  {MOCK_API_USAGE.map((row, i) => (
                    <tr key={i}>
                      <td><code>{row.endpoint}</code></td>
                      <td><span className={`method method-${row.method.toLowerCase()}`}>{row.method}</span></td>
                      <td>{row.calls.toLocaleString()}</td>
                      <td>{row.avgLatency}ms</td>
                      <td>{row.p95Latency}ms</td>
                      <td className={row.errors > 10 ? 'text-red' : ''}>{row.errors}</td>
                      <td>
                        <div className="health-bar">
                          <div className="health-fill" style={{ width: `${Math.max(0, 100 - (row.avgLatency / 3) - (row.errors * 2))}%`, background: row.errors > 10 ? '#ef4444' : row.avgLatency > 150 ? '#eab308' : '#22c55e' }} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPage;
