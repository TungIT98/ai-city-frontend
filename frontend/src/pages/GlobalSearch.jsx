/**
 * Global Search - Unified search across all data
 * Phase 6 Feature (AIC-603) | Phase 13: Backend API integration
 */
import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, X, Filter, Clock, FileText, Users, Zap, TrendingUp, AlertCircle } from 'lucide-react';
import api from '../services/api';
import './GlobalSearch.css';

const searchCategories = [
  { key: 'all', label: 'All', icon: Search },
  { key: 'leads', label: 'Leads', icon: Users },
  { key: 'agents', label: 'Agents', icon: Zap },
  { key: 'reports', label: 'Reports', icon: FileText },
  { key: 'analytics', label: 'Analytics', icon: TrendingUp },
  { key: 'automations', label: 'Automations', icon: Filter },
];

const quickFilters = [
  { key: 'recent', label: 'Recent' },
  { key: 'hot_leads', label: 'Hot Leads' },
  { key: 'active', label: 'Active' },
  { key: 'high_priority', label: 'High Priority' },
];

function GlobalSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState('all');
  const [filter, setFilter] = useState('recent');
  const [searchHistory, setSearchHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const navigate = useNavigate();

  // Load search history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('search_history');
    if (saved) {
      setSearchHistory(JSON.parse(saved));
    }
  }, []);

  // Debounced search
  const performSearch = useCallback(async (searchQuery, searchCategory) => {
    if (!searchQuery.trim()) {
      setResults(null);
      return;
    }

    setLoading(true);

    try {
      // Try backend API search first (Phase 13)
      const data = await api.globalSearch(searchQuery, { category: searchCategory });

      // Backend returns { results: { leads: [...], agents: [...], ... } } or similar
      if (data && typeof data === 'object') {
        const backendResults = {};
        // Normalize backend response
        if (data.leads || data.agents || data.reports || data.analytics || data.automations) {
          Object.keys(data).forEach(key => {
            if (Array.isArray(data[key]) && data[key].length > 0) {
              backendResults[key] = data[key].map(item => ({
                ...item,
                id: item.id || item._id,
                name: item.name || item.title || item.email,
              }));
            }
          });
        } else if (data.results) {
          Object.keys(data.results).forEach(key => {
            if (Array.isArray(data.results[key]) && data.results[key].length > 0) {
              backendResults[key] = data.results[key].map(item => ({
                ...item,
                id: item.id || item._id,
                name: item.name || item.title || item.email,
              }));
            }
          });
        } else if (data.data) {
          // Generic { data: [...] } wrapper
          const items = Array.isArray(data.data) ? data.data : [];
          if (items.length > 0) {
            backendResults.all = items.map(item => ({
              ...item,
              id: item.id || item._id,
              name: item.name || item.title || item.email,
            }));
          }
        }

        if (Object.keys(backendResults).length > 0) {
          setResults(backendResults);
        } else {
          setResults({ all: [] });
        }
      } else {
        setResults(null);
      }
    } catch (err) {
      console.warn('Backend search unavailable, using empty results:', err.message);
      setResults({});
    }

    setLoading(false);

    // Save to history
    if (searchQuery.trim()) {
      const newHistory = [
        { query: searchQuery, category: searchCategory, timestamp: Date.now() },
        ...searchHistory.filter(h => h.query !== searchQuery).slice(0, 9)
      ];
      setSearchHistory(newHistory);
      localStorage.setItem('search_history', JSON.stringify(newHistory));
    }
  }, [searchHistory]);

  // Debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query) {
        performSearch(query, category);
        setShowHistory(false);
      } else {
        setResults(null);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, category, performSearch]);

  const handleHistoryClick = (historyItem) => {
    setQuery(historyItem.query);
    setCategory(historyItem.category);
    setShowHistory(false);
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('search_history');
  };

  const getResultIcon = (type) => {
    const icons = {
      leads: Users,
      agents: Zap,
      reports: FileText,
      analytics: TrendingUp,
      automations: Filter,
    };
    const Icon = icons[type] || Search;
    return <Icon size={16} />;
  };

  const getResultLink = (type, item) => {
    const links = {
      leads: `/leads`,
      agents: `/agents`,
      reports: `/reports`,
      analytics: `/analytics`,
      automations: `/automation`,
    };
    return links[type] || '/dashboard';
  };

  const totalResults = results ? Object.values(results).reduce((sum, items) => sum + items.length, 0) : 0;

  return (
    <div className="global-search">
      <div className="search-header">
        <h1>Global Search</h1>
        <p>Search across leads, agents, reports, and more</p>
      </div>

      {/* Search Input */}
      <div className="search-input-wrapper">
        <Search className="search-icon" size={20} />
        <input
          type="text"
          placeholder="Search for leads, agents, reports..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowHistory(true)}
          className="search-input"
          autoFocus
        />
        {query && (
          <button className="clear-btn" onClick={() => setQuery('')}>
            <X size={18} />
          </button>
        )}
        <button className="search-btn">Search</button>

        {/* Search History Dropdown */}
        {showHistory && searchHistory.length > 0 && !query && (
          <div className="search-history">
            <div className="history-header">
              <span>Recent Searches</span>
              <button onClick={clearHistory} className="clear-history">Clear</button>
            </div>
            {searchHistory.map((item, index) => (
              <button
                key={index}
                className="history-item"
                onClick={() => handleHistoryClick(item)}
              >
                <Clock size={14} />
                <span>{item.query}</span>
                <span className="history-category">{item.category}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Categories */}
      <div className="search-categories">
        {searchCategories.map((cat) => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.key}
              className={`category-btn ${category === cat.key ? 'active' : ''}`}
              onClick={() => setCategory(cat.key)}
            >
              <Icon size={16} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Quick Filters */}
      <div className="quick-filters">
        {quickFilters.map((f) => (
          <button
            key={f.key}
            className={`filter-chip ${filter === f.key ? 'active' : ''}`}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Results */}
      {loading ? (
        <div className="search-loading">
          <div className="spinner"></div>
          <span>Searching...</span>
        </div>
      ) : results && Object.keys(results).length > 0 && Object.values(results).some(v => v && v.length > 0) ? (
        <div className="search-results">
          <div className="results-header">
            <span className="results-count">{totalResults} results found</span>
            <span className="results-query">for "{query}"</span>
          </div>

          {Object.entries(results).map(([type, items]) => (
            <div key={type} className="result-section">
              <h3 className="section-title">
                {getResultIcon(type)}
                <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                <span className="section-count">({items.length})</span>
              </h3>
              <div className="result-list">
                {items.map((item, index) => (
                  <Link
                    key={index}
                    to={getResultLink(type, item)}
                    className="result-item"
                  >
                    <div className="result-main">
                      <span className="result-name">{item.name}</span>
                      {item.email && <span className="result-email">{item.email}</span>}
                      {item.type && <span className="result-type">{item.type}</span>}
                    </div>
                    <div className="result-meta">
                      {item.status && (
                        <span className={`status-badge status-${item.status}`}>
                          {item.status}
                        </span>
                      )}
                      {item.score !== undefined && (
                        <span className="result-score">Score: {item.score}</span>
                      )}
                      {item.date && <span className="result-date">{item.date}</span>}
                      {item.runs !== undefined && (
                        <span className="result-runs">{item.runs} runs</span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : query && !loading ? (
        <div className="no-results">
          <AlertCircle size={48} />
          <h3>No results found</h3>
          <p>Try adjusting your search terms or filters</p>
        </div>
      ) : (
        <div className="search-empty">
          <Search size={48} />
          <h3>Start searching</h3>
          <p>Enter a search term to find leads, agents, reports, and more</p>
        </div>
      )}
    </div>
  );
}

export default GlobalSearch;
