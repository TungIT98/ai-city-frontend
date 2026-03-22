/**
 * AI City - Discovery Tree
 * Anno 117-style navigation: Technology → Business → Growth
 * Inspired by Anno 117's Discovery Tree mechanic
 */
import { useState } from 'react';
import './DiscoveryTree.css';

const TREE_DATA = {
  technology: {
    label: 'Technology',
    icon: '🔬',
    color: '#3b82f6',
    children: {
      'ai-agents': {
        label: 'AI Agents',
        icon: '🤖',
        children: [
          { id: 'sales-agent', label: 'Sales Agent', icon: '💰', metric: '12 active' },
          { id: 'marketing-agent', label: 'Marketing Agent', icon: '📣', metric: '8 active' },
          { id: 'support-agent', label: 'Support Agent', icon: '🎧', metric: '6 active' },
          { id: 'data-agent', label: 'Data Agent', icon: '📊', metric: '4 active' },
        ],
      },
      automation: {
        label: 'Automation',
        icon: '⚡',
        children: [
          { id: 'email-automation', label: 'Email Automation', icon: '📧', metric: '23 flows' },
          { id: 'lead-scoring', label: 'Lead Scoring', icon: '🎯', metric: '98% accuracy' },
          { id: 'workflow-builder', label: 'Workflow Builder', icon: '🔧', metric: '15 workflows' },
          { id: 'auto-response', label: 'Auto Response', icon: '⚙️', metric: '1.2k/day' },
        ],
      },
      analytics: {
        label: 'Analytics',
        icon: '📊',
        children: [
          { id: 'realtime-analytics', label: 'Real-time Analytics', icon: '⚡', metric: '<100ms' },
          { id: 'predictive-analytics', label: 'Predictive Analytics', icon: '🔮', metric: '94% accuracy' },
          { id: 'cohort-analysis', label: 'Cohort Analysis', icon: '👥', metric: '12 cohorts' },
          { id: 'funnel-tracking', label: 'Funnel Tracking', icon: '📈', metric: '7 stages' },
        ],
      },
    },
  },
  business: {
    label: 'Business',
    icon: '💼',
    color: '#22c55e',
    children: {
      sales: {
        label: 'Sales',
        icon: '📈',
        children: [
          { id: 'lead-generation', label: 'Lead Generation', icon: '🎣', metric: '2.3k/mo' },
          { id: 'pipeline-mgmt', label: 'Pipeline Management', icon: '🔄', metric: '$4.5M pipeline' },
          { id: 'deal-tracking', label: 'Deal Tracking', icon: '📋', metric: '156 active deals' },
          { id: 'territory-mgmt', label: 'Territory Management', icon: '🗺️', metric: '9 territories' },
        ],
      },
      marketing: {
        label: 'Marketing',
        icon: '📣',
        children: [
          { id: 'campaign-manager', label: 'Campaign Manager', icon: '📢', metric: '12 campaigns' },
          { id: 'email-sequences', label: 'Email Sequences', icon: '📧', metric: '34 sequences' },
          { id: 'seo-optimizer', label: 'SEO Optimizer', icon: '🔍', metric: 'Top 10 keywords' },
          { id: 'social-listener', label: 'Social Listener', icon: '👂', metric: '8 platforms' },
        ],
      },
      operations: {
        label: 'Operations',
        icon: '⚙️',
        children: [
          { id: 'workflow-automation', label: 'Workflow Automation', icon: '🔧', metric: '45 ops' },
          { id: 'resource-alloc', label: 'Resource Allocation', icon: '📦', metric: '8 agents' },
          { id: 'cost-tracker', label: 'Cost Tracker', icon: '💳', metric: '$72.43/mo' },
          { id: 'sla-monitor', label: 'SLA Monitor', icon: '⏱️', metric: '99.9% uptime' },
        ],
      },
    },
  },
  growth: {
    label: 'Growth',
    icon: '🚀',
    color: '#f97316',
    children: {
      scaling: {
        label: 'Scaling',
        icon: '📐',
        children: [
          { id: 'auto-scale', label: 'Auto Scale', icon: '📈', metric: '0→10 agents' },
          { id: 'multi-tenant', label: 'Multi-tenant', icon: '🏢', metric: '5 workspaces' },
          { id: 'geo-expansion', label: 'Geo Expansion', icon: '🌍', metric: '9 regions' },
        ],
      },
      hiring: {
        label: 'Hiring',
        icon: '👥',
        children: [
          { id: 'agent-recruiter', label: 'Agent Recruiter', icon: '🤝', metric: '3 roles open' },
          { id: 'skill-matcher', label: 'Skill Matcher', icon: '🎯', metric: '12 skills' },
          { id: 'team-builder', label: 'Team Builder', icon: '🏗️', metric: '2 teams' },
        ],
      },
      funding: {
        label: 'Funding',
        icon: '💰',
        children: [
          { id: 'revenue-tracker', label: 'Revenue Tracker', icon: '💵', metric: '$157K MRR' },
          { id: 'investor-dash', label: 'Investor Dashboard', icon: '📊', metric: '12 metrics' },
        ],
      },
    },
  },
};

function TreeNode({ nodeKey, node, depth = 0, selectedNode, onSelect, expandedNodes, onToggle }) {
  const isExpanded = expandedNodes.has(nodeKey);
  const hasChildren = node.children && Object.keys(node.children).length > 0;
  const isSelected = selectedNode?.id === nodeKey || selectedNode === nodeKey;
  const isLeaf = !hasChildren && node.metric;

  const handleClick = () => {
    if (hasChildren) {
      onToggle(nodeKey);
    }
    if (node.metric || (!hasChildren && node.label)) {
      onSelect({ id: nodeKey, ...node });
    }
  };

  return (
    <div className="tree-node" style={{ '--depth': depth }}>
      <div
        className={`tree-node-item ${isSelected ? 'selected' : ''} ${isLeaf ? 'leaf' : ''}`}
        onClick={handleClick}
        style={{ '--node-color': node.color || '#6b7280' }}
      >
        {hasChildren && (
          <span className={`tree-toggle ${isExpanded ? 'expanded' : ''}`}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M4 2L8 6L4 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        )}
        {!hasChildren && <span className="tree-dot" />}
        {node.icon && <span className="tree-icon">{node.icon}</span>}
        <span className="tree-label">{node.label}</span>
        {node.metric && <span className="tree-metric">{node.metric}</span>}
      </div>
      {hasChildren && isExpanded && (
        <div className="tree-children">
          {Object.entries(node.children).map(([childKey, child]) => (
            <TreeNode
              key={childKey}
              nodeKey={childKey}
              node={child}
              depth={depth + 1}
              selectedNode={selectedNode}
              onSelect={onSelect}
              expandedNodes={expandedNodes}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function DiscoveryTree({ onNodeSelect, selectedNodeId }) {
  const [expandedNodes, setExpandedNodes] = useState(
    new Set(['technology', 'ai-agents', 'automation', 'analytics', 'business', 'sales', 'marketing', 'operations', 'growth', 'scaling', 'hiring', 'funding'])
  );

  const handleToggle = (nodeKey) => {
    setExpandedNodes(prev => {
      const next = new Set(prev);
      if (next.has(nodeKey)) {
        next.delete(nodeKey);
      } else {
        next.add(nodeKey);
      }
      return next;
    });
  };

  return (
    <div className="discovery-tree">
      <div className="discovery-tree-header">
        <span className="discovery-tree-icon">🌍</span>
        <span className="discovery-tree-title">Discovery Tree</span>
      </div>
      <div className="discovery-tree-content">
        {Object.entries(TREE_DATA).map(([key, branch]) => (
          <div key={key} className="tree-branch" style={{ '--branch-color': branch.color }}>
            <div className="tree-branch-header" style={{ '--branch-color': branch.color }}>
              <span className="branch-icon">{branch.icon}</span>
              <span className="branch-label">{branch.label}</span>
              <button
                className={`branch-expand ${expandedNodes.has(key) ? 'expanded' : ''}`}
                onClick={() => handleToggle(key)}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            {expandedNodes.has(key) && (
              <div className="tree-branch-children">
                {Object.entries(branch.children).map(([childKey, child]) => (
                  <TreeNode
                    key={childKey}
                    nodeKey={childKey}
                    node={child}
                    depth={0}
                    selectedNode={selectedNodeId}
                    onSelect={onNodeSelect}
                    expandedNodes={expandedNodes}
                    onToggle={handleToggle}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
