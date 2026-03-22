/**
 * AI City - Globe Filters
 * Industry × Region × Size filter bar (Anno 117 Cultural Choices)
 */
import './GlobeFilters.css';

const INDUSTRIES = [
  { id: 'all', label: 'All', icon: '🌐' },
  { id: 'fintech', label: 'Fintech', icon: '🏦', color: '#00C9A7' },
  { id: 'ecommerce', label: 'E-commerce', icon: '🛒', color: '#FF6B6B' },
  { id: 'manufacturing', label: 'Manufacturing', icon: '🏭', color: '#4ECDC4' },
];

const REGIONS = [
  { id: 'all', label: 'All', icon: '🌐' },
  { id: 'VN', label: '🇻🇳 Vietnam', icon: '🇻🇳' },
  { id: 'SEA', label: '🌏 SEA', icon: '🌏' },
  { id: 'GLOBAL', label: '🌍 Global', icon: '🌍' },
];

const SIZES = [
  { id: 'all', label: 'All', icon: '🌐' },
  { id: 'startup', label: 'Startup', icon: '🚀', color: '#22c55e' },
  { id: 'sme', label: 'SME', icon: '💼', color: '#3b82f6' },
  { id: 'enterprise', label: 'Enterprise', icon: '🏢', color: '#8b5cf6' },
];

const PRIORITIES = [
  { id: 'revenue', label: 'Revenue' },
  { id: 'efficiency', label: 'Efficiency' },
  { id: 'innovation', label: 'Innovation' },
];

export default function GlobeFilters({ filters, onFilterChange }) {
  const setFilter = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <div className="globe-filters">
      <div className="filter-row">
        <div className="filter-group">
          {INDUSTRIES.map(ind => (
            <button
              key={ind.id}
              className={`filter-chip ${filters.industry === ind.id ? 'active' : ''}`}
              style={filters.industry === ind.id && ind.color ? { '--chip-color': ind.color, '--chip-bg': `${ind.color}20` } : {}}
              onClick={() => setFilter('industry', ind.id)}
            >
              {ind.icon && <span className="chip-icon">{ind.icon}</span>}
              <span className="chip-label">{ind.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="filter-row">
        <div className="filter-group">
          {REGIONS.map(reg => (
            <button
              key={reg.id}
              className={`filter-chip ${filters.region === reg.id ? 'active' : ''}`}
              onClick={() => setFilter('region', reg.id)}
            >
              {reg.icon && <span className="chip-icon">{reg.icon}</span>}
              <span className="chip-label">{reg.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="filter-row">
        <div className="filter-group">
          {SIZES.map(sz => (
            <button
              key={sz.id}
              className={`filter-chip ${filters.size === sz.id ? 'active' : ''}`}
              style={filters.size === sz.id && sz.color ? { '--chip-color': sz.color, '--chip-bg': `${sz.color}20` } : {}}
              onClick={() => setFilter('size', sz.id)}
            >
              {sz.icon && <span className="chip-icon">{sz.icon}</span>}
              <span className="chip-label">{sz.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
