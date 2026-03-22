/**
 * AI City - Production Chain Visualization
 * Anno 117-style: Crawl → Process → Analyze → Visualize
 * Animated pipeline stages with metrics
 */
import { useState, useEffect } from 'react';
import './ProductionChain.css';

const CHAIN_STAGES = [
  { id: 'crawl', label: 'Crawl', icon: '🌐', color: '#3b82f6' },
  { id: 'process', label: 'Process', icon: '⚙️', color: '#8b5cf6' },
  { id: 'analyze', label: 'Analyze', icon: '🔍', color: '#06b6d4' },
  { id: 'visualize', label: 'Visualize', icon: '📊', color: '#22c55e' },
];

const STAGE_METADATA = {
  crawl: { label: 'Crawl', sublabel: 'Sources', defaultValue: 82, suffix: '%', detailKey: 'sources' },
  process: { label: 'Process', sublabel: 'Deduplicated', defaultValue: 65, suffix: '%', detailKey: 'deduped' },
  analyze: { label: 'Analyze', sublabel: 'Qualified', defaultValue: 48, suffix: '%', detailKey: 'qualified' },
  visualize: { label: 'Visualize', sublabel: 'Hot Leads', defaultValue: 32, suffix: '%', detailKey: 'hot' },
};

function AnimatedBar({ value, color, delay = 0 }) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setWidth(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return (
    <div className="chain-bar-track">
      <div
        className="chain-bar-fill"
        style={{ width: `${width}%`, background: color, transitionDelay: `${delay}ms` }}
      />
    </div>
  );
}

export default function ProductionChain({ provinceId, provinceName, metrics }) {
  const [chainData, setChainData] = useState(() =>
    CHAIN_STAGES.map(s => ({
      ...s,
      value: metrics?.[s.id] ?? STAGE_METADATA[s.id].defaultValue,
      detail: metrics?.[`${s.id}Detail`] ?? getDefaultDetail(s.id),
    }))
  );

  function getDefaultDetail(id) {
    const d = {
      crawl: '12 active',
      process: '4,231',
      analyze: '1,847',
      visualize: '234',
    };
    return d[id] || '';
  }

  // Update when province changes
  useEffect(() => {
    if (metrics) {
      setChainData(CHAIN_STAGES.map(s => ({
        ...s,
        value: metrics?.[s.id] ?? STAGE_METADATA[s.id].defaultValue,
        detail: metrics?.[`${s.id}Detail`] ?? getDefaultDetail(s.id),
      })));
    } else {
      setChainData(CHAIN_STAGES.map(s => ({
        ...s,
        value: STAGE_METADATA[s.id].defaultValue,
        detail: getDefaultDetail(s.id),
      })));
    }
  }, [provinceId]);

  const conversionRate = metrics?.conversionRate ?? 12.4;
  const avgCycle = metrics?.avgCycle ?? 14;
  const revenue = metrics?.revenue ?? 1.2;

  return (
    <div className="production-chain">
      <div className="chain-header">
        <div className="chain-title">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 7H13M7 1L13 7L7 13" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Production Chain</span>
        </div>
        {provinceName && <span className="chain-province">{provinceName}</span>}
      </div>

      <div className="chain-stages">
        {chainData.map((stage, idx) => (
          <div key={stage.id} className="chain-stage">
            <div className="chain-stage-header">
              <span className="chain-stage-icon">{stage.icon}</span>
              <span className="chain-stage-label">{stage.label}</span>
              <span className="chain-stage-value">{stage.value}{STAGE_METADATA[stage.id].suffix}</span>
            </div>
            <AnimatedBar value={stage.value} color={stage.color} delay={idx * 100} />
            <div className="chain-stage-detail">
              <span className="chain-detail-key">{STAGE_METADATA[stage.id].sublabel}:</span>
              <span className="chain-detail-value">{stage.detail}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="chain-flow">
        <div className="chain-flow-line">
          {chainData.map((stage, idx) => (
            <div key={stage.id} className="chain-flow-node" style={{ '--color': stage.color }}>
              <div className="chain-flow-dot" />
              <span className="chain-flow-label">{stage.icon}</span>
              {idx < chainData.length - 1 && (
                <div className="chain-flow-arrow" style={{ '--from': stage.color, '--to': chainData[idx + 1].color }}>
                  <svg width="24" height="8" viewBox="0 0 24 8">
                    <defs>
                      <linearGradient id={`grad-${stage.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor={stage.color} />
                        <stop offset="100%" stopColor={chainData[idx + 1].color} />
                      </linearGradient>
                    </defs>
                    <line x1="0" y1="4" x2="20" y2="4" stroke={`url(#grad-${stage.id})`} strokeWidth="1.5" strokeDasharray="3 2" />
                    <path d="M16 1L21 4L16 7" stroke={chainData[idx + 1].color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="chain-metrics">
        <div className="chain-metric">
          <span className="chain-metric-icon">📈</span>
          <span className="chain-metric-value">${revenue}M</span>
          <span className="chain-metric-label">Revenue</span>
        </div>
        <div className="chain-metric">
          <span className="chain-metric-icon">🎯</span>
          <span className="chain-metric-value">{conversionRate}%</span>
          <span className="chain-metric-label">Conv Rate</span>
        </div>
        <div className="chain-metric">
          <span className="chain-metric-icon">⏱️</span>
          <span className="chain-metric-value">{avgCycle}d</span>
          <span className="chain-metric-label">Avg Cycle</span>
        </div>
      </div>
    </div>
  );
}
