/**
 * AI Telesales Dashboard
 * Product UI for AI Telesales: Lead management, call analytics, script editor, intent tracking
 */
import { useState, useEffect } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import api from '../services/api';
import './Telesales.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

// Mock data for call analytics
const callAnalyticsData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'Calls Made',
      data: [45, 52, 38, 65, 48, 25, 30],
      backgroundColor: 'rgba(99, 102, 241, 0.8)',
    },
    {
      label: 'Calls Connected',
      data: [32, 38, 28, 48, 35, 18, 22],
      backgroundColor: 'rgba(16, 185, 129, 0.8)',
    }
  ]
};

// Call outcome distribution
const callOutcomeData = {
  labels: ['Connected', 'Voicemail', 'No Answer', 'Busy', 'Wrong Number'],
  datasets: [
    {
      data: [42, 18, 22, 10, 8],
      backgroundColor: [
        'rgba(16, 185, 129, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(107, 114, 128, 0.8)',
        'rgba(239, 68, 68, 0.8)',
        'rgba(139, 92, 246, 0.8)'
      ],
      borderWidth: 0
    }
  ]
};

// Customer intent data
const intentCategories = [
  { name: 'Hot Lead', count: 28, color: '#10B981' },
  { name: 'Warm Lead', count: 45, color: '#F59E0B' },
  { name: 'Cold Lead', count: 62, color: '#6B7280' },
  { name: 'Not Interested', count: 15, color: '#EF4444' }
];

// Sample scripts
const sampleScripts = [
  {
    id: 1,
    title: 'Initial Outreach',
    content: `Hi [Name], this is [Agent] from AI City. How are you doing today?

I wanted to reach out because we help businesses like yours automate their sales process with AI.

Do you have 2 minutes to hear how we can help you generate more leads?`
  },
  {
    id: 2,
    title: 'Product Demo Request',
    content: `Thank you for your interest! I'd be happy to schedule a quick demo.

Our team will show you how our AI can:
- Auto-dial 100+ prospects per day
- Qualify leads with intelligent conversation
- Schedule meetings directly on your calendar

What time works best for you this week?`
  },
  {
    id: 3,
    title: 'Follow-up After Voicemail',
    content: `Hi [Name], this is [Agent] from AI City following up on my previous call.

I left you a voicemail about automating your sales outreach. I'd love to show you how other businesses have seen 3x their conversion rates.

Can I call you back at a more convenient time?`
  }
];

function Telesales() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [scripts, setScripts] = useState(sampleScripts);
  const [selectedScript, setSelectedScript] = useState(null);
  const [scriptContent, setScriptContent] = useState('');
  const [realLeads, setRealLeads] = useState([]);
  const [leadsLoading, setLeadsLoading] = useState(false);

  // Fetch real leads from API
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setLeadsLoading(true);
        const data = await api.getLeads(null, 100);
        // Transform API leads to expected format
        const transformed = (data.leads || data || []).map((lead, idx) => ({
          id: lead.id || idx + 1,
          name: lead.name || lead.company || 'Unknown',
          company: lead.company || lead.organization || '',
          phone: lead.phone || lead.phone_number || lead.contact || '',
          status: lead.status === 'qualified' ? 'hot' : lead.status === 'contacted' ? 'warm' : 'cold',
          lastCall: lead.last_contact || lead.updated_at || '',
          intent: lead.intent_level || lead.priority || 'medium'
        }));
        setRealLeads(transformed);
      } catch (err) {
        console.error('Failed to fetch leads:', err);
        // Fall back to mock data on error
        setRealLeads([
          { id: 1, name: 'Nguyen Van A', company: 'TechCorp Vietnam', phone: '+84 912 345 678', status: 'hot', lastCall: '2026-03-20 10:30', intent: 'high' },
          { id: 2, name: 'Tran Thi B', company: 'Smart Solutions', phone: '+84 987 654 321', status: 'warm', lastCall: '2026-03-19 14:15', intent: 'medium' },
          { id: 3, name: 'Le Van C', company: 'Digital First', phone: '+84 933 111 222', status: 'cold', lastCall: '2026-03-18 09:45', intent: 'low' },
        ]);
      } finally {
        setLeadsLoading(false);
      }
    };
    fetchLeads();
  }, []);

  // Use real leads when available, mock otherwise
  const leads = realLeads.length > 0 ? realLeads : [
    { id: 1, name: 'Nguyen Van A', company: 'TechCorp Vietnam', phone: '+84 912 345 678', status: 'hot', lastCall: '2026-03-20 10:30', intent: 'high' },
    { id: 2, name: 'Tran Thi B', company: 'Smart Solutions', phone: '+84 987 654 321', status: 'warm', lastCall: '2026-03-19 14:15', intent: 'medium' },
    { id: 3, name: 'Le Van C', company: 'Digital First', phone: '+84 933 111 222', status: 'cold', lastCall: '2026-03-18 09:45', intent: 'low' },
    { id: 4, name: 'Pham Thi D', company: 'InnovateTech', phone: '+84 944 333 444', status: 'hot', lastCall: '2026-03-20 11:00', intent: 'high' },
    { id: 5, name: 'Vo Van E', company: 'Enterprise Co', phone: '+84 955 555 666', status: 'warm', lastCall: '2026-03-19 16:30', intent: 'medium' },
  ];

  const handleEditScript = (script) => {
    setSelectedScript(script);
    setScriptContent(script.content);
  };

  const handleSaveScript = () => {
    if (selectedScript) {
      setScripts(scripts.map(s =>
        s.id === selectedScript.id ? { ...s, content: scriptContent } : s
      ));
      setSelectedScript(null);
      setScriptContent('');
    }
  };

  return (
    <div className="telesales-container">
      <div className="telesales-header">
        <h1>AI Telesales Dashboard</h1>
        <p>Manage leads, track calls, and optimize your sales scripts</p>
      </div>

      <div className="telesales-tabs">
        <button
          className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          📊 Dashboard
        </button>
        <button
          className={`tab-btn ${activeTab === 'leads' ? 'active' : ''}`}
          onClick={() => setActiveTab('leads')}
        >
          👥 Leads
        </button>
        <button
          className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          📈 Call Analytics
        </button>
        <button
          className={`tab-btn ${activeTab === 'scripts' ? 'active' : ''}`}
          onClick={() => setActiveTab('scripts')}
        >
          📝 Script Editor
        </button>
        <button
          className={`tab-btn ${activeTab === 'intent' ? 'active' : ''}`}
          onClick={() => setActiveTab('intent')}
        >
          🎯 Intent Tracking
        </button>
      </div>

      <div className="telesales-content">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="dashboard-grid">
            <div className="metric-card">
              <div className="metric-icon">📞</div>
              <div className="metric-value">342</div>
              <div className="metric-label">Total Calls Today</div>
            </div>
            <div className="metric-card">
              <div className="metric-icon">✅</div>
              <div className="metric-value">68%</div>
              <div className="metric-label">Connect Rate</div>
            </div>
            <div className="metric-card">
              <div className="metric-icon">🔥</div>
              <div className="metric-value">28</div>
              <div className="metric-label">Hot Leads</div>
            </div>
            <div className="metric-card">
              <div className="metric-icon">💰</div>
              <div className="metric-value">12</div>
              <div className="metric-label">Qualified Today</div>
            </div>

            <div className="chart-card">
              <h3>Weekly Call Volume</h3>
              <Bar data={callAnalyticsData} options={{
                responsive: true,
                plugins: { legend: { position: 'top' } },
                scales: { y: { beginAtZero: true } }
              }} />
            </div>

            <div className="chart-card">
              <h3>Call Outcomes</h3>
              <div className="doughnut-container">
                <Doughnut data={callOutcomeData} options={{
                  responsive: true,
                  plugins: { legend: { position: 'right' } }
                }} />
              </div>
            </div>
          </div>
        )}

        {/* Leads Tab */}
        {activeTab === 'leads' && (
          <div className="leads-section">
            <div className="section-header">
              <h3>Lead Management</h3>
              <button className="add-btn">+ Add New Lead</button>
            </div>
            <table className="leads-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Company</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Intent</th>
                  <th>Last Call</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {leads.map(lead => (
                  <tr key={lead.id}>
                    <td>{lead.name}</td>
                    <td>{lead.company}</td>
                    <td>{lead.phone}</td>
                    <td>
                      <span className={`status-badge ${lead.status}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td>
                      <span className={`intent-badge ${lead.intent}`}>
                        {lead.intent}
                      </span>
                    </td>
                    <td>{lead.lastCall}</td>
                    <td>
                      <button className="action-btn">Call</button>
                      <button className="action-btn">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="analytics-section">
            <div className="analytics-grid">
              <div className="analytics-card full-width">
                <h3>Call Performance by Day</h3>
                <Bar data={callAnalyticsData} options={{
                  responsive: true,
                  plugins: { legend: { position: 'top' } }
                }} />
              </div>
              <div className="analytics-card">
                <h3>Outcome Distribution</h3>
                <Doughnut data={callOutcomeData} options={{
                  responsive: true,
                  plugins: { legend: { position: 'bottom' } }
                }} />
              </div>
              <div className="analytics-stats">
                <div className="stat-item">
                  <span className="stat-label">Avg. Call Duration</span>
                  <span className="stat-value">2m 45s</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Conversion Rate</span>
                  <span className="stat-value">12.3%</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Qualified Leads/Day</span>
                  <span className="stat-value">8.5</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Script Editor Tab */}
        {activeTab === 'scripts' && (
          <div className="scripts-section">
            <div className="scripts-sidebar">
              <h3>Script Library</h3>
              <div className="script-list">
                {scripts.map(script => (
                  <div
                    key={script.id}
                    className={`script-item ${selectedScript?.id === script.id ? 'active' : ''}`}
                    onClick={() => handleEditScript(script)}
                  >
                    <div className="script-title">{script.title}</div>
                  </div>
                ))}
              </div>
              <button className="add-script-btn">+ New Script</button>
            </div>
            <div className="scripts-editor">
              {selectedScript ? (
                <>
                  <h3>Editing: {selectedScript.title}</h3>
                  <textarea
                    className="script-textarea"
                    value={scriptContent}
                    onChange={(e) => setScriptContent(e.target.value)}
                    rows={15}
                  />
                  <div className="editor-actions">
                    <button className="save-btn" onClick={handleSaveScript}>Save Changes</button>
                    <button className="cancel-btn" onClick={() => { setSelectedScript(null); setScriptContent(''); }}>Cancel</button>
                  </div>
                </>
              ) : (
                <div className="no-selection">
                  <p>Select a script from the library to edit</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Intent Tracking Tab */}
        {activeTab === 'intent' && (
          <div className="intent-section">
            <h3>Customer Intent Tracking</h3>
            <div className="intent-grid">
              {intentCategories.map((category, index) => (
                <div key={index} className="intent-card" style={{ borderColor: category.color }}>
                  <div className="intent-header">
                    <span className="intent-name" style={{ color: category.color }}>{category.name}</span>
                    <span className="intent-count">{category.count}</span>
                  </div>
                  <div className="intent-bar">
                    <div
                      className="intent-fill"
                      style={{
                        width: `${(category.count / 150) * 100}%`,
                        backgroundColor: category.color
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="intent-details">
              <h4>Recent Intent Updates</h4>
              <div className="intent-feed">
                <div className="intent-message hot">
                  <span className="time">10:30 AM</span>
                  <span className="message">Nguyen Van A - Intent changed to <strong>Hot</strong></span>
                </div>
                <div className="intent-message warm">
                  <span className="time">10:15 AM</span>
                  <span className="message">Tran Thi B - Intent changed to <strong>Warm</strong></span>
                </div>
                <div className="intent-message cold">
                  <span className="time">09:45 AM</span>
                  <span className="message">Le Van C - Intent changed to <strong>Cold</strong></span>
                </div>
                <div className="intent-message hot">
                  <span className="time">09:30 AM</span>
                  <span className="message">Pham Thi D - Intent changed to <strong>Hot</strong></span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Telesales;