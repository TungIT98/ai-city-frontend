/**
 * HierarchyView Component
 * 2D Org Chart showing company hierarchy
 */
import { useState } from 'react';
import './HierarchyView.css';

const DIVISION_COLORS = {
  ceo: '#ec4899',
  cto: '#3b82f6',
  cfo: '#14b8a6',
  cmo: '#22c55e',
  cpo: '#a855f7',
  backend: '#3b82f6',
  frontend: '#a855f7',
  marketing: '#22c55e',
  devops: '#f97316',
  operations: '#f97316',
  sales: '#eab308',
  default: '#6b7280'
};

const mockHierarchy = {
  id: 'ceo-1',
  name: 'Nova CEO',
  title: 'Chief Executive Officer',
  division: 'ceo',
  status: 'active',
  children: [
    {
      id: 'cto-1',
      name: 'CTO',
      title: 'Chief Technology Officer',
      division: 'cto',
      status: 'active',
      children: [
        {
          id: 'backend-1',
          name: 'Backend Team',
          title: 'Backend Development',
          division: 'backend',
          status: 'active',
          children: [
            { id: 'be-1', name: 'Backend Agent', title: 'API Development', division: 'backend', status: 'active' },
            { id: 'be-2', name: 'Database Agent', title: 'Database Management', division: 'backend', status: 'idle' }
          ]
        },
        {
          id: 'frontend-1',
          name: 'Frontend Team',
          title: 'Frontend Development',
          division: 'frontend',
          status: 'active',
          children: [
            { id: 'fe-1', name: 'Frontend Agent', title: 'UI Development', division: 'frontend', status: 'active' },
            { id: 'fe-2', name: 'UI Designer', title: 'Design System', division: 'frontend', status: 'active' }
          ]
        },
        {
          id: 'devops-1',
          name: 'DevOps Team',
          title: 'Infrastructure',
          division: 'devops',
          status: 'active',
          children: [
            { id: 'devops-1a', name: 'DevOps Agent', title: 'CI/CD & Deployment', division: 'devops', status: 'active' },
            { id: 'devops-1b', name: 'Security Agent', title: 'Security & Compliance', division: 'devops', status: 'error' }
          ]
        }
      ]
    },
    {
      id: 'cfo-1',
      name: 'CFO',
      title: 'Chief Financial Officer',
      division: 'cfo',
      status: 'active',
      children: [
        {
          id: 'finance-1',
          name: 'Finance Team',
          title: 'Financial Operations',
          division: 'cfo',
          status: 'active',
          children: [
            { id: 'fin-1', name: 'Finance Agent', title: 'Budget & Forecasting', division: 'cfo', status: 'active' },
            { id: 'fin-2', name: 'Accountant Agent', title: 'Accounts & Billing', division: 'cfo', status: 'active' }
          ]
        }
      ]
    },
    {
      id: 'cmo-1',
      name: 'CMO',
      title: 'Chief Marketing Officer',
      division: 'cmo',
      status: 'active',
      children: [
        {
          id: 'marketing-1',
          name: 'Marketing Team',
          title: 'Marketing & Growth',
          division: 'marketing',
          status: 'active',
          children: [
            { id: 'mkt-1', name: 'Marketing Agent', title: 'Campaign Management', division: 'marketing', status: 'active' },
            { id: 'mkt-2', name: 'Content Agent', title: 'Content Creation', division: 'marketing', status: 'active' },
            { id: 'mkt-3', name: 'SEO Agent', title: 'Search Optimization', division: 'marketing', status: 'idle' }
          ]
        }
      ]
    },
    {
      id: 'cpo-1',
      name: 'CPO',
      title: 'Chief Product Officer',
      division: 'cpo',
      status: 'active',
      children: [
        {
          id: 'product-1',
          name: 'Product Team',
          title: 'Product Development',
          division: 'cpo',
          status: 'active',
          children: [
            { id: 'prod-1', name: 'Product Agent', title: 'Product Roadmap', division: 'cpo', status: 'active' },
            { id: 'prod-2', name: 'UX Researcher', title: 'User Research', division: 'cpo', status: 'active' }
          ]
        }
      ]
    }
  ]
};

const mockTaskData = [
  { project: 'AI City Platform', issues: 45, completed: 38, progress: 84 },
  { project: 'Agent Marketplace', issues: 23, completed: 20, progress: 87 },
  { project: 'Dashboard MVP', issues: 18, completed: 18, progress: 100 },
  { project: 'Revenue Tracking', issues: 12, completed: 8, progress: 67 }
];

const mockRevenueData = [
  { division: 'Backend', revenue: 42000, percentage: 35 },
  { division: 'Frontend', revenue: 36000, percentage: 30 },
  { division: 'Marketing', revenue: 24000, percentage: 20 },
  { division: 'DevOps', revenue: 12000, percentage: 10 },
  { division: 'Finance', revenue: 6000, percentage: 5 }
];

function HierarchyView() {
  const [viewMode, setViewMode] = useState('org'); // org, tasks, revenue
  const [selectedNode, setSelectedNode] = useState(null);
  const [expandedNodes, setExpandedNodes] = useState(new Set(['ceo-1', 'cto-1', 'cfo-1', 'cmo-1', 'cpo-1']));

  const getDivisionColor = (division) => {
    return DIVISION_COLORS[division?.toLowerCase()] || DIVISION_COLORS.default;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return '🟢';
      case 'idle': return '🟡';
      case 'error': return '🔴';
      case 'paused': return '⏸️';
      default: return '⚪';
    }
  };

  const toggleExpand = (nodeId) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const renderNode = (node, level = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodes.has(node.id);
    const isSelected = selectedNode?.id === node.id;
    const color = getDivisionColor(node.division);

    return (
      <div key={node.id} className="tree-node">
        <div
          className={`node-card ${isSelected ? 'selected' : ''}`}
          style={{ '--node-color': color }}
          onClick={() => {
            setSelectedNode(node);
            if (hasChildren) toggleExpand(node.id);
          }}
        >
          {hasChildren && (
            <span className={`expand-icon ${isExpanded ? 'expanded' : ''}`}>
              ▶
            </span>
          )}
          <span className="node-status">{getStatusIcon(node.status)}</span>
          <div className="node-info">
            <span className="node-name">{node.name}</span>
            <span className="node-title">{node.title}</span>
          </div>
          {hasChildren && (
            <span className="child-count">{node.children.length}</span>
          )}
        </div>
        {hasChildren && isExpanded && (
          <div className="node-children">
            {node.children.map(child => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="hierarchy-view">
      <div className="hierarchy-header">
        <h1>Organization Hierarchy</h1>
        <div className="view-mode-selector">
          <button
            className={viewMode === 'org' ? 'active' : ''}
            onClick={() => setViewMode('org')}
          >
            🏢 Org Chart
          </button>
          <button
            className={viewMode === 'tasks' ? 'active' : ''}
            onClick={() => setViewMode('tasks')}
          >
            📋 Task Flow
          </button>
          <button
            className={viewMode === 'revenue' ? 'active' : ''}
            onClick={() => setViewMode('revenue')}
          >
            💰 Revenue
          </button>
        </div>
      </div>

      <div className="hierarchy-content">
        <div className="hierarchy-main">
          {viewMode === 'org' && (
            <div className="org-tree">
              {renderNode(mockHierarchy)}
            </div>
          )}

          {viewMode === 'tasks' && (
            <div className="task-flow">
              <h2>Project → Issues → Assignees</h2>
              <div className="task-list">
                {mockTaskData.map((project, idx) => (
                  <div key={idx} className="task-card">
                    <div className="task-header">
                      <h3>{project.project}</h3>
                      <span className="task-progress">{project.progress}%</span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                    <div className="task-stats">
                      <span>{project.completed}/{project.issues} issues completed</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {viewMode === 'revenue' && (
            <div className="revenue-view">
              <h2>Revenue by Division</h2>
              <div className="revenue-chart">
                {mockRevenueData.map((item, idx) => (
                  <div key={idx} className="revenue-row">
                    <div className="revenue-label">
                      <span
                        className="revenue-dot"
                        style={{ background: getDivisionColor(item.division.toLowerCase()) }}
                      />
                      {item.division}
                    </div>
                    <div className="revenue-bar-container">
                      <div
                        className="revenue-bar"
                        style={{
                          width: `${item.percentage}%`,
                          background: getDivisionColor(item.division.toLowerCase())
                        }}
                      />
                    </div>
                    <div className="revenue-value">
                      ${item.revenue.toLocaleString()}
                      <span className="revenue-percent">({item.percentage}%)</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="total-revenue">
                <span>Total Monthly Revenue</span>
                <span className="total-value">
                  ${mockRevenueData.reduce((sum, item) => sum + item.revenue, 0).toLocaleString()}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="hierarchy-sidebar">
          <div className="legend">
            <h3>Legend</h3>
            <div className="legend-items">
              <div className="legend-item">
                <span>🟢</span> Active
              </div>
              <div className="legend-item">
                <span>🟡</span> Idle
              </div>
              <div className="legend-item">
                <span>🔴</span> Error
              </div>
            </div>
          </div>

          {selectedNode && (
            <div className="node-details">
              <h3>Details</h3>
              <div className="detail-row">
                <span className="detail-label">Name</span>
                <span className="detail-value">{selectedNode.name}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Title</span>
                <span className="detail-value">{selectedNode.title}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Division</span>
                <span
                  className="detail-value division-badge"
                  style={{ color: getDivisionColor(selectedNode.division) }}
                >
                  {selectedNode.division}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Status</span>
                <span className="detail-value">
                  {getStatusIcon(selectedNode.status)} {selectedNode.status}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HierarchyView;
