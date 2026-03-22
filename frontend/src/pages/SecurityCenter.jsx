/**
 * Security Center Page (AIC-403)
 * 2FA, session management, audit log
 */
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function SecurityCenter() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('2fa');
  const [show2FASetup, setShow2FASetup] = useState(false);

  const sessions = [
    { id: 1, device: 'Chrome on Windows', location: 'Ho Chi Minh City, VN', ip: '103.xx.xx.xx', lastActive: 'Now', current: true },
    { id: 2, device: 'Safari on iPhone', location: 'Ho Chi Minh City, VN', ip: '103.xx.xx.xx', lastActive: '2 hours ago', current: false },
    { id: 3, device: 'Firefox on macOS', location: 'Hanoi, VN', ip: '14.xx.xx.xx', lastActive: '3 days ago', current: false },
  ];

  const auditLog = [
    { id: 1, action: 'User Login', user: user?.email || 'user@email.com', ip: '103.xx.xx.xx', time: '2026-03-21 14:32:15', status: 'success' },
    { id: 2, action: 'Update Lead Status', user: user?.email || 'user@email.com', ip: '103.xx.xx.xx', time: '2026-03-21 14:28:03', status: 'success' },
    { id: 3, action: 'Export Report', user: user?.email || 'user@email.com', ip: '103.xx.xx.xx', time: '2026-03-21 13:15:22', status: 'success' },
    { id: 4, action: 'API Key Created', user: user?.email || 'user@email.com', ip: '103.xx.xx.xx', time: '2026-03-21 11:45:00', status: 'success' },
    { id: 5, action: 'Failed Login Attempt', user: 'admin@unknown.com', ip: '45.xx.xx.xx', time: '2026-03-21 10:22:11', status: 'failed' },
    { id: 6, action: 'Permission Changed', user: user?.email || 'user@email.com', ip: '103.xx.xx.xx', time: '2026-03-21 09:30:44', status: 'success' },
  ];

  const securityScore = 78;
  const scoreColor = securityScore > 80 ? '#10b981' : securityScore > 60 ? '#f59e0b' : '#ef4444';

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>Security Center</h2>
          <p>Manage 2FA, sessions, and audit logs</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Security Score</span>
          <div style={{ position: 'relative', width: 64, height: 64 }}>
            <svg viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="18" cy="18" r="16" fill="none" stroke="var(--border-color)" strokeWidth="3" />
              <circle cx="18" cy="18" r="16" fill="none" stroke={scoreColor} strokeWidth="3"
                strokeDasharray={`${securityScore} 100`} strokeLinecap="round" />
            </svg>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: 14,
              fontWeight: 700,
              color: scoreColor,
            }}>
              {securityScore}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs" style={{ display: 'flex', gap: 4, marginBottom: 24, borderBottom: '1px solid var(--border-color)', paddingBottom: 0 }}>
        {['2fa', 'sessions', 'audit'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '12px 20px',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 600,
              color: activeTab === tab ? 'var(--primary)' : 'var(--text-muted)',
              borderBottom: activeTab === tab ? '2px solid var(--primary)' : '2px solid transparent',
              marginBottom: -1,
              transition: 'all 0.2s',
              textTransform: 'capitalize',
            }}
          >
            {tab === '2fa' ? '2FA Authentication' : tab === 'sessions' ? 'Active Sessions' : 'Audit Log'}
          </button>
        ))}
      </div>

      {/* 2FA Tab */}
      {activeTab === '2fa' && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Two-Factor Authentication</h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 0', borderBottom: '1px solid var(--border-color)' }}>
            <div>
              <h4 style={{ margin: '0 0 4px', fontSize: 15 }}>Authenticator App (TOTP)</h4>
              <p style={{ margin: 0, fontSize: 13, color: 'var(--text-muted)' }}>Use Google Authenticator, Authy, or any TOTP app</p>
            </div>
            <span style={{
              padding: '6px 16px',
              borderRadius: 20,
              background: 'rgba(16, 185, 129, 0.1)',
              color: '#10b981',
              fontSize: 13,
              fontWeight: 600,
            }}>
              Enabled
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 0', borderBottom: '1px solid var(--border-color)' }}>
            <div>
              <h4 style={{ margin: '0 0 4px', fontSize: 15 }}>SMS Recovery</h4>
              <p style={{ margin: 0, fontSize: 13, color: 'var(--text-muted)' }}>Receive codes via SMS as backup</p>
            </div>
            <span style={{
              padding: '6px 16px',
              borderRadius: 20,
              background: 'rgba(239, 68, 68, 0.1)',
              color: '#ef4444',
              fontSize: 13,
              fontWeight: 600,
            }}>
              Disabled
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 0' }}>
            <div>
              <h4 style={{ margin: '0 0 4px', fontSize: 15 }}>Backup Codes</h4>
              <p style={{ margin: 0, fontSize: 13, color: 'var(--text-muted)' }}>5 recovery codes generated</p>
            </div>
            <button style={{
              padding: '8px 16px',
              border: '1px solid var(--border-color)',
              borderRadius: 8,
              background: 'transparent',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 500,
            }}>
              Regenerate
            </button>
          </div>
        </div>
      )}

      {/* Sessions Tab */}
      {activeTab === 'sessions' && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Active Sessions</h3>
            <button style={{
              padding: '8px 16px',
              border: 'none',
              borderRadius: 8,
              background: '#ef4444',
              color: 'white',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 600,
            }}>
              Revoke All Others
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {sessions.map(session => (
              <div key={session.id} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 16,
                background: 'var(--bg-primary)',
                borderRadius: 12,
                border: session.current ? '1px solid var(--primary)' : '1px solid var(--border-color)',
              }}>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                  <div style={{ fontSize: 24 }}>💻</div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 14, fontWeight: 600 }}>{session.device}</span>
                      {session.current && (
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: 4,
                          background: 'rgba(79, 172, 254, 0.1)',
                          color: 'var(--primary)',
                          fontSize: 11,
                          fontWeight: 600,
                        }}>
                          Current
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                      {session.location} • {session.ip} • {session.lastActive}
                    </div>
                  </div>
                </div>
                {!session.current && (
                  <button style={{
                    padding: '6px 12px',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: 6,
                    background: 'transparent',
                    color: '#ef4444',
                    cursor: 'pointer',
                    fontSize: 12,
                    fontWeight: 500,
                  }}>
                    Revoke
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Audit Log Tab */}
      {activeTab === 'audit' && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Audit Log</h3>
            <div style={{ display: 'flex', gap: 8 }}>
              <select style={{
                padding: '8px 12px',
                border: '1px solid var(--border-color)',
                borderRadius: 8,
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                fontSize: 13,
              }}>
                <option>All Actions</option>
                <option>Login/Logout</option>
                <option>Data Changes</option>
                <option>Admin Actions</option>
              </select>
              <button style={{
                padding: '8px 16px',
                border: '1px solid var(--border-color)',
                borderRadius: 8,
                background: 'transparent',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 500,
              }}>
                Export CSV
              </button>
            </div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: 12, color: 'var(--text-muted)', borderBottom: '1px solid var(--border-color)' }}>Action</th>
                  <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: 12, color: 'var(--text-muted)', borderBottom: '1px solid var(--border-color)' }}>User</th>
                  <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: 12, color: 'var(--text-muted)', borderBottom: '1px solid var(--border-color)' }}>IP Address</th>
                  <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: 12, color: 'var(--text-muted)', borderBottom: '1px solid var(--border-color)' }}>Timestamp</th>
                  <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: 12, color: 'var(--text-muted)', borderBottom: '1px solid var(--border-color)' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {auditLog.map(log => (
                  <tr key={log.id}>
                    <td style={{ padding: '12px 8px', fontSize: 13, fontWeight: 500, borderBottom: '1px solid var(--border-color)' }}>{log.action}</td>
                    <td style={{ padding: '12px 8px', fontSize: 13, color: 'var(--text-muted)', borderBottom: '1px solid var(--border-color)' }}>{log.user}</td>
                    <td style={{ padding: '12px 8px', fontSize: 13, color: 'var(--text-muted)', borderBottom: '1px solid var(--border-color)' }}>{log.ip}</td>
                    <td style={{ padding: '12px 8px', fontSize: 12, color: 'var(--text-muted)', borderBottom: '1px solid var(--border-color)' }}>{log.time}</td>
                    <td style={{ padding: '12px 8px', borderBottom: '1px solid var(--border-color)' }}>
                      <span style={{
                        padding: '3px 10px',
                        borderRadius: 12,
                        fontSize: 11,
                        fontWeight: 600,
                        background: log.status === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        color: log.status === 'success' ? '#10b981' : '#ef4444',
                      }}>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
