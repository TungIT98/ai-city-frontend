/**
 * AI City - Province Panel
 * Anno 117-style province detail: metrics, production chain, sub-nodes
 */
import './ProvincePanel.css';
import ProductionChain from './ProductionChain';

const INDUSTRY_COLORS = {
  fintech: '#00C9A7',
  ecommerce: '#FF6B6B',
  manufacturing: '#4ECDC4',
};

const INDUSTRY_ICONS = {
  fintech: '🏦',
  ecommerce: '🛒',
  manufacturing: '🏭',
};

const STATUS_LABELS = {
  active: { label: 'Active', color: '#22c55e' },
  developing: { label: 'Developing', color: '#eab308' },
  exploring: { label: 'Exploring', color: '#6b7280' },
};

const SUB_NODE_STATUS = {
  hot: { color: '#ef4444', label: 'Hot' },
  warm: { color: '#f97316', label: 'Warm' },
  cold: { color: '#6b7280', label: 'Cold' },
  customer: { color: '#22c55e', label: 'Customer' },
};

export default function ProvincePanel({ province, onClose, onCompare }) {
  if (!province) return null;

  const status = STATUS_LABELS[province.status] || STATUS_LABELS.active;
  const industryColor = INDUSTRY_COLORS[province.industry] || '#6b7280';
  const industryIcon = INDUSTRY_ICONS[province.industry] || '📍';

  const formatCurrency = (v) => {
    if (v >= 1000000) return `$${(v / 1000000).toFixed(1)}M`;
    if (v >= 1000) return `$${(v / 1000).toFixed(0)}K`;
    return `$${v}`;
  };

  return (
    <div className="province-panel-overlay" onClick={onClose}>
      <div className="province-panel" onClick={e => e.stopPropagation()}>
        <div className="province-panel-header">
          <div className="province-panel-title-row">
            <button className="province-panel-back" onClick={onClose}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <span className="province-panel-id">{province.id}</span>
          </div>
          <div className="province-panel-subtitle">
            <span className="province-industry-icon">{industryIcon}</span>
            <span className="province-location">{province.label}</span>
          </div>
          <div className="province-status-row">
            <span className="province-status" style={{ '--status-color': status.color }}>
              <span className="province-status-dot" />
              {status.label}
            </span>
            {province.growthRate && (
              <span className="province-growth">
                Growth: ↑{province.growthRate}%
              </span>
            )}
          </div>
        </div>

        <div className="province-metrics-grid">
          <div className="province-metric-card">
            <span className="pm-value">{province.metrics?.totalLeads?.toLocaleString() ?? '—'}</span>
            <span className="pm-label">Total Leads</span>
          </div>
          <div className="province-metric-card">
            <span className="pm-value">{province.metrics?.qualifiedLeads?.toLocaleString() ?? '—'}</span>
            <span className="pm-label">Qualified</span>
          </div>
          <div className="province-metric-card">
            <span className="pm-value">{province.metrics?.totalCustomers?.toLocaleString() ?? '—'}</span>
            <span className="pm-label">Customers</span>
          </div>
          <div className="province-metric-card">
            <span className="pm-value" style={{ color: industryColor }}>
              {formatCurrency(province.metrics?.revenue ?? 0)}
            </span>
            <span className="pm-label">Revenue</span>
          </div>
          <div className="province-metric-card">
            <span className="pm-value">{province.metrics?.conversionRate ?? 0}%</span>
            <span className="pm-label">Conv Rate</span>
          </div>
          <div className="province-metric-card">
            <span className="pm-value">${(province.metrics?.avgDealSize ?? 0 / 1000).toFixed(0)}K</span>
            <span className="pm-label">Avg Deal</span>
          </div>
        </div>

        <ProductionChain
          provinceId={province.id}
          provinceName={province.label}
          metrics={{
            crawl: province.metrics?.crawlProgress ?? 82,
            process: province.metrics?.processProgress ?? 65,
            analyze: province.metrics?.analyzeProgress ?? 48,
            visualize: province.metrics?.visualizeProgress ?? 32,
            revenue: province.metrics?.revenue ? province.metrics.revenue / 1000000 : 1.2,
            conversionRate: province.metrics?.conversionRate ?? 12.4,
            avgCycle: province.metrics?.avgCycle ?? 14,
          }}
        />

        {province.subNodes && province.subNodes.length > 0 && (
          <div className="province-subnodes">
            <div className="province-subnodes-header">
              <span className="province-subnodes-title">Sub-Nodes</span>
              <span className="province-subnodes-count">{province.subNodes.length} companies</span>
            </div>
            <div className="province-subnodes-list">
              {province.subNodes.slice(0, 5).map(node => {
                const nodeStatus = SUB_NODE_STATUS[node.status] || SUB_NODE_STATUS.warm;
                return (
                  <div key={node.id} className="province-subnode-item">
                    <span className="subnode-dot" style={{ background: nodeStatus.color }} />
                    <div className="subnode-info">
                      <span className="subnode-name">{node.label}</span>
                      <span className="subnode-type">{node.type}</span>
                    </div>
                    <div className="subnode-metrics">
                      <span className="subnode-value">{formatCurrency(node.value ?? 0)}</span>
                      <span className="subnode-status" style={{ color: nodeStatus.color }}>{nodeStatus.label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="province-panel-actions">
          <button className="province-action-primary" onClick={() => {}}>
            View Full Pipeline →
          </button>
          {onCompare && (
            <button className="province-action-secondary" onClick={() => onCompare(province)}>
              Compare Provinces
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
