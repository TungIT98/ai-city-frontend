/**
 * Report Builder Page
 * Custom drag-drop report builder with export capabilities
 */
import { useState, useEffect } from 'react';
import api from '../services/api';

// Available metrics for report builder
const availableMetrics = [
  { id: 'leads_total', name: 'Total Leads', category: 'leads', icon: '🎯' },
  { id: 'leads_new', name: 'New Leads', category: 'leads', icon: '🆕' },
  { id: 'leads_converted', name: 'Converted Leads', category: 'leads', icon: '✅' },
  { id: 'leads_lost', name: 'Lost Leads', category: 'leads', icon: '❌' },
  { id: 'conversion_rate', name: 'Conversion Rate', category: 'conversions', icon: '📈' },
  { id: 'revenue_total', name: 'Total Revenue', category: 'revenue', icon: '💰' },
  { id: 'revenue_mrr', name: 'MRR', category: 'revenue', icon: '📊' },
  { id: 'users_active', name: 'Active Users', category: 'users', icon: '👥' },
  { id: 'users_dau', name: 'Daily Active Users', category: 'users', icon: '📅' },
  { id: 'agents_running', name: 'Active Agents', category: 'agents', icon: '🤖' },
];

// Report templates
const reportTemplates = [
  { id: 'weekly_summary', name: 'Weekly Summary', metrics: ['leads_total', 'conversion_rate', 'revenue_total'], description: 'Key metrics for the week' },
  { id: 'monthly_performance', name: 'Monthly Performance', metrics: ['leads_new', 'leads_converted', 'revenue_mrr', 'users_dau'], description: 'Comprehensive monthly overview' },
  { id: 'lead_analysis', name: 'Lead Analysis', metrics: ['leads_total', 'leads_new', 'leads_converted', 'leads_lost'], description: 'Detailed lead breakdown' },
  { id: 'revenue_report', name: 'Revenue Report', metrics: ['revenue_total', 'revenue_mrr', 'conversion_rate'], description: 'Revenue and conversion metrics' },
];

const ReportBuilder = () => {
  const [reportName, setReportName] = useState('');
  const [selectedMetrics, setSelectedMetrics] = useState([]);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [schedule, setSchedule] = useState('none');
  const [generatedReport, setGeneratedReport] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [savedReports, setSavedReports] = useState([]);
  const [showExportMenu, setShowExportMenu] = useState(false);

  useEffect(() => {
    loadSavedReports();
  }, []);

  const loadSavedReports = async () => {
    try {
      const reports = await api.getReports(10);
      setSavedReports(reports);
    } catch (err) {
      console.error('Failed to load reports:', err);
    }
  };

  const addMetric = (metric) => {
    if (!selectedMetrics.find(m => m.id === metric.id)) {
      setSelectedMetrics([...selectedMetrics, metric]);
    }
  };

  const removeMetric = (metricId) => {
    setSelectedMetrics(selectedMetrics.filter(m => m.id !== metricId));
  };

  const handleDragStart = (e, metric) => {
    e.dataTransfer.setData('metric', JSON.stringify(metric));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const metricData = e.dataTransfer.getData('metric');
    if (metricData) {
      const metric = JSON.parse(metricData);
      addMetric(metric);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const applyTemplate = (template) => {
    setReportName(template.name);
    const metrics = template.metrics.map(id => availableMetrics.find(m => m.id === id)).filter(Boolean);
    setSelectedMetrics(metrics);
  };

  const generateReport = async () => {
    if (!reportName || selectedMetrics.length === 0) {
      alert('Please enter a report name and select at least one metric');
      return;
    }

    setIsGenerating(true);
    try {
      // Generate report data based on selected metrics
      const reportData = {
        name: reportName,
        metrics: selectedMetrics.map(m => m.id),
        dateRange,
        schedule,
        generatedAt: new Date().toISOString()
      };

      // Fetch data for each metric
      const metricData = {};
      for (const metric of selectedMetrics) {
        try {
          switch (metric.category) {
            case 'leads':
              const leadAnalytics = await api.getLeadAnalytics();
              metricData[metric.id] = leadAnalytics;
              break;
            case 'conversions':
              const conversions = await api.getConversionMetrics();
              metricData[metric.id] = conversions;
              break;
            case 'revenue':
              const revenue = await api.getRevenueMetrics();
              metricData[metric.id] = revenue;
              break;
            case 'users':
              const users = await api.getUserMetrics();
              metricData[metric.id] = users;
              break;
            case 'agents':
              const agents = await api.getAgents();
              metricData[metric.id] = agents;
              break;
            default:
              metricData[metric.id] = {};
          }
        } catch (err) {
          metricData[metric.id] = { value: 'N/A', error: err.message };
        }
      }

      setGeneratedReport({ ...reportData, data: metricData });
    } catch (err) {
      console.error('Failed to generate report:', err);
      alert('Failed to generate report');
    } finally {
      setIsGenerating(false);
    }
  };

  const exportToCSV = () => {
    if (!generatedReport) return;

    const rows = [['Metric', 'Value', 'Category']];
    generatedReport.selectedMetrics?.forEach(metric => {
      const data = generatedReport.data[metric.id];
      rows.push([metric.name, JSON.stringify(data), metric.category]);
    });

    const csvContent = rows.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToPDF = () => {
    // For PDF export, we'll use a simple approach with window.print
    const printContent = document.getElementById('report-preview');
    if (!printContent) return;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>${reportName}</title>
          <style>
            body { font-family: system-ui, sans-serif; padding: 40px; }
            h1 { color: #374151; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { padding: 12px; text-align: left; border-bottom: 1px solid #eee; }
            th { background: #f9fafb; }
            .metric-category { color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>${printContent.innerHTML}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const scheduleReport = async () => {
    if (!reportName || selectedMetrics.length === 0) {
      alert('Please configure your report first');
      return;
    }

    try {
      await api.generateReport(schedule);
      alert(`Report scheduled: ${schedule === 'weekly' ? 'Weekly' : schedule === 'monthly' ? 'Monthly' : 'One-time'}`);
    } catch (err) {
      alert('Failed to schedule report');
    }
  };

  return (
    <div className="report-builder">
      <div className="page-header">
        <div>
          <h2>Report Builder</h2>
          <p>Create custom reports with drag-drop metrics</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            disabled={!generatedReport}
            style={{
              padding: '10px 20px',
              background: generatedReport ? 'white' : '#f5f5f5',
              border: '1px solid #ddd',
              borderRadius: '8px',
              cursor: generatedReport ? 'pointer' : 'not-allowed',
              color: generatedReport ? '#374151' : '#999',
              fontWeight: 500
            }}
          >
            📥 Export
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Left Column - Builder */}
        <div>
          {/* Report Name */}
          <div className="card" style={{ marginBottom: '24px' }}>
            <h3 className="card-title">Report Configuration</h3>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#666' }}>
                Report Name
              </label>
              <input
                type="text"
                value={reportName}
                onChange={(e) => setReportName(e.target.value)}
                placeholder="Enter report name..."
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  fontSize: '14px'
                }}
              />
            </div>

            {/* Date Range */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#666' }}>
                  Start Date
                </label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid #ddd'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#666' }}>
                  End Date
                </label>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid #ddd'
                  }}
                />
              </div>
            </div>

            {/* Schedule */}
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#666' }}>
                Schedule Delivery
              </label>
              <select
                value={schedule}
                onChange={(e) => setSchedule(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid #ddd'
                }}
              >
                <option value="none">One-time (generate now)</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>

          {/* Templates */}
          <div className="card" style={{ marginBottom: '24px' }}>
            <h3 className="card-title">Quick Templates</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {reportTemplates.map(template => (
                <button
                  key={template.id}
                  onClick={() => applyTemplate(template)}
                  style={{
                    padding: '12px 16px',
                    background: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ fontWeight: 500, color: '#374151' }}>{template.name}</div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>{template.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Available Metrics - Drag & Drop */}
          <div className="card" style={{ marginBottom: '24px' }}>
            <h3 className="card-title">Available Metrics (Drag to add)</h3>
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '8px'
              }}
            >
              {availableMetrics.map(metric => (
                <div
                  key={metric.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, metric)}
                  style={{
                    padding: '12px',
                    background: selectedMetrics.find(m => m.id === metric.id) ? '#f0f9ff' : '#f9fafb',
                    border: `1px solid ${selectedMetrics.find(m => m.id === metric.id) ? '#4facfe' : '#e5e7eb'}`,
                    borderRadius: '8px',
                    cursor: 'grab',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>{metric.icon}</span>
                    <span style={{ fontSize: '13px', fontWeight: 500 }}>{metric.name}</span>
                  </div>
                  <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>
                    {metric.category}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Metrics */}
          <div className="card" style={{ marginBottom: '24px' }}>
            <h3 className="card-title">Selected Metrics ({selectedMetrics.length})</h3>
            {selectedMetrics.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: '#999' }}>
                Drag metrics here or click to add
              </div>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {selectedMetrics.map(metric => (
                  <div
                    key={metric.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 12px',
                      background: '#f0f9ff',
                      borderRadius: '20px',
                      fontSize: '13px'
                    }}
                  >
                    <span>{metric.icon}</span>
                    <span>{metric.name}</span>
                    <button
                      onClick={() => removeMetric(metric.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#999',
                        cursor: 'pointer',
                        padding: '0 4px'
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Generate Button */}
          <button
            onClick={generateReport}
            disabled={isGenerating || !reportName || selectedMetrics.length === 0}
            style={{
              width: '100%',
              padding: '16px',
              background: isGenerating ? '#9ca3af' : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: 600,
              cursor: isGenerating ? 'not-allowed' : 'pointer'
            }}
          >
            {isGenerating ? '⏳ Generating Report...' : '🚀 Generate Report'}
          </button>

          {schedule !== 'none' && (
            <button
              onClick={scheduleReport}
              style={{
                width: '100%',
                marginTop: '12px',
                padding: '12px',
                background: 'white',
                border: '1px solid #4facfe',
                borderRadius: '8px',
                color: '#4facfe',
                fontWeight: 500,
                cursor: 'pointer'
              }}
            >
              📅 Schedule: {schedule === 'weekly' ? 'Weekly' : 'Monthly'}
            </button>
          )}
        </div>

        {/* Right Column - Preview */}
        <div>
          <div className="card">
            <h3 className="card-title">Report Preview</h3>
            {generatedReport ? (
              <div id="report-preview">
                <div style={{ marginBottom: '24px' }}>
                  <h2 style={{ margin: 0, color: '#374151' }}>{generatedReport.name}</h2>
                  <p style={{ color: '#6b7280', fontSize: '13px', marginTop: '8px' }}>
                    Generated: {new Date(generatedReport.generatedAt).toLocaleString()}
                  </p>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                      <th style={{ textAlign: 'left', padding: '12px', color: '#666' }}>Metric</th>
                      <th style={{ textAlign: 'left', padding: '12px', color: '#666' }}>Value</th>
                      <th style={{ textAlign: 'left', padding: '12px', color: '#666' }}>Category</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedMetrics.map(metric => {
                      const data = generatedReport.data[metric.id];
                      const value = data?.leads || data?.total || data?.conversion_rate || data?.length || 'N/A';
                      return (
                        <tr key={metric.id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                          <td style={{ padding: '12px', fontWeight: 500 }}>
                            {metric.icon} {metric.name}
                          </td>
                          <td style={{ padding: '12px' }}>
                            {typeof value === 'object' ? JSON.stringify(value).slice(0, 50) : value}
                          </td>
                          <td style={{ padding: '12px', color: '#6b7280', fontSize: '12px' }}>
                            {metric.category}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ padding: '48px', textAlign: 'center', color: '#999' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
                <p>Configure and generate your report to see preview</p>
              </div>
            )}
          </div>

          {/* Saved Reports */}
          <div className="card" style={{ marginTop: '24px' }}>
            <h3 className="card-title">Recent Reports</h3>
            {savedReports.length > 0 ? (
              <div>
                {savedReports.slice(0, 5).map((report, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '12px',
                      borderBottom: '1px solid #f5f5f5',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 500 }}>{report.name || `Report ${idx + 1}`}</div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>
                        {report.created_at ? new Date(report.created_at).toLocaleDateString() : 'Recent'}
                      </div>
                    </div>
                    <button
                      style={{
                        padding: '6px 12px',
                        background: '#f0f9ff',
                        border: 'none',
                        borderRadius: '6px',
                        color: '#0369a1',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      View
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: '24px', textAlign: 'center', color: '#999' }}>
                No saved reports yet
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Export Menu Modal */}
      {showExportMenu && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
          onClick={() => setShowExportMenu(false)}
        >
          <div
            style={{
              background: 'white',
              padding: '24px',
              borderRadius: '12px',
              width: '300px'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: '0 0 16px' }}>Export Report</h3>
            <button
              onClick={() => { exportToCSV(); setShowExportMenu(false); }}
              style={{
                width: '100%',
                padding: '12px',
                marginBottom: '8px',
                background: '#f9fafb',
                border: '1px solid #ddd',
                borderRadius: '8px',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              📄 Export as CSV
            </button>
            <button
              onClick={() => { exportToPDF(); setShowExportMenu(false); }}
              style={{
                width: '100%',
                padding: '12px',
                marginBottom: '8px',
                background: '#f9fafb',
                border: '1px solid #ddd',
                borderRadius: '8px',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              📑 Export as PDF
            </button>
            <button
              onClick={() => setShowExportMenu(false)}
              style={{
                width: '100%',
                padding: '12px',
                background: 'white',
                border: '1px solid #ddd',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportBuilder;