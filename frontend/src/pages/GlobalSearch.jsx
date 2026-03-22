import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Users, BarChart3, FileText, Globe, TrendingUp, ArrowRight, Loader2, X } from 'lucide-react';
import axios from 'axios';

const categories = [
  { id: 'all', label: 'Tất cả', icon: Search, color: '#6366f1' },
  { id: 'leads', label: 'Leads', icon: Users, color: '#10b981' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, color: '#f59e0b' },
  { id: 'reports', label: 'Reports', icon: FileText, color: '#3b82f6' },
  { id: 'agents', label: 'Agents', icon: Globe, color: '#8b5cf6' },
];

export default function GlobalSearch() {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) setRecent(JSON.parse(saved));
    inputRef.current?.focus();
  }, []);

  const search = async (q) => {
    if (!q.trim()) { setResults([]); return; }
    setLoading(true);
    try {
      const backend = import.meta.env.VITE_API_URL || 'https://aicity-backend-deploy.vercel.app';
      const res = await axios.get(`${backend}/api/search?q=${encodeURIComponent(q)}`, { timeout: 5000 });
      let data = res.data?.results || res.data?.data || [];

      if (activeCategory !== 'all') {
        data = data.filter(item => item.type === activeCategory);
      }

      // Save recent
      const updated = [q, ...recent.filter(r => r !== q)].slice(0, 5);
      setRecent(updated);
      localStorage.setItem('recentSearches', JSON.stringify(updated));

      setResults(data);
    } catch {
      // Fallback mock results
      const mockResults = [
        { id: '1', type: 'leads', title: 'Lead: Nguyễn Văn A', subtitle: 'Công ty ABC - Qualified', url: '/leads' },
        { id: '2', type: 'analytics', title: 'Analytics: Q1 2026', subtitle: 'Doanh thu tăng 23%', url: '/analytics' },
        { id: '3', type: 'reports', title: 'Report: Monthly Summary', subtitle: 'Tháng 3/2026', url: '/reports' },
      ].filter(r => r.title.toLowerCase().includes(q.toLowerCase()));
      setResults(mockResults);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => search(query), 300);
    return () => clearTimeout(timer);
  }, [query, activeCategory]);

  const clearRecent = () => {
    setRecent([]);
    localStorage.removeItem('recentSearches');
  };

  const getCategoryInfo = (type) => categories.find(c => c.id === type) || categories[0];

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', padding: '24px' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
        {/* Search Input */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          marginBottom: '24px',
        }}>
          {loading ? (
            <Loader2 size={20} style={{ marginLeft: '12px', animation: 'spin 1s linear infinite', color: '#9ca3af' }} />
          ) : (
            <Search size={20} style={{ marginLeft: '12px', color: '#9ca3af' }} />
          )}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm kiếm leads, báo cáo, agents..."
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: '16px',
              padding: '12px 0',
              color: '#111827',
            }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              style={{
                background: '#f3f4f6',
                border: 'none',
                borderRadius: '8px',
                padding: '6px',
                cursor: 'pointer',
                color: '#6b7280',
              }}
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Category Tabs */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '24px',
          overflowX: 'auto',
          paddingBottom: '4px',
        }}>
          {categories.map(({ id, label, icon: Icon, color }) => (
            <button
              key={id}
              onClick={() => setActiveCategory(id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                border: 'none',
                borderRadius: '20px',
                background: activeCategory === id ? color : '#f3f4f6',
                color: activeCategory === id ? 'white' : '#6b7280',
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s',
              }}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>

        {/* Results */}
        {results.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {results.map((item) => {
              const cat = getCategoryInfo(item.type);
              return (
                <div
                  key={item.id}
                  onClick={() => navigate(item.url || `/${item.type}`)}
                  style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    border: '1px solid #f3f4f6',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = cat.color; e.currentTarget.style.boxShadow = `0 4px 12px ${cat.color}20`; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#f3f4f6'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: `${cat.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <cat.icon size={18} style={{ color: cat.color }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '2px' }}>
                      {item.title}
                    </p>
                    <p style={{ fontSize: '12px', color: '#6b7280', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.subtitle}
                    </p>
                  </div>
                  <ArrowRight size={16} style={{ color: '#d1d5db', flexShrink: 0 }} />
                </div>
              );
            })}
          </div>
        ) : query && !loading ? (
          <div style={{ textAlign: 'center', padding: '48px', color: '#9ca3af' }}>
            <Search size={40} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
            <p style={{ fontSize: '15px' }}>Không tìm thấy kết quả cho "{query}"</p>
          </div>
        ) : (
          <>
            {/* Recent Searches */}
            {recent.length > 0 && (
              <div style={{ marginBottom: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '13px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Tìm kiếm gần đây
                  </h3>
                  <button onClick={clearRecent} style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: '12px', cursor: 'pointer' }}>
                    Xóa tất cả
                  </button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {recent.map((r, i) => (
                    <button
                      key={i}
                      onClick={() => setQuery(r)}
                      style={{
                        background: '#f3f4f6',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '6px 14px',
                        fontSize: '13px',
                        color: '#374151',
                        cursor: 'pointer',
                      }}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Links */}
            <div>
              <h3 style={{ fontSize: '13px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
                Truy cập nhanh
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                {[
                  { label: 'Dashboard', url: '/dashboard', icon: BarChart3, color: '#6366f1' },
                  { label: 'Leads', url: '/leads', icon: Users, color: '#10b981' },
                  { label: 'Analytics', url: '/analytics', icon: TrendingUp, color: '#f59e0b' },
                  { label: 'Reports', url: '/reports', icon: FileText, color: '#3b82f6' },
                ].map(({ label, url, icon: Icon, color }) => (
                  <div
                    key={url}
                    onClick={() => navigate(url)}
                    style={{
                      background: 'white',
                      borderRadius: '12px',
                      padding: '16px',
                      cursor: 'pointer',
                      border: '1px solid #f3f4f6',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = color; e.currentTarget.style.boxShadow = `0 4px 12px ${color}20`; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#f3f4f6'; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={18} style={{ color }} />
                    </div>
                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
