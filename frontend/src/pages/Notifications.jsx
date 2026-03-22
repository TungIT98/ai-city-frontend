/**
 * Notifications Page - Notification & Alerting System
 */
import { useState } from 'react';
import './Notifications.css';

const NOTIFICATIONS = [
  {
    id: 1,
    type: 'alert',
    title: 'Churn Risk Alert',
    message: 'Enterprise customer "TechCorp" showing 78% churn probability. Immediate outreach recommended.',
    time: '5 minutes ago',
    read: false,
    priority: 'high',
    icon: '⚠️',
  },
  {
    id: 2,
    type: 'success',
    title: 'Report Generated',
    message: 'Monthly MRR report is ready. 12 new customers, 3.1% churn rate.',
    time: '23 minutes ago',
    read: false,
    priority: 'medium',
    icon: '✅',
  },
  {
    id: 3,
    type: 'info',
    title: 'Agent Run Complete',
    message: 'Social Media Manager completed 47 posts across 5 platforms.',
    time: '1 hour ago',
    read: true,
    priority: 'low',
    icon: '🤖',
  },
  {
    id: 4,
    type: 'alert',
    title: 'API Rate Limit',
    message: 'Integration Hub approaching rate limit (89%). Consider upgrading plan.',
    time: '2 hours ago',
    read: true,
    priority: 'medium',
    icon: '🚨',
  },
  {
    id: 5,
    type: 'info',
    title: 'New Lead Captured',
    message: 'Hot lead from LinkedIn: "Sarah Chen - VP Engineering at ScaleAI"',
    time: '3 hours ago',
    read: true,
    priority: 'high',
    icon: '👤',
  },
  {
    id: 6,
    type: 'success',
    title: 'Revenue Milestone',
    message: 'MRR crossed $50K milestone! Up 18.2% from last month.',
    time: '5 hours ago',
    read: true,
    priority: 'medium',
    icon: '🎉',
  },
  {
    id: 7,
    type: 'alert',
    title: 'Forecast Deviation',
    message: 'Revenue 4.2% below ML forecast for this week. Investigating.',
    time: '6 hours ago',
    read: true,
    priority: 'high',
    icon: '📉',
  },
  {
    id: 8,
    type: 'info',
    title: 'Data Sync Complete',
    message: 'HubSpot integration synced 234 contacts, 12 deals updated.',
    time: '8 hours ago',
    read: true,
    priority: 'low',
    icon: '🔄',
  },
];

const ALERT_RULES = [
  { id: 1, name: 'High Churn Risk', condition: 'Churn probability > 70%', action: 'Email + In-app', enabled: true },
  { id: 2, name: 'MRR Drop', condition: 'Revenue declined > 10%', action: 'Email + Slack', enabled: true },
  { id: 3, name: 'API Rate Limit', condition: 'Usage > 85%', action: 'In-app', enabled: true },
  { id: 4, name: 'New Hot Lead', condition: 'Lead score > 80', action: 'Email + SMS', enabled: false },
  { id: 5, name: 'Weekly Digest', condition: 'Every Monday 9AM', action: 'Email', enabled: true },
];

export default function Notifications() {
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [filter, setFilter] = useState('all');
  const [alertRules, setAlertRules] = useState(ALERT_RULES);
  const [activeTab, setActiveTab] = useState('notifications');

  const unread = notifications.filter(n => !n.read).length;

  const filtered = filter === 'all'
    ? notifications
    : filter === 'unread'
    ? notifications.filter(n => !n.read)
    : notifications.filter(n => n.type === filter);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const toggleRule = (id) => {
    setAlertRules(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  };

  return (
    <div className="notifications-page">
      <div className="page-header">
        <div>
          <h1>Notifications & Alerts</h1>
          <p>Stay updated with real-time events and configure alert rules</p>
        </div>
        {unread > 0 && (
          <button className="mark-all-btn" onClick={markAllRead}>
            Mark all as read ({unread})
          </button>
        )}
      </div>

      <div className="notifications-tabs">
        <button
          className={`tab-btn ${activeTab === 'notifications' ? 'active' : ''}`}
          onClick={() => setActiveTab('notifications')}
        >
          Notifications {unread > 0 && <span className="badge">{unread}</span>}
        </button>
        <button
          className={`tab-btn ${activeTab === 'rules' ? 'active' : ''}`}
          onClick={() => setActiveTab('rules')}
        >
          Alert Rules
        </button>
        <button
          className={`tab-btn ${activeTab === 'integrations' ? 'active' : ''}`}
          onClick={() => setActiveTab('integrations')}
        >
          Channels
        </button>
      </div>

      {activeTab === 'notifications' && (
        <>
          <div className="filter-bar">
            {['all', 'unread', 'alert', 'success', 'info'].map(f => (
              <button
                key={f}
                className={`filter-btn ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          <div className="notifications-list">
            {filtered.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">🔔</span>
                <p>No notifications</p>
              </div>
            ) : (
              filtered.map(notif => (
                <div
                  key={notif.id}
                  className={`notif-item ${notif.read ? 'read' : 'unread'} priority-${notif.priority}`}
                >
                  <div className="notif-icon">{notif.icon}</div>
                  <div className="notif-content">
                    <div className="notif-header">
                      <h4>{notif.title}</h4>
                      <span className="notif-time">{notif.time}</span>
                    </div>
                    <p>{notif.message}</p>
                  </div>
                  <div className="notif-actions">
                    {!notif.read && (
                      <button className="action-btn" onClick={() => markRead(notif.id)} title="Mark read">
                        ✓
                      </button>
                    )}
                    <button className="action-btn delete" onClick={() => deleteNotification(notif.id)} title="Delete">
                      ×
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {activeTab === 'rules' && (
        <div className="rules-section">
          <div className="rules-header">
            <h3>Alert Rules</h3>
            <button className="add-rule-btn">+ Add Rule</button>
          </div>
          <div className="rules-list">
            {alertRules.map(rule => (
              <div key={rule.id} className="rule-item">
                <div className="rule-info">
                  <h4>{rule.name}</h4>
                  <span className="rule-condition">{rule.condition}</span>
                  <span className="rule-action">→ {rule.action}</span>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={rule.enabled}
                    onChange={() => toggleRule(rule.id)}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'integrations' && (
        <div className="channels-section">
          <h3>Notification Channels</h3>
          <div className="channels-grid">
            {[
              { name: 'In-App', icon: '🔔', connected: true, desc: 'Real-time notifications' },
              { name: 'Email', icon: '📧', connected: true, desc: 'Digest & alerts' },
              { name: 'Slack', icon: '💬', connected: false, desc: 'Connect to workspace' },
              { name: 'Discord', icon: '🎮', connected: false, desc: 'Server notifications' },
              { name: 'SMS', icon: '📱', connected: false, desc: 'Critical alerts only' },
              { name: 'Webhook', icon: '🪝', connected: true, desc: 'Custom HTTP callbacks' },
            ].map(channel => (
              <div key={channel.name} className="channel-card">
                <div className="channel-icon">{channel.icon}</div>
                <div className="channel-info">
                  <h4>{channel.name}</h4>
                  <p>{channel.desc}</p>
                </div>
                <span className={`status-dot ${channel.connected ? 'connected' : 'disconnected'}`}>
                  {channel.connected ? 'Connected' : 'Connect'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
