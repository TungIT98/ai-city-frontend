/**
 * Integration Hub Page
 * Data integration connectors and sync management
 */
import { useState, useEffect } from 'react';
import api from '../services/api';

// Available data source connectors
const connectors = [
  {
    id: 'google_analytics',
    name: 'Google Analytics',
    description: 'Website traffic, user behavior, and conversion data',
    icon: '📊',
    color: '#F9AB00',
    status: 'disconnected',
    metrics: ['sessions', 'users', 'pageviews', 'conversions', 'bounce_rate']
  },
  {
    id: 'hubspot',
    name: 'HubSpot',
    description: 'CRM contacts, deals, and marketing automation',
    icon: '🟠',
    color: '#FF7A59',
    status: 'disconnected',
    metrics: ['contacts', 'deals', 'companies', 'tickets', 'email_sent']
  },
  {
    id: 'salesforce',
    name: 'Salesforce',
    description: 'Enterprise CRM with sales and service cloud',
    icon: '☁️',
    color: '#00A1E0',
    status: 'disconnected',
    metrics: ['accounts', 'opportunities', 'cases', 'contacts', 'revenue']
  },
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Payment processing and subscription management',
    icon: '💳',
    color: '#635BFF',
    status: 'connected',
    lastSync: '2026-03-21T10:30:00Z',
    metrics: ['transactions', 'revenue', 'subscriptions', 'customers', 'churn_rate']
  },
  {
    id: 'mailchimp',
    name: 'Mailchimp',
    description: 'Email marketing and audience management',
    icon: '📧',
    color: '#FFE01B',
    status: 'disconnected',
    metrics: ['subscribers', 'campaigns', 'open_rate', 'click_rate', 'unsubscribes']
  },
  {
    id: 'zendesk',
    name: 'Zendesk',
    description: 'Customer support and ticketing system',
    icon: '🎫',
    color: '#03363D',
    status: 'disconnected',
    metrics: ['tickets', 'satisfaction', 'response_time', 'agents', 'sla_compliance']
  }
];

// Integration Hub Component
const ConnectorCard = ({ connector, onConnect, onSync, onDisconnect }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected': return '#10b981';
      case 'syncing': return '#4facfe';
      case 'error': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      border: '1px solid #e5e7eb',
      overflow: 'hidden',
      marginBottom: '16px'
    }}>
      {/* Header */}
      <div style={{
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: 'pointer'
      }}
      onClick={() => setIsExpanded(!isExpanded)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: `${connector.color}15`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px'
          }}>
            {connector.icon}
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '16px', color: '#374151' }}>{connector.name}</h3>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#6b7280' }}>{connector.description}</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            background: `${getStatusColor(connector.status)}15`,
            borderRadius: '20px'
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: getStatusColor(connector.status)
            }} />
            <span style={{ fontSize: '12px', color: getStatusColor(connector.status), fontWeight: 500 }}>
              {connector.status}
            </span>
          </div>
          <span style={{ color: '#9ca3af' }}>{isExpanded ? '▲' : '▼'}</span>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div style={{ padding: '0 20px 20px', borderTop: '1px solid #f5f5f5' }}>
          {/* Metrics Available */}
          <div style={{ marginTop: '16px' }}>
            <h4 style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px', textTransform: 'uppercase' }}>
              Available Metrics
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {connector.metrics.map(metric => (
                <span key={metric} style={{
                  padding: '4px 10px',
                  background: '#f9fafb',
                  borderRadius: '4px',
                  fontSize: '12px',
                  color: '#4b5563'
                }}>
                  {metric.replace('_', ' ')}
                </span>
              ))}
            </div>
          </div>

          {/* Sync Info */}
          {connector.status === 'connected' && connector.lastSync && (
            <div style={{ marginTop: '16px', padding: '12px', background: '#f9fafb', borderRadius: '8px' }}>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>
                Last synced: {new Date(connector.lastSync).toLocaleString()}
              </div>
            </div>
          )}

          {/* Actions */}
          <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
            {connector.status === 'connected' ? (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); onSync(connector.id); }}
                  style={{
                    padding: '8px 16px',
                    background: '#4facfe',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: 500
                  }}
                >
                  🔄 Sync Now
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onDisconnect(connector.id); }}
                  style={{
                    padding: '8px 16px',
                    background: 'white',
                    color: '#ef4444',
                    border: '1px solid #ef4444',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '13px'
                  }}
                >
                  Disconnect
                </button>
              </>
            ) : (
              <button
                onClick={(e) => { e.stopPropagation(); onConnect(connector.id); }}
                style={{
                  padding: '8px 16px',
                  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 500
                }}
              >
                🔗 Connect
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Data Sync Status Component
const SyncStatusDashboard = ({ syncHistory }) => {
  const stats = [
    { label: 'Total Syncs Today', value: syncHistory?.length || 0, icon: '🔄', color: '#4facfe' },
    { label: 'Successful', value: syncHistory?.filter(s => s.status === 'success').length || 0, icon: '✅', color: '#10b981' },
    { label: 'Failed', value: syncHistory?.filter(s => s.status === 'error').length || 0, icon: '❌', color: '#ef4444' },
    { label: 'Pending', value: syncHistory?.filter(s => s.status === 'pending').length || 0, icon: '⏳', color: '#f59e0b' },
  ];

  return (
    <div className="card" style={{ marginBottom: '24px' }}>
      <h3 className="card-title">📈 Sync Activity Today</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginTop: '16px' }}>
        {stats.map((stat, idx) => (
          <div key={idx} style={{
            padding: '16px',
            background: '#f9fafb',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>{stat.icon}</div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Syncs */}
      {syncHistory && syncHistory.length > 0 && (
        <div style={{ marginTop: '24px' }}>
          <h4 style={{ fontSize: '13px', color: '#6b7280', marginBottom: '12px' }}>Recent Sync Activity</h4>
          <div style={{ maxHeight: '200px', overflow: 'auto' }}>
            {syncHistory.slice(0, 10).map((sync, idx) => (
              <div key={idx} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px 12px',
                borderBottom: '1px solid #f5f5f5'
              }}>
                <div>
                  <span style={{ fontWeight: 500 }}>{sync.connector}</span>
                  <span style={{ fontSize: '12px', color: '#6b7280', marginLeft: '8px' }}>{sync.action}</span>
                </div>
                <span style={{
                  fontSize: '11px',
                  color: sync.status === 'success' ? '#10b981' : sync.status === 'error' ? '#ef4444' : '#6b7280'
                }}>
                  {new Date(sync.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const IntegrationHub = () => {
  const [connectorsData, setConnectorsData] = useState(connectors);
  const [syncHistory, setSyncHistory] = useState([]);
  const [isConnecting, setIsConnecting] = useState(null);
  const [isSyncing, setIsSyncing] = useState(null);

  // Mock sync history
  useEffect(() => {
    setSyncHistory([
      { connector: 'Stripe', action: 'Full sync completed', status: 'success', timestamp: '2026-03-21T10:30:00Z' },
      { connector: 'Google Analytics', action: 'Incremental sync', status: 'success', timestamp: '2026-03-21T09:15:00Z' },
      { connector: 'HubSpot', action: 'Contact sync', status: 'success', timestamp: '2026-03-21T08:00:00Z' },
      { connector: 'Stripe', action: 'Payment data sync', status: 'error', timestamp: '2026-03-20T22:00:00Z' },
    ]);
  }, []);

  const handleConnect = async (connectorId) => {
    setIsConnecting(connectorId);
    // Simulate OAuth flow
    setTimeout(() => {
      setConnectorsData(prev => prev.map(c =>
        c.id === connectorId
          ? { ...c, status: 'connected', lastSync: new Date().toISOString() }
          : c
      ));
      setIsConnecting(null);
      // Add to sync history
      setSyncHistory(prev => [{
        connector: connectorsData.find(c => c.id === connectorId).name,
        action: 'Connected',
        status: 'success',
        timestamp: new Date().toISOString()
      }, ...prev]);
    }, 1500);
  };

  const handleSync = async (connectorId) => {
    setIsSyncing(connectorId);
    setConnectorsData(prev => prev.map(c =>
      c.id === connectorId ? { ...c, status: 'syncing' } : c
    ));

    // Simulate sync
    setTimeout(() => {
      setConnectorsData(prev => prev.map(c =>
        c.id === connectorId
          ? { ...c, status: 'connected', lastSync: new Date().toISOString() }
          : c
      ));
      setIsSyncing(null);
      // Add to sync history
      setSyncHistory(prev => [{
        connector: connectorsData.find(c => c.id === connectorId).name,
        action: 'Manual sync completed',
        status: 'success',
        timestamp: new Date().toISOString()
      }, ...prev]);
    }, 2000);
  };

  const handleDisconnect = (connectorId) => {
    if (confirm('Are you sure you want to disconnect this integration?')) {
      setConnectorsData(prev => prev.map(c =>
        c.id === connectorId ? { ...c, status: 'disconnected', lastSync: null } : c
      ));
      setSyncHistory(prev => [{
        connector: connectorsData.find(c => c.id === connectorId).name,
        action: 'Disconnected',
        status: 'success',
        timestamp: new Date().toISOString()
      }, ...prev]);
    }
  };

  // Stats summary
  const connectedCount = connectorsData.filter(c => c.status === 'connected').length;
  const totalMetrics = connectorsData.reduce((acc, c) => acc + c.metrics.length, 0);

  return (
    <div className="integration-hub">
      <div className="page-header">
        <div>
          <h2>Data Integration Hub</h2>
          <p>Connect and sync data from external platforms</p>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#4facfe' }}>{connectedCount}</div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>Connected</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#10b981' }}>{totalMetrics}</div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>Available Metrics</div>
          </div>
        </div>
      </div>

      {/* Sync Status Dashboard */}
      <SyncStatusDashboard syncHistory={syncHistory} />

      {/* Connectors Grid */}
      <h3 style={{ marginBottom: '16px', color: '#374151' }}>Available Connectors</h3>
      {connectorsData.map(connector => (
        <ConnectorCard
          key={connector.id}
          connector={connector}
          onConnect={handleConnect}
          onSync={handleSync}
          onDisconnect={handleDisconnect}
        />
      ))}

      {/* Unified Data Model */}
      <div className="card" style={{ marginTop: '24px' }}>
        <h3 className="card-title">📦 Unified Data Model</h3>
        <p style={{ color: '#6b7280', fontSize: '13px', marginBottom: '16px' }}>
          All connected data sources are normalized into a common schema for unified analytics.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          {[
            { entity: 'Contacts', count: 1247, sources: ['HubSpot', 'Salesforce', 'Mailchimp'] },
            { entity: 'Transactions', count: 3892, sources: ['Stripe'] },
            { entity: 'Events', count: 15623, sources: ['Google Analytics'] },
            { entity: 'Tickets', count: 342, sources: ['Zendesk'] },
            { entity: 'Companies', count: 89, sources: ['HubSpot', 'Salesforce'] },
            { entity: 'Revenue', count: '$245K', sources: ['Stripe', 'Salesforce'] },
          ].map((item, idx) => (
            <div key={idx} style={{
              padding: '16px',
              background: '#f9fafb',
              borderRadius: '8px'
            }}>
              <div style={{ fontWeight: 600, color: '#374151' }}>{item.entity}</div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#4facfe', margin: '8px 0' }}>
                {item.count}
              </div>
              <div style={{ fontSize: '11px', color: '#9ca3af' }}>
                {item.sources.join(', ')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IntegrationHub;