/**
 * Leads Page
 * Lead management and listing
 */
import { useState, useEffect } from 'react';
import api from '../services/api';

const Leads = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [leads, setLeads] = useState([]);
  const [filter, setFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', source: 'website' });

  useEffect(() => {
    loadLeads();
  }, [filter]);

  const loadLeads = async () => {
    try {
      setLoading(true);
      const data = await api.getLeads(filter || null, 50);
      setLeads(data);
      setError(null);
    } catch (err) {
      console.error('Failed to load leads:', err);
      setError('Failed to load leads');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.createLead(formData);
      setShowModal(false);
      setFormData({ name: '', email: '', phone: '', source: 'website' });
      loadLeads();
    } catch (err) {
      alert('Failed to create lead');
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await api.updateLead(id, { status });
      loadLeads();
    } catch (err) {
      alert('Failed to update lead');
    }
  };

  const statusOptions = ['new', 'contacted', 'qualified', 'converted', 'lost'];

  return (
    <div className="leads-page">
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2>Leads</h2>
            <p>Manage your leads and conversions</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            + Add Lead
          </button>
        </div>
      </div>

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
          <div className="loading"><div className="loading-spinner"></div></div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : leads.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#999' }}>
            No leads found
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9fafb' }}>
                <th style={{ textAlign: 'left', padding: '16px', fontSize: '13px', color: '#666' }}>Name</th>
                <th style={{ textAlign: 'left', padding: '16px', fontSize: '13px', color: '#666' }}>Email</th>
                <th style={{ textAlign: 'left', padding: '16px', fontSize: '13px', color: '#666' }}>Source</th>
                <th style={{ textAlign: 'left', padding: '16px', fontSize: '13px', color: '#666' }}>Status</th>
                <th style={{ textAlign: 'left', padding: '16px', fontSize: '13px', color: '#666' }}>Created</th>
              </tr>
            </thead>
            <tbody>
              {leads.map(lead => (
                <tr key={lead.id} style={{ borderBottom: '1px solid #f5f5f5' }}>
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
                    {new Date(lead.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Lead Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            background: 'white',
            padding: '32px',
            borderRadius: '12px',
            width: '400px'
          }}>
            <h3 style={{ margin: '0 0 24px' }}>Add New Lead</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#666' }}>Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#666' }}>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
                />
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
                  onClick={() => setShowModal(false)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: '#f5f5f5',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: '#4facfe',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 600
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