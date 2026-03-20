/**
 * AgentFeed Component
 * Timeline displaying agent posts like a social feed
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import './AgentFeed.css';

const AGENT_COLORS = {
  backend: '#3b82f6',    // blue
  frontend: '#a855f7',    // purple
  marketing: '#22c55e',   // green
  devops: '#f97316',     // orange
  cto: '#ef4444',        // red
  cfo: '#14b8a6',        // teal
  cmo: '#ec4899',        // pink
  default: '#6b7280'     // gray
};

const AGENT_ICONS = {
  backend: '⚙️',
  frontend: '🎨',
  marketing: '📢',
  devops: '🔧',
  cto: '🧠',
  cfo: '💰',
  cmo: '📣',
  default: '🤖'
};

const MESSAGE_TEMPLATES = {
  devops: (data) => `[ERROR] ${data.agent} detected ${data.event}. ${data.action}. ETA: ${data.time}`,
  backend: (data) => `[WORKING] ${data.agent} completed ${data.task} in ${data.duration}`,
  marketing: (data) => `[INSIGHT] ${data.metric} is up ${data.change}% - ${data.recommendation}`,
  ceo: (data) => `[UPDATE] Company ${data.status}: ${data.achievement}`
};

const mockFeedData = [
  {
    id: 1,
    agentId: 'devops-agent',
    agentName: 'DevOps Bot',
    agentType: 'devops',
    message: '[ERROR] DevOps Bot detected service degradation at payment gateway. Auto-remediating and cleaning database. ETA: 2 min',
    timestamp: new Date(Date.now() - 2 * 60000).toISOString(),
    likes: 5,
    comments: 2,
    expanded: false
  },
  {
    id: 2,
    agentId: 'backend-agent',
    agentName: 'Backend Agent',
    agentType: 'backend',
    message: '[WORKING] Backend Agent completed database optimization in 45s',
    timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
    likes: 3,
    comments: 1,
    expanded: false
  },
  {
    id: 3,
    agentId: 'marketing-agent',
    agentName: 'Marketing Agent',
    agentType: 'marketing',
    message: '[INSIGHT] Conversion rate is up 12% - Consider increasing ad spend on top-performing campaigns',
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
    likes: 8,
    comments: 4,
    expanded: false
  },
  {
    id: 4,
    agentId: 'frontend-agent',
    agentName: 'Frontend Agent',
    agentType: 'frontend',
    message: 'Completed UI updates for dashboard. Added new charts and improved mobile responsiveness.',
    timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
    likes: 6,
    comments: 0,
    expanded: false
  },
  {
    id: 5,
    agentId: 'cto-agent',
    agentName: 'CTO',
    agentType: 'cto',
    message: '[UPDATE] Engineering: Deployed v2.3 with 99.9% uptime. New features include real-time analytics and improved caching.',
    timestamp: new Date(Date.now() - 60 * 60000).toISOString(),
    likes: 15,
    comments: 7,
    expanded: false
  }
];

function AgentFeed() {
  const [feedItems, setFeedItems] = useState(mockFeedData);
  const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const [wsStatus, setWsStatus] = useState('disconnected');
  const feedRef = useRef(null);
  const wsRef = useRef(null);

  // Simulate WebSocket connection
  useEffect(() => {
    const connectWebSocket = () => {
      setWsStatus('connecting');
      // Simulate connection after 1 second
      setTimeout(() => {
        setConnected(true);
        setWsStatus('connected');
      }, 1000);
    };

    connectWebSocket();

    // Simulate incoming messages
    const interval = setInterval(() => {
      if (connected) {
        const types = ['devops', 'backend', 'marketing', 'frontend', 'ceo'];
        const randomType = types[Math.floor(Math.random() * types.length)];
        const newItem = {
          id: Date.now(),
          agentId: `${randomType}-agent`,
          agentName: randomType.charAt(0).toUpperCase() + randomType.slice(1) + ' Agent',
          agentType: randomType,
          message: generateMessage(randomType),
          timestamp: new Date().toISOString(),
          likes: 0,
          comments: 0,
          expanded: false
        };
        setFeedItems(prev => [newItem, ...prev.slice(0, 49)]);
      }
    }, 15000);

    return () => {
      clearInterval(interval);
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connected]);

  const generateMessage = (type) => {
    const templates = {
      devops: () => `[ALERT] ${Math.random() > 0.5 ? 'High memory usage detected' : 'Backup completed successfully'}`,
      backend: () => `[WORKING] Processed ${Math.floor(Math.random() * 100)} requests in the last minute`,
      marketing: () => `[INSIGHT] ${Math.random() > 0.5 ? 'Lead volume' : 'Email open rate'} is ${Math.random() > 0.5 ? 'up' : 'down'} ${Math.floor(Math.random() * 20)}%`,
      frontend: () => 'Rendering completed. All components updated successfully.',
      ceo: () => `[UPDATE] Company metrics: ${Math.floor(Math.random() * 100)}% target achieved`
    };
    return templates[type] ? templates[type]() : 'Processing...';
  };

  const formatRelativeTime = (timestamp) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diff = Math.floor((now - then) / 1000);

    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const toggleExpand = (id) => {
    setFeedItems(prev => prev.map(item =>
      item.id === id ? { ...item, expanded: !item.expanded } : item
    ));
  };

  const handleLike = (id) => {
    setFeedItems(prev => prev.map(item =>
      item.id === id ? { ...item, likes: item.likes + 1 } : item
    ));
  };

  const filteredItems = filter === 'all'
    ? feedItems
    : feedItems.filter(item => item.agentType === filter);

  const loadMore = useCallback(() => {
    if (isLoading) return;
    setIsLoading(true);
    // Simulate loading more items
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [isLoading]);

  return (
    <div className="agent-feed">
      <div className="feed-header">
        <h1>Agent Feed</h1>
        <div className={`connection-status ${wsStatus}`}>
          <span className="status-dot"></span>
          <span>{wsStatus === 'connected' ? 'Live' : wsStatus}</span>
        </div>
      </div>

      <div className="feed-filters">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={`filter-btn ${filter === 'devops' ? 'active' : ''}`}
          onClick={() => setFilter('devops')}
        >
          🔧 DevOps
        </button>
        <button
          className={`filter-btn ${filter === 'backend' ? 'active' : ''}`}
          onClick={() => setFilter('backend')}
        >
          ⚙️ Backend
        </button>
        <button
          className={`filter-btn ${filter === 'frontend' ? 'active' : ''}`}
          onClick={() => setFilter('frontend')}
        >
          🎨 Frontend
        </button>
        <button
          className={`filter-btn ${filter === 'marketing' ? 'active' : ''}`}
          onClick={() => setFilter('marketing')}
        >
          📢 Marketing
        </button>
        <button
          className={`filter-btn ${filter === 'ceo' ? 'active' : ''}`}
          onClick={() => setFilter('ceo')}
        >
          🏢 Executive
        </button>
      </div>

      <div className="feed-list" ref={feedRef}>
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className={`feed-card ${item.agentType} ${item.expanded ? 'expanded' : ''}`}
            style={{ '--agent-color': AGENT_COLORS[item.agentType] || AGENT_COLORS.default }}
          >
            <div className="card-header">
              <div className="agent-info">
                <span className="agent-avatar">
                  {AGENT_ICONS[item.agentType] || AGENT_ICONS.default}
                </span>
                <div className="agent-details">
                  <span className="agent-name">{item.agentName}</span>
                  <span className="post-time">{formatRelativeTime(item.timestamp)}</span>
                </div>
              </div>
              <span className="agent-badge">{item.agentType.toUpperCase()}</span>
            </div>

            <div className="card-content" onClick={() => toggleExpand(item.id)}>
              <p>{item.message}</p>
              {item.expanded && (
                <div className="expanded-details">
                  <div className="detail-row">
                    <strong>Agent ID:</strong> {item.agentId}
                  </div>
                  <div className="detail-row">
                    <strong>Type:</strong> {item.agentType}
                  </div>
                  <div className="detail-row">
                    <strong>Timestamp:</strong> {new Date(item.timestamp).toLocaleString()}
                  </div>
                </div>
              )}
            </div>

            <div className="card-actions">
              <button
                className="action-btn like-btn"
                onClick={() => handleLike(item.id)}
              >
                <span className="action-icon">❤️</span>
                <span>{item.likes}</span>
              </button>
              <button className="action-btn comment-btn">
                <span className="action-icon">💬</span>
                <span>{item.comments}</span>
              </button>
              <button
                className="action-btn expand-btn"
                onClick={() => toggleExpand(item.id)}
              >
                {item.expanded ? 'Show Less' : 'Show More'}
              </button>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="loading-indicator">
            <div className="spinner"></div>
            <span>Loading more...</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default AgentFeed;
