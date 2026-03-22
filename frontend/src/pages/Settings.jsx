/**
 * Settings Page
 * Workspace, profile, billing settings, SSO (Phase 9)
 */
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

export default function Settings() {
  const { user, hasPermission } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [activeSection, setActiveSection] = useState('profile');

  const sections = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'workspace', label: 'Workspace', icon: '🏢' },
    { id: 'appearance', label: 'Appearance', icon: '🎨' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'sso', label: 'SSO', icon: '🔐' },
    { id: 'billing', label: 'Billing', icon: '💳' },
    { id: 'data', label: 'Data & Privacy', icon: '📦' },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h2>Settings</h2>
        <p>Manage your account and workspace preferences</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 24 }}>
        {/* Sidebar Nav */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 16px',
                border: 'none',
                borderRadius: 8,
                background: activeSection === section.id ? 'rgba(79, 172, 254, 0.1)' : 'transparent',
                color: activeSection === section.id ? 'var(--primary)' : 'var(--text-secondary)',
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 500,
                textAlign: 'left',
                transition: 'all 0.2s',
              }}
            >
              <span>{section.icon}</span>
              {section.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div>
          {/* Profile */}
          {activeSection === 'profile' && (
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Profile Settings</h3>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid var(--border-color)' }}>
                <div style={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 32,
                  color: 'white',
                  fontWeight: 700,
                }}>
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <button style={{
                    padding: '8px 16px',
                    border: '1px solid var(--border-color)',
                    borderRadius: 8,
                    background: 'transparent',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    fontSize: 13,
                    fontWeight: 500,
                    marginRight: 8,
                  }}>
                    Change Photo
                  </button>
                  <button style={{
                    padding: '8px 16px',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: 8,
                    background: 'transparent',
                    color: '#ef4444',
                    cursor: 'pointer',
                    fontSize: 13,
                    fontWeight: 500,
                  }}>
                    Remove
                  </button>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'var(--text-secondary)' }}>Full Name</label>
                  <input
                    type="text"
                    defaultValue={user?.name || ''}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      border: '1px solid var(--border-color)',
                      borderRadius: 8,
                      fontSize: 14,
                      background: 'var(--bg-primary)',
                      color: 'var(--text-primary)',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'var(--text-secondary)' }}>Email</label>
                  <input
                    type="email"
                    defaultValue={user?.email || ''}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      border: '1px solid var(--border-color)',
                      borderRadius: 8,
                      fontSize: 14,
                      background: 'var(--bg-primary)',
                      color: 'var(--text-primary)',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'var(--text-secondary)' }}>Role</label>
                  <select
                    defaultValue={user?.role || 'viewer'}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      border: '1px solid var(--border-color)',
                      borderRadius: 8,
                      fontSize: 14,
                      background: 'var(--bg-primary)',
                      color: 'var(--text-primary)',
                      boxSizing: 'border-box',
                    }}
                  >
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                    <option value="agent">Agent</option>
                    <option value="viewer">Viewer</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'var(--text-secondary)' }}>Timezone</label>
                  <select
                    defaultValue="Asia/Ho_Chi_Minh"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      border: '1px solid var(--border-color)',
                      borderRadius: 8,
                      fontSize: 14,
                      background: 'var(--bg-primary)',
                      color: 'var(--text-primary)',
                      boxSizing: 'border-box',
                    }}
                  >
                    <option value="Asia/Ho_Chi_Minh">Asia/Ho Chi Minh (UTC+7)</option>
                    <option value="Asia/Hanoi">Asia/Hanoi (UTC+7)</option>
                    <option value="America/New_York">America/New York (UTC-5)</option>
                    <option value="Europe/London">Europe/London (UTC+0)</option>
                  </select>
                </div>
              </div>
              <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end' }}>
                <button style={{
                  padding: '10px 24px',
                  border: 'none',
                  borderRadius: 8,
                  background: 'var(--primary)',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: 600,
                }}>
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* Appearance */}
          {activeSection === 'appearance' && (
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Appearance</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid var(--border-color)' }}>
                  <div>
                    <h4 style={{ margin: '0 0 4px', fontSize: 15 }}>Theme</h4>
                    <p style={{ margin: 0, fontSize: 13, color: 'var(--text-muted)' }}>Choose your preferred color scheme</p>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => theme !== 'light' && toggleTheme()}
                      style={{
                        padding: '8px 20px',
                        border: theme === 'light' ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                        borderRadius: 8,
                        background: theme === 'light' ? 'rgba(79, 172, 254, 0.1)' : 'transparent',
                        color: 'var(--text-primary)',
                        cursor: theme === 'light' ? 'default' : 'pointer',
                        fontSize: 13,
                        fontWeight: 500,
                      }}
                    >
                      ☀️ Light
                    </button>
                    <button
                      onClick={() => theme !== 'dark' && toggleTheme()}
                      style={{
                        padding: '8px 20px',
                        border: theme === 'dark' ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                        borderRadius: 8,
                        background: theme === 'dark' ? 'rgba(79, 172, 254, 0.1)' : 'transparent',
                        color: 'var(--text-primary)',
                        cursor: theme === 'dark' ? 'default' : 'pointer',
                        fontSize: 13,
                        fontWeight: 500,
                      }}
                    >
                      🌙 Dark
                    </button>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid var(--border-color)' }}>
                  <div>
                    <h4 style={{ margin: '0 0 4px', fontSize: 15 }}>Compact Mode</h4>
                    <p style={{ margin: 0, fontSize: 13, color: 'var(--text-muted)' }}>Reduce spacing for denser UI</p>
                  </div>
                  <label style={{ position: 'relative', display: 'inline-block', width: 48, height: 26 }}>
                    <input type="checkbox" style={{ opacity: 0, width: 0, height: 0 }} />
                    <span style={{
                      position: 'absolute',
                      cursor: 'pointer',
                      top: 0, left: 0, right: 0, bottom: 0,
                      background: 'var(--border-color)',
                      borderRadius: 26,
                      transition: '0.3s',
                    }}>
                      <span style={{
                        position: 'absolute',
                        content: '',
                        height: 20,
                        width: 20,
                        left: 3,
                        bottom: 3,
                        background: 'white',
                        borderRadius: '50%',
                        transition: '0.3s',
                      }} />
                    </span>
                  </label>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0' }}>
                  <div>
                    <h4 style={{ margin: '0 0 4px', fontSize: 15 }}>Language</h4>
                    <p style={{ margin: 0, fontSize: 13, color: 'var(--text-muted)' }}>Select your preferred language</p>
                  </div>
                  <select style={{
                    padding: '8px 14px',
                    border: '1px solid var(--border-color)',
                    borderRadius: 8,
                    background: 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                    fontSize: 13,
                  }}>
                    <option>English</option>
                    <option>Tiếng Việt</option>
                    <option>日本語</option>
                    <option>中文</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Workspace */}
          {activeSection === 'workspace' && (
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Workspace Settings</h3>
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'var(--text-secondary)' }}>Workspace Name</label>
                <input
                  type="text"
                  defaultValue="AI City"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    border: '1px solid var(--border-color)',
                    borderRadius: 8,
                    fontSize: 14,
                    background: 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'var(--text-secondary)' }}>Workspace URL</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 14, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>aicity.app/</span>
                  <input
                    type="text"
                    defaultValue="workspace"
                    style={{
                      flex: 1,
                      padding: '10px 14px',
                      border: '1px solid var(--border-color)',
                      borderRadius: 8,
                      fontSize: 14,
                      background: 'var(--bg-primary)',
                      color: 'var(--text-primary)',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>
              <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                <button style={{
                  padding: '10px 24px',
                  border: '1px solid var(--border-color)',
                  borderRadius: 8,
                  background: 'transparent',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: 600,
                }}>
                  Delete Workspace
                </button>
                <button style={{
                  padding: '10px 24px',
                  border: 'none',
                  borderRadius: 8,
                  background: 'var(--primary)',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: 600,
                }}>
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* Notifications */}
          {activeSection === 'notifications' && (
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Notification Preferences</h3>
              </div>
              {[
                { id: 'push', label: 'Push Notifications', desc: 'Browser push notifications for real-time alerts', permission: Notification?.permission },
                { id: 'email', label: 'Email Notifications', desc: 'Receive email summaries for daily/weekly reports' },
                { id: 'slack', label: 'Slack Integration', desc: 'Send notifications to your Slack workspace' },
                { id: 'sms', label: 'SMS Alerts', desc: 'Critical alerts via SMS (requires plan)' },
                { id: 'webhook', label: 'Webhook', desc: 'POST to custom URL for external integrations' },
              ].map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid var(--border-color)' }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{item.label}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{item.desc}</div>
                  </div>
                  <button
                    onClick={() => item.id === 'push' && Notification?.requestPermission?.()}
                    style={{
                      padding: '6px 16px',
                      border: '1px solid var(--border-color)',
                      borderRadius: 6,
                      background: item.id === 'push' && Notification?.permission === 'granted' ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-primary)',
                      color: item.id === 'push' && Notification?.permission === 'granted' ? '#10b981' : 'var(--text-primary)',
                      cursor: 'pointer',
                      fontSize: 13,
                      fontWeight: 500,
                    }}
                  >
                    {item.id === 'push' ? (Notification?.permission === 'granted' ? 'Enabled' : Notification?.permission === 'denied' ? 'Blocked' : 'Enable') : 'Configure'}
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* SSO Configuration */}
          {activeSection === 'sso' && hasPermission('manage_workspace') && (
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Single Sign-On (SSO)</h3>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Enterprise feature</span>
              </div>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 24 }}>
                Configure SSO providers to enable enterprise authentication. SSO requires Enterprise plan.
              </p>

              {/* Google SSO */}
              <div style={{ padding: '16px', background: 'var(--bg-primary)', borderRadius: 10, marginBottom: 16, border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, border: '1px solid #eee' }}>
                      G
                    </div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 600 }}>Google Workspace</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Sign in with Google accounts</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ padding: '4px 10px', borderRadius: 12, fontSize: 11, fontWeight: 600, background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>Configure</span>
                    <button style={{ padding: '6px 16px', border: '1px solid var(--border-color)', borderRadius: 6, background: 'var(--primary)', color: 'white', cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>
                      Enable
                    </button>
                  </div>
                </div>
              </div>

              {/* Microsoft SSO */}
              <div style={{ padding: '16px', background: 'var(--bg-primary)', borderRadius: 10, marginBottom: 16, border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: '#00a4ef', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: 'white', fontWeight: 700 }}>
                      M
                    </div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 600 }}>Microsoft Entra ID</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Sign in with Microsoft / Azure AD</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ padding: '4px 10px', borderRadius: 12, fontSize: 11, fontWeight: 600, background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>Configure</span>
                    <button style={{ padding: '6px 16px', border: '1px solid var(--border-color)', borderRadius: 6, background: 'var(--primary)', color: 'white', cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>
                      Enable
                    </button>
                  </div>
                </div>
              </div>

              {/* SAML SSO */}
              <div style={{ padding: '16px', background: 'var(--bg-primary)', borderRadius: 10, marginBottom: 16, border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: '#6b7280', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: 'white', fontWeight: 700 }}>
                      S
                    </div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 600 }}>SAML 2.0</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Generic SAML identity provider</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button style={{ padding: '6px 16px', border: '1px solid var(--border-color)', borderRadius: 6, background: 'var(--primary)', color: 'white', cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>
                      Configure
                    </button>
                  </div>
                </div>
              </div>

              {/* SCIM */}
              <div style={{ padding: '16px', background: 'rgba(245, 158, 11, 0.05)', borderRadius: 10, border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 600 }}>SCIM Provisioning</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Auto-provision users from your IdP</div>
                  </div>
                  <button style={{ padding: '6px 16px', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: 6, background: 'transparent', color: '#f59e0b', cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>
                    Enterprise Only
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'sso' && !hasPermission('manage_workspace') && (
            <div className="card" style={{ textAlign: 'center', padding: 48 }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🔐</div>
              <h3 style={{ marginBottom: 8 }}>SSO Not Available</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>SSO configuration requires admin permissions and Enterprise plan.</p>
            </div>
          )}

          {/* Billing */}
          {activeSection === 'billing' && (
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Billing & Subscription</h3>
              </div>
              <div style={{
                padding: 24,
                background: 'linear-gradient(135deg, rgba(79, 172, 254, 0.1) 0%, rgba(0, 242, 254, 0.1) 100%)',
                borderRadius: 12,
                marginBottom: 24,
                border: '1px solid rgba(79, 172, 254, 0.2)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ margin: '0 0 4px', fontSize: 18, color: 'var(--primary)' }}>Pro Plan</h4>
                    <p style={{ margin: 0, fontSize: 13, color: 'var(--text-muted)' }}>Billed annually</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 24, fontWeight: 700 }}>VND 4.9M<span style={{ fontSize: 14, fontWeight: 400, color: 'var(--text-muted)' }}>/yr</span></div>
                    <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--text-muted)' }}>Next billing: Mar 21, 2027</p>
                  </div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
                <div style={{ textAlign: 'center', padding: 16, background: 'var(--bg-primary)', borderRadius: 8 }}>
                  <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--primary)' }}>15</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Team Members</div>
                </div>
                <div style={{ textAlign: 'center', padding: 16, background: 'var(--bg-primary)', borderRadius: 8 }}>
                  <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--primary)' }}>100K</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>API Calls/mo</div>
                </div>
                <div style={{ textAlign: 'center', padding: 16, background: 'var(--bg-primary)', borderRadius: 8 }}>
                  <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--primary)' }}>5</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Workspaces</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button style={{
                  flex: 1,
                  padding: '12px',
                  border: '1px solid var(--border-color)',
                  borderRadius: 8,
                  background: 'transparent',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: 500,
                }}>
                  Upgrade Plan
                </button>
                <button style={{
                  flex: 1,
                  padding: '12px',
                  border: 'none',
                  borderRadius: 8,
                  background: 'var(--primary)',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: 600,
                }}>
                  Download Invoice
                </button>
              </div>
            </div>
          )}

          {/* Data & Privacy */}
          {activeSection === 'data' && (
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Data & Privacy</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ padding: '16px', background: 'var(--bg-primary)', borderRadius: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ margin: '0 0 4px', fontSize: 15 }}>Export Data</h4>
                      <p style={{ margin: 0, fontSize: 13, color: 'var(--text-muted)' }}>Download all your data in JSON or CSV format</p>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
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
                        JSON
                      </button>
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
                        CSV
                      </button>
                    </div>
                  </div>
                </div>
                <div style={{ padding: '16px', background: 'var(--bg-primary)', borderRadius: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ margin: '0 0 4px', fontSize: 15 }}>Delete Account</h4>
                      <p style={{ margin: 0, fontSize: 13, color: 'var(--text-muted)' }}>Permanently delete your account and all data</p>
                    </div>
                    <button style={{
                      padding: '8px 16px',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      borderRadius: 8,
                      background: 'transparent',
                      color: '#ef4444',
                      cursor: 'pointer',
                      fontSize: 13,
                      fontWeight: 500,
                    }}>
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
