/**
 * Reports Page
 * Report generation and listing
 */
import { useState, useEffect } from 'react';
import api from '../services/api';

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reports, setReports] = useState([]);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      const data = await api.getReports(20);
      setReports(data);
    } catch (err) {
      setError('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async (type) => {
    try {
      setGenerating(true);
      await api.generateReport(type);
      loadReports();
    } catch (err) {
      alert('Failed to generate report');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="reports-page">
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2>Reports</h2>
            <p>Generated reports and analytics</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => handleGenerate('weekly')}
              disabled={generating}
              style={{
                padding: '12px 24px',
                background: generating ? '#ccc' : '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: generating ? 'not-allowed' : 'pointer',
                fontWeight: 600
              }}
            >
              Generate Weekly
            </button>
            <button
              onClick={() => handleGenerate('monthly')}
              disabled={generating}
              style={{
                padding: '12px 24px',
                background: generating ? '#ccc' : '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: generating ? 'not-allowed' : 'pointer',
                fontWeight: 600
              }}
            >
              Generate Monthly
            </button>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        {loading ? (
          <div className="loading"><div className="loading-spinner"></div></div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : reports.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#999' }}>
            No reports generated yet. Click "Generate Weekly" to create your first report.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9fafb' }}>
                <th style={{ textAlign: 'left', padding: '16px', fontSize: '13px', color: '#666' }}>Type</th>
                <th style={{ textAlign: 'left', padding: '16px', fontSize: '13px', color: '#666' }}>Title</th>
                <th style={{ textAlign: 'left', padding: '16px', fontSize: '13px', color: '#666' }}>Period</th>
                <th style={{ textAlign: 'left', padding: '16px', fontSize: '13px', color: '#666' }}>Generated</th>
              </tr>
            </thead>
            <tbody>
              {reports.map(report => (
                <tr key={report.id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                  <td style={{ padding: '16px' }}>
                    <span style={{
                      background: report.type === 'weekly' ? '#e0f2fe' : '#fef3c7',
                      color: report.type === 'weekly' ? '#0369a1' : '#92400e',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      textTransform: 'capitalize'
                    }}>
                      {report.type}
                    </span>
                  </td>
                  <td style={{ padding: '16px', fontWeight: 500 }}>{report.title}</td>
                  <td style={{ padding: '16px', color: '#666' }}>
                    {report.period_start && report.period_end
                      ? `${report.period_start} - ${report.period_end}`
                      : '-'}
                  </td>
                  <td style={{ padding: '16px', color: '#999', fontSize: '13px' }}>
                    {new Date(report.generated_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Reports;