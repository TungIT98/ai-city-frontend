/**
 * Leads Page
 * Lead management and listing with scoring, attribution, bulk ops, CSV export
 * Phase 9: Added bulk operations and CSV export
 * Phase 10: Toast notifications instead of alert()
 */
import { useState, useEffect } from 'react';
import api from '../services/api';
import { exportLeads } from '../utils/export';
import { useToast } from '../contexts/ToastContext';

// Lead scoring utility functions
const getScoreColor = (score) => {
  if (score >= 70) return '#10b981'; // green - hot
  if (score >= 40) return '#f59e0b'; // orange - warm
  return '#6b7280'; // gray - cold
};

const getScoreLabel = (score) => {
  if (score >= 70) return 'Hot';
  if (score >= 40) return 'Warm';
  return 'Cold';
};

const getScoreBreakdown = (lead) => {
  const engagementScore = Math.min(40, (lead.status === 'qualified' ? 40 : lead.status === 'contacted' ? 20 : 10));
  const profileScore = lead.email?.includes('@company') ? 30 : lead.phone ? 25 : 15;
  const activityScore = lead.status === 'converted' ? 30 : lead.status === 'new' ? 10 : 20;
  return {
    engagement: engagementScore,
    profile: profileScore,
    activity: activityScore,
    total: engagementScore + profileScore + activityScore
  };
};

const Leads = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [leads, setLeads] = useState([]);
  const [filter, setFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', source: 'website' });
  const [formErrors, setFormErrors] = useState({});
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [bulkAction, setBulkAction] = useState('');
  const [bulkLoading, setBulkLoading] = useState(false);

  useEffect(() => {
    loadLeads();
  }, [filter]);

  const loadLeads = async () => {
    try {
      setLoading(true);
      const data = await api.getLeads(filter || null, 50);
      // Backend returns array directly or { data: [...] }
      const rawLeads = Array.isArray(data) ? data : (data?.data || []);
      // Normalize backend fields (created_at -> createdAt, score from metadata)
      const normalized = rawLeads.map(lead => ({
        ...lead,
        createdAt: lead.created_at || lead.createdAt,
        score: lead.score || (lead.metadata?.score ?? 50),
        source: lead.source || lead.metadata?.source || 'unknown',
      }));
      setLeads(normalized);
      setError(null);
      setSelectedIds(new Set());
    } catch (err) {
      console.error('Failed to load leads:', err);
      setError('Failed to load leads. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email format';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      await api.createLead(formData);
      setShowModal(false);
      setFormData({ name: '', email: '', phone: '', source: 'website' });
      setFormErrors({});
      loadLeads();
    } catch (err) {
      toast.error('Failed to create lead: ' + (err.message || 'Unknown error'));
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await api.updateLead(id, { status });
      loadLeads();
    } catch (err) {
      toast.error('Failed to update lead status');
    }
  };

  const handleBulkAction = async () => {
    if (!bulkAction || selectedIds.size === 0) return;
    setBulkLoading(true);
    try {
      const updates = Array.from(selectedIds);
      if (bulkAction === 'delete') {
        if (!confirm(`Delete ${updates.length} lead(s)?`)) { setBulkLoading(false); return; }
      toast.success(`${updates.length} leads deleted`);
        await Promise.all(updates.map(id => api.deleteLead?.(id).catch(() => {})));
      } else {
        await Promise.all(updates.map(id => api.updateLead(id, { status: bulkAction })));
        toast.success(`${updates.length} leads updated to "${bulkAction}"`);
      }
      setSelectedIds(new Set());
      setBulkAction('');
      loadLeads();
    } catch (err) {
      toast.error('Bulk action failed');
    } finally {
      setBulkLoading(false);
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    setSelectedIds(prev =>
      prev.size === leads.length ? new Set() : new Set(leads.map(l => l.id))
    );
  };

  const statusOptions = ['new', 'contacted', 'qualified', 'converted', 'lost'];
  const [scoreTooltip, setScoreTooltip] = useState(null);

  const displayLeads = Array.isArray(leads) ? leads : [];
  const allSelected = displayLeads.length > 0 && selectedIds.size === displayLeads.length;

  return (
    <div className="leads-page">
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2>Leads</h2>
            <p>Manage your leads and conversions</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => exportLeads(displayLeads)}
              disabled={displayLeads.length === 0}
              style={{
                padding: '10px 20px',
                background: displayLeads.length > 0 ? 'white' : '#f5f5f5',
                color: displayLeads.length > 0 ? '#333' : '#999',
                border: '1px solid #eee',
                borderRadius: '8px',
                cursor: displayLeads.length > 0 ? 'pointer' : 'not-allowed',
                fontWeight: 500,
                fontSize: 14,
              }}
              title="Export to CSV"
            >
              Export CSV
            </button>
            <button
              onClick={() => setShowModal(true)}
              style={{
                padding: '10px 24px',
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              + Add Lead
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Action Bar */}
      {selectedIds.size > 0 && (
        <div style={{
          marginBottom: 16,
          padding: '12px 16px',
          background: '#e0f2fe',
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          fontSize: 14,
        }}>
          <span style={{ fontWeight: 600, color: '#0369a1' }}>
            {selectedIds.size} selected
          </span>
          <select
            value={bulkAction}
            onChange={e => setBulkAction(e.target.value)}
            style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #b3d9f4', fontSize: 13 }}
          >
            <option value="">Bulk action...</option>
            {statusOptions.map(s => <option key={s} value={s}>Set status: {s}</option>)}
            <option value="delete">Delete selected</option>
          </select>
          <button
            onClick={handleBulkAction}
            disabled={!bulkAction || bulkLoading}
            style={{
              padding: '6px 16px',
              background: bulkAction ? '#0369a1' : '#ccc',
              color: 'white',
              border: 'none',
              borderRadius: 6,
              cursor: bulkAction ? 'pointer' : 'not-allowed',
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            {bulkLoading ? 'Applying...' : 'Apply'}
          </button>
          <button
            onClick={() => setSelectedIds(new Set())}
            style={{ padding: '6px 12px', background: 'transparent', border: 'none', color: '#0369a1', cursor: 'pointer', fontSize: 13 }}
          >
            Clear
          </button>
        </div>
      )}

      {/* Filters */}
      <div style={{ marginBottom: '24px', display: 'flex', gap: '12px' }}>
        <button
          onClick={() => setFilter('')}
          style={{
            padding: '8px 16px',
            background: filter === '' ? '#4facfe' : 'white',
            color: filter === '' ? 'white' : '#666',
            border: '1px solid #eee',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          All
        </button>
        {statusOptions.map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            style={{
              padding: '8px 16px',
              background: filter === status ? '#4facfe' : 'white',
              color: filter === status ? 'white' : '#666',
              border: '1px solid #eee',
              borderRadius: '6px',
              cursor: 'pointer',
              textTransform: 'capitalize'
            }}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Leads Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 48, textAlign: 'center' }}>
            <div className="loading-spinner" style={{ margin: '0 auto' }}></div>
          </div>
        ) : error ? (
          <div style={{ padding: 48, textAlign: 'center', color: '#ef4444' }}>
            <div style={{ marginBottom: 12, fontSize: 32 }}>⚠️</div>
            <div>{error}</div>
            <button onClick={loadLeads} style={{ marginTop: 12, padding: '8px 20px', background: '#4facfe', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
              Retry
            </button>
          </div>
        ) : displayLeads.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center', color: '#999' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
            <div style={{ fontSize: 16, fontWeight: 500, color: '#666', marginBottom: 8 }}>No leads found</div>
            <div style={{ fontSize: 14, color: '#999', marginBottom: 16 }}>Create your first lead to get started</div>
            <button
              onClick={() => setShowModal(true)}
              style={{ padding: '10px 24px', background: '#4facfe', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}
            >
              + Add Lead
            </button>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9fafb' }}>
                <th style={{ padding: '12px 8px', width: 40 }}>
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleSelectAll}
                    style={{ cursor: 'pointer', width: 16, height: 16 }}
                  />
                </th>
                <th style={{ textAlign: 'left', padding: '16px', fontSize: '13px', color: '#666' }}>Name</th>
                <th style={{ textAlign: 'left', padding: '16px', fontSize: '13px', color: '#666' }}>Email</th>
                <th style={{ textAlign: 'left', padding: '16px', fontSize: '13px', color: '#666' }}>Source</th>
                <th style={{ textAlign: 'left', padding: '16px', fontSize: '13px', color: '#666' }}>Score</th>
                <th style={{ textAlign: 'left', padding: '16px', fontSize: '13px', color: '#666' }}>Status</th>
                <th style={{ textAlign: 'left', padding: '16px', fontSize: '13px', color: '#666' }}>Created</th>
              </tr>
            </thead>
            <tbody>
              {displayLeads.map(lead => {
                const scoreBreakdown = getScoreBreakdown(lead);
                const isSelected = selectedIds.has(lead.id);
                return (
                <tr key={lead.id} style={{ borderBottom: '1px solid #f5f5f5', background: isSelected ? '#e0f2fe' : 'transparent' }}>
                  <td style={{ padding: '12px 8px' }}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(lead.id)}
                      style={{ cursor: 'pointer', width: 16, height: 16 }}
                    />
                  </td>
                  <td style={{ padding: '16px', fontWeight: 500 }}>{lead.name}</td>
                  <td style={{ padding: '16px', color: '#666' }}>{lead.email}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{
                      background: '#e0f2fe',
                      color: '#0369a1',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      {lead.source}
                    </span>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div
                      onMouseEnter={() => setScoreTooltip(lead.id)}
                      onMouseLeave={() => setScoreTooltip(null)}
                      style={{ position: 'relative', cursor: 'pointer' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: `${getScoreColor(scoreBreakdown.total)}20`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '14px',
                          color: getScoreColor(scoreBreakdown.total)
                        }}>
                          {scoreBreakdown.total}
                        </div>
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: 600,
                          background: `${getScoreColor(scoreBreakdown.total)}20`,
                          color: getScoreColor(scoreBreakdown.total)
                        }}>
                          {getScoreLabel(scoreBreakdown.total)}
                        </span>
                      </div>
                      {scoreTooltip === lead.id && (
                        <div style={{
                          position: 'absolute',
                          top: '100%',
                          left: 0,
                          marginTop: '8px',
                          background: 'white',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          padding: '12px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                          zIndex: 100,
                          minWidth: '180px'
                        }}>
                          <div style={{ fontSize: '12px', fontWeight: 600, marginBottom: '8px', color: '#374151' }}>Score Breakdown</div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                            <span style={{ color: '#6b7280' }}>Engagement</span>
                            <span style={{ fontWeight: 600, color: '#374151' }}>{scoreBreakdown.engagement}/40</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                            <span style={{ color: '#6b7280' }}>Profile Fit</span>
                            <span style={{ fontWeight: 600, color: '#374151' }}>{scoreBreakdown.profile}/30</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                            <span style={{ color: '#6b7280' }}>Activity</span>
                            <span style={{ fontWeight: 600, color: '#374151' }}>{scoreBreakdown.activity}/30</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <select
                      value={lead.status}
                      onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: '1px solid #ddd',
                        cursor: 'pointer'
                      }}
                    >
                      {statusOptions.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td style={{ padding: '16px', color: '#999', fontSize: '13px' }}>
                    {new Date(lead.createdAt || lead.created_at || Date.now()).toLocaleDateString()}
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination info */}
      {displayLeads.length > 0 && (
        <div style={{ marginTop: 16, fontSize: 13, color: '#999', textAlign: 'right' }}>
          Showing {displayLeads.length} leads
        </div>
      )}

      {/* Add Lead Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            background: 'white',
            padding: '32px',
            borderRadius: '12px',
            width: '400px',
            maxHeight: '90vh',
            overflowY: 'auto',
          }}>
            <h3 style={{ margin: '0 0 24px' }}>Add New Lead</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#666' }}>Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => { setFormData({ ...formData, name: e.target.value }); setFormErrors(p => ({ ...p, name: '' })); }}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '6px',
                    border: formErrors.name ? '1px solid #ef4444' : '1px solid #ddd',
                  }}
                />
                {formErrors.name && <span style={{ fontSize: 12, color: '#ef4444', marginTop: 4, display: 'block' }}>{formErrors.name}</span>}
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#666' }}>Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => { setFormData({ ...formData, email: e.target.value }); setFormErrors(p => ({ ...p, email: '' })); }}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '6px',
                    border: formErrors.email ? '1px solid #ef4444' : '1px solid #ddd',
                  }}
                />
                {formErrors.email && <span style={{ fontSize: 12, color: '#ef4444', marginTop: 4, display: 'block' }}>{formErrors.email}</span>}
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#666' }}>Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
                />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#666' }}>Source</label>
                <select
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
                >
                  <option value="website">Website</option>
                  <option value="organic">Organic Search</option>
                  <option value="social">Social Media</option>
                  <option value="referral">Referral</option>
                  <option value="direct">Direct</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => { setShowModal(false); setFormErrors({}); }}
                  style={{
                    flex: 1, padding: '12px', background: '#f5f5f5',
                    border: 'none', borderRadius: '6px', cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1, padding: '12px', background: '#4facfe',
                    color: 'white', border: 'none', borderRadius: '6px',
                    cursor: 'pointer', fontWeight: 600
                  }}
                >
                  Add Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leads;
