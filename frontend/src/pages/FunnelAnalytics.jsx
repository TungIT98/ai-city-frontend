/**
 * Funnel Analytics Page (AIC-400, AIC-1004)
 * Interactive conversion funnel with drill-down, attribution model toggle
 * Phase 10: Interactive SVG funnel, attribution model comparison
 */
import { useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const STAGES = [
  { id: 'visitors', label: 'Visitors', count: 45230, color: '#4facfe' },
  { id: 'leads', label: 'Leads', count: 7845, color: '#10b981' },
  { id: 'qualified', label: 'Qualified', count: 2340, color: '#f59e0b' },
  { id: 'opportunities', label: 'Opportunities', count: 890, color: '#8b5cf6' },
  { id: 'customers', label: 'Customers', count: 245, color: '#22c55e' },
];

const DRILLDOWN_DATA = {
  visitors: { organic: 15230, paid: 18400, social: 7600, referral: 4000 },
  leads: { website: 3200, webinar: 2100, demo: 1545, cold: 1000 },
  qualified: { hot: 820, warm: 960, cold: 560 },
  opportunities: { '100K+': 320, '50K-100K': 280, '<50K': 290 },
  customers: { 'Enterprise': 85, 'Pro': 110, 'Starter': 50 },
};

const ATTRIBUTION_MODELS = [
  { id: 'first_touch', name: 'First Touch', description: '100% credit to first interaction', customers: 89, revenue: 'VND 445M', accuracy: 72 },
  { id: 'last_touch', name: 'Last Touch', description: '100% credit to last interaction', customers: 112, revenue: 'VND 560M', accuracy: 68 },
  { id: 'linear', name: 'Linear', description: 'Equal credit across all touchpoints', customers: 156, revenue: 'VND 780M', accuracy: 85 },
  { id: 'time_decay', name: 'Time Decay', description: 'More credit to recent touchpoints', customers: 134, revenue: 'VND 670M', accuracy: 81 },
];

export default function FunnelAnalytics() {
  const [period, setPeriod] = useState('30d');
  const [selectedStage, setSelectedStage] = useState(null);
  const [activeModel, setActiveModel] = useState('linear');

  const funnelData = {
    labels: STAGES.map(s => s.label),
    datasets: [{
      label: 'Count',
      data: STAGES.map(s => s.count),
      backgroundColor: STAGES.map(s => s.color),
      borderRadius: 8,
      borderSkipped: false,
    }],
  };

  const funnelOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => {
            const idx = context.dataIndex;
            const nextIdx = idx + 1;
            const current = context.raw;
            if (nextIdx < STAGES.length) {
              const next = STAGES[nextIdx].count;
              const rate = ((next / current) * 100).toFixed(1);
              return [`Count: ${current.toLocaleString()}`, `Conversion: ${rate}%`];
            }
            return `Count: ${current.toLocaleString()}`;
          },
        },
      },
    },
    onClick: (evt, elements) => {
      if (elements.length > 0) {
        const idx = elements[0].index;
        setSelectedStage(selectedStage?.id === STAGES[idx].id ? null : STAGES[idx]);
      }
    },
    scales: {
      y: { beginAtZero: true, grid: { color: 'rgba(128,128,128,0.1)' } },
      x: { grid: { display: false } },
    },
  };

  const conversionRates = STAGES.slice(0, -1).map((stage, idx) => {
    const next = STAGES[idx + 1];
    const rate = ((next.count / stage.count) * 100).toFixed(1);
    const prevRate = idx > 0 ? parseFloat(((STAGES[idx].count / STAGES[idx - 1].count) * 100).toFixed(1)) : parseFloat(rate);
    const change = idx > 0 ? rate - prevRate : 0;
    return { stage: `${stage.label} → ${next.label}`, rate: parseFloat(rate), change, positive: change >= 0 };
  });

  // Cohort data
  const cohortData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      { label: 'Week 0', data: [100, 100, 100, 100, 100, 100], borderColor: '#4facfe', fill: false, tension: 0.3 },
      { label: 'Week 1', data: [72, 75, 78, 80, 82, 84], borderColor: '#10b981', fill: false, tension: 0.3 },
      { label: 'Week 2', data: [55, 58, 62, 65, 68, 70], borderColor: '#f59e0b', fill: false, tension: 0.3 },
      { label: 'Week 4', data: [38, 42, 45, 48, 52, 55], borderColor: '#8b5cf6', fill: false, tension: 0.3 },
    ],
  };

  // Drill-down chart
  const drilldownChart = selectedStage ? {
    labels: Object.keys(DRILLDOWN_DATA[selectedStage.id] || {}),
    datasets: [{
      label: selectedStage.label,
      data: Object.values(DRILLDOWN_DATA[selectedStage.id] || {}),
      backgroundColor: `${selectedStage.color}cc`,
      borderColor: selectedStage.color,
      borderWidth: 2,
      borderRadius: 6,
    }],
  } : null;

  const drilldownOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const total = STAGES.find(s => s.id === selectedStage?.id)?.count || 1;
            const value = ctx.raw;
            const pct = ((value / total) * 100).toFixed(1);
            return `${value.toLocaleString()} (${pct}% of ${selectedStage?.label})`;
          },
        },
      },
    },
    scales: {
      y: { beginAtZero: true, grid: { color: 'rgba(128,128,128,0.1)' } },
      x: { grid: { display: false } },
    },
  };

  // Active model for attribution
  const activeAttrModel = ATTRIBUTION_MODELS.find(m => m.id === activeModel);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>Funnel Analytics</h2>
          <p>Conversion funnel and cohort retention analysis</p>
        </div>
        <select value={period} onChange={e => setPeriod(e.target.value)} className="period-select">
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
      </div>

      {/* Attribution Model Toggle */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">
          <h3 className="card-title">Attribution Model</h3>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
          {ATTRIBUTION_MODELS.map(model => (
            <button
              key={model.id}
              onClick={() => setActiveModel(model.id)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: `2px solid ${activeModel === model.id ? model.id === 'linear' ? '#22c55e' : model.id === 'time_decay' ? '#8b5cf6' : '#4facfe' : '#e5e7eb'}`,
                background: activeModel === model.id ? `${model.id === 'linear' ? '#22c55e' : model.id === 'time_decay' ? '#8b5cf6' : '#4facfe'}15` : 'white',
                cursor: 'pointer',
                fontWeight: activeModel === model.id ? 600 : 400,
                color: activeModel === model.id ? '#1a1a2e' : '#6b7280',
                transition: 'all 0.2s',
                fontSize: '13px',
              }}
            >
              {model.name}
            </button>
          ))}
        </div>
        {activeAttrModel && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', padding: '12px', background: '#f9fafb', borderRadius: '8px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: 700, color: '#1a1a2e' }}>{activeAttrModel.customers}</div>
              <div style={{ fontSize: '11px', color: '#6b7280' }}>Attributed Customers</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: 700, color: '#10b981' }}>{activeAttrModel.revenue}</div>
              <div style={{ fontSize: '11px', color: '#6b7280' }}>Attributed Revenue</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: 700, color: '#4facfe' }}>{activeAttrModel.accuracy}%</div>
              <div style={{ fontSize: '11px', color: '#6b7280' }}>Model Accuracy</div>
            </div>
            <div style={{ textAlign: 'center', gridColumn: '1 / -1' }}>
              <div style={{ fontSize: '12px', color: '#6b7280', fontStyle: 'italic' }}>"{activeAttrModel.description}"</div>
            </div>
          </div>
        )}
      </div>

      {/* Conversion Funnel with Drill-down */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">
          <h3 className="card-title">Conversion Funnel</h3>
          <span style={{ fontSize: '12px', color: '#6b7280' }}>Click a stage to drill down</span>
        </div>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <Bar data={funnelData} options={funnelOptions} />
        </div>

        {/* Stage conversion rates */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginTop: 24 }}>
          {conversionRates.map((item, idx) => (
            <div
              key={idx}
              style={{
                padding: 14, background: '#f9fafb', borderRadius: 8, textAlign: 'center',
                cursor: 'pointer', border: `1px solid ${item.positive ? '#d1fae5' : '#fee2e2'}`,
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 6 }}>{item.stage}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#1a1a2e' }}>{item.rate}%</div>
              <div style={{ fontSize: 11, marginTop: 4, color: item.positive ? '#10b981' : '#ef4444' }}>
                {item.positive ? '↑' : '↓'} {Math.abs(item.change).toFixed(1)}% vs prev
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Drill-down Panel */}
      {selectedStage && (
        <div className="card" style={{ marginBottom: 24, border: `2px solid ${selectedStage.color}40`, animation: 'fadeIn 0.3s ease' }}>
          <div className="card-header">
            <h3 className="card-title" style={{ color: selectedStage.color }}>
              📊 {selectedStage.label} Breakdown
            </h3>
            <button
              onClick={() => setSelectedStage(null)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: '#6b7280' }}
            >
              ✕ Close
            </button>
          </div>
          <div style={{ maxWidth: 500, margin: '0 auto' }}>
            <Bar data={drilldownChart} options={drilldownOptions} />
          </div>
          <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 8 }}>
            {Object.entries(DRILLDOWN_DATA[selectedStage.id] || {}).map(([key, value]) => {
              const total = STAGES.find(s => s.id === selectedStage.id)?.count || 1;
              const pct = ((value / total) * 100).toFixed(1);
              return (
                <div key={key} style={{ textAlign: 'center', padding: '8px', background: '#f9fafb', borderRadius: 6 }}>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: selectedStage.color }}>{value.toLocaleString()}</div>
                  <div style={{ fontSize: '11px', color: '#6b7280' }}>{key}</div>
                  <div style={{ fontSize: '10px', color: '#9ca3af' }}>{pct}%</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Cohort Retention Heatmap */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">
          <h3 className="card-title">Cohort Retention</h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="cohort-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9fafb' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', color: '#6b7280', fontWeight: 600 }}>Cohort</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '12px', color: '#6b7280', fontWeight: 600 }}>Users</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '12px', color: '#6b7280', fontWeight: 600 }}>Week 0</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '12px', color: '#6b7280', fontWeight: 600 }}>Week 1</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '12px', color: '#6b7280', fontWeight: 600 }}>Week 2</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '12px', color: '#6b7280', fontWeight: 600 }}>Week 4</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '12px', color: '#6b7280', fontWeight: 600 }}>Week 8</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Jan 2026', users: 245, r0: 100, r1: 78, r2: 62, r3: 48, r4: 35 },
                { name: 'Feb 2026', users: 312, r0: 100, r1: 80, r2: 65, r3: 52, r4: 40 },
                { name: 'Mar 2026', users: 287, r0: 100, r1: 82, r2: 68, r3: 55, r4: null },
              ].map((cohort, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #f5f5f5' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 500 }}>{cohort.name}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'right', color: '#6b7280' }}>{cohort.users}</td>
                  {[cohort.r0, cohort.r1, cohort.r2, cohort.r3, cohort.r4].map((rate, i) => (
                    <td key={i} style={{ padding: '12px 16px', textAlign: 'right' }}>
                      {rate !== null ? (
                        <span style={{
                          background: `rgba(79, 172, 254, ${rate / 100})`,
                          color: rate > 60 ? 'white' : '#374151',
                          padding: '4px 10px',
                          borderRadius: 4,
                          fontSize: 12,
                          fontWeight: 500,
                          display: 'inline-block',
                          minWidth: '48px',
                          textAlign: 'center',
                        }}>
                          {rate}%
                        </span>
                      ) : '—'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Attribution Comparison Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Attribution Model Comparison</h3>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9fafb' }}>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', color: '#6b7280', fontWeight: 600 }}>Model</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '12px', color: '#6b7280', fontWeight: 600 }}>Customers</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '12px', color: '#6b7280', fontWeight: 600 }}>Revenue</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '12px', color: '#6b7280', fontWeight: 600 }}>Accuracy</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', color: '#6b7280', fontWeight: 600 }}>Method</th>
            </tr>
          </thead>
          <tbody>
            {ATTRIBUTION_MODELS.map((item, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid #f5f5f5', background: activeModel === item.id ? '#f0f9ff' : 'transparent' }}>
                <td style={{ padding: '12px 16px', fontWeight: 600 }}>{item.name}</td>
                <td style={{ padding: '12px 16px', textAlign: 'right' }}>{item.customers}</td>
                <td style={{ padding: '12px 16px', textAlign: 'right', color: '#10b981', fontWeight: 500 }}>{item.revenue}</td>
                <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}>
                    <div style={{ width: 60, height: 6, background: '#f0f0f0', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ width: `${item.accuracy}%`, height: '100%', background: item.accuracy > 80 ? '#10b981' : '#4facfe', borderRadius: 3 }} />
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 500, color: item.accuracy > 80 ? '#10b981' : '#4facfe', minWidth: 32 }}>{item.accuracy}%</span>
                  </div>
                </td>
                <td style={{ padding: '12px 16px', fontSize: 12, color: '#6b7280' }}>{item.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
