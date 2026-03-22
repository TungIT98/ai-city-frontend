/**
 * AI City Email Template Editor
 * Phase 8: AIC-803 - WYSIWYG Email Template Builder
 */
import { useState, useRef } from 'react';
import './EmailTemplates.css';

const TEMPLATE_VARIABLES = [
  { key: '{{user.name}}', label: 'User Name', desc: "Recipient's full name" },
  { key: '{{user.email}}', label: 'User Email', desc: "Recipient's email address" },
  { key: '{{company.name}}', label: 'Company Name', desc: 'Your company name' },
  { key: '{{report.date}}', label: 'Report Date', desc: 'Date of generated report' },
  { key: '{{lead.name}}', label: 'Lead Name', desc: "Lead's full name" },
  { key: '{{lead.score}}', label: 'Lead Score', desc: 'Lead score (0-100)' },
  { key: '{{agent.name}}', label: 'Agent Name', desc: "AI agent's name" },
  { key: '{{alert.level}}', label: 'Alert Level', desc: 'Alert severity level' },
  { key: '{{cta.link}}', label: 'CTA Link', desc: 'Call-to-action URL' },
  { key: '{{unsubscribe}}', label: 'Unsubscribe', desc: 'Unsubscribe link' },
];

const PREBUILT_TEMPLATES = [
  {
    id: 1,
    name: 'Welcome Email',
    subject: 'Welcome to AI City, {{user.name}}!',
    category: 'Onboarding',
    preview: 'Get started with AI City',
    lastUsed: '2026-03-20',
    usageCount: 342,
  },
  {
    id: 2,
    name: 'Lead Alert',
    subject: '🔥 Hot Lead Detected: {{lead.name}}',
    category: 'Sales',
    preview: 'A new hot lead has been identified',
    lastUsed: '2026-03-21',
    usageCount: 189,
  },
  {
    id: 3,
    name: 'Weekly Report Ready',
    subject: 'Your {{report.date}} Weekly Report is Ready',
    category: 'Reports',
    preview: 'Your weekly summary report has been generated',
    lastUsed: '2026-03-15',
    usageCount: 456,
  },
  {
    id: 4,
    name: 'Security Alert',
    subject: '⚠️ Security Alert: {{alert.level}}',
    category: 'Security',
    preview: 'A security event requires your attention',
    lastUsed: '2026-03-18',
    usageCount: 67,
  },
  {
    id: 5,
    name: 'Agent Task Complete',
    subject: '✅ Task Completed by {{agent.name}}',
    category: 'Automation',
    preview: 'An automated task has finished',
    lastUsed: '2026-03-19',
    usageCount: 1234,
  },
  {
    id: 6,
    name: 'API Usage Warning',
    subject: 'API Usage Warning - 80% Quota Reached',
    category: 'Developer',
    preview: 'Your API usage is approaching the limit',
    lastUsed: '2026-03-10',
    usageCount: 89,
  },
];

const CATEGORIES = ['All', 'Onboarding', 'Sales', 'Reports', 'Security', 'Automation', 'Developer'];

function EmailTemplatesPage() {
  const [templates, setTemplates] = useState(PREBUILT_TEMPLATES);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editSubject, setEditSubject] = useState('');
  const [editBody, setEditBody] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [showPreview, setShowPreview] = useState(false);
  const [previewMode, setPreviewMode] = useState('desktop'); // desktop, mobile
  const [showVariablePicker, setShowVariablePicker] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [testSent, setTestSent] = useState(false);

  const editorRef = useRef(null);

  const filteredTemplates = categoryFilter === 'All'
    ? templates
    : templates.filter(t => t.category === categoryFilter);

  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template);
    setEditSubject(template.subject);
    setEditBody(getDefaultBody(template.name));
    setIsEditing(false);
    setShowPreview(false);
  };

  const getDefaultBody = (name) => {
    const bodies = {
      'Welcome Email': `Dear {{user.name}},

Welcome to AI City! We're thrilled to have you on board.

Get started by exploring our dashboard and connecting your first integration.

Best regards,
The AI City Team`,
      'Lead Alert': `Hello,

A hot lead has been detected that requires immediate attention.

Lead: {{lead.name}}
Score: {{lead.score}}/100

{{cta.link}}

Best,
AI City Sales Team`,
      'Weekly Report Ready': `Hello {{user.name}},

Your weekly report for {{report.date}} is ready.

Key Highlights:
- New leads: 127
- Conversion rate: 12.3%
- Revenue: $42,500

View your full report here:
{{cta.link}}

Best,
AI City Analytics`,
      'Security Alert': `Dear {{user.name}},

A security event has been detected on your account.

Alert Level: {{alert.level}}
Time: {{report.date}}

If this wasn't you, please secure your account immediately.

AI City Security Team`,
      'Agent Task Complete': `Hello {{user.name}},

The {{agent.name}} agent has completed its task.

Task Summary:
- Duration: 2 minutes
- Status: Success
- Output: 15 records processed

View details:
{{cta.link}}`,
      'API Usage Warning': `Hello {{user.name}},

Your API usage has reached 80% of your monthly quota.

Current Usage: 8,000 / 10,000 requests
Days remaining: 12

Upgrade your plan or wait for quota reset on April 1st.

{{cta.link}}`,
    };
    return bodies[name] || `Hello {{user.name}},\n\nYour template content goes here.\n\n{{cta.link}}\n\n{{unsubscribe}}`;
  };

  const handleSave = () => {
    if (!selectedTemplate) return;
    setTemplates(prev => prev.map(t =>
      t.id === selectedTemplate.id ? { ...t, subject: editSubject } : t
    ));
    setIsEditing(false);
  };

  const handleInsertVariable = (variable) => {
    const textarea = document.getElementById('email-body-editor');
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = editBody;
      setEditBody(text.substring(0, start) + variable + text.substring(end));
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + variable.length, start + variable.length);
      }, 0);
    }
    setShowVariablePicker(false);
  };

  const handleSendTest = () => {
    if (!testEmail || !selectedTemplate) return;
    setTestSent(true);
    setTimeout(() => setTestSent(false), 3000);
  };

  const handleExportHTML = () => {
    if (!selectedTemplate) return;
    const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>${editSubject}</title></head>
<body style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
<div style="background: #0f172a; color: #f9fafb; padding: 24px; border-radius: 12px;">
<h2 style="margin: 0 0 16px; color: #22d3ee;">AI City</h2>
<p>${editSubject.replace(/\{\{[^}]+\}\}/g, '[value]')}</p>
<hr style="border-color: #374151;">
<pre style="white-space: pre-wrap; font-family: inherit;">${editBody}</pre>
</div>
</body></html>`;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `email-template-${selectedTemplate.id}.html`;
    a.click();
  };

  return (
    <div className="email-templates-page">
      <div className="email-header">
        <h1>Email Templates</h1>
        <p className="email-subtitle">Create and manage email templates for notifications and reports</p>
      </div>

      <div className="email-layout">
        {/* Template Library */}
        <div className="template-library">
          <div className="library-header">
            <h3>Templates</h3>
            <button className="btn-primary btn-sm" onClick={() => {
              const newTemplate = {
                id: Date.now(),
                name: 'New Template',
                subject: 'New Email Subject',
                category: 'Custom',
                preview: 'Custom template',
                lastUsed: null,
                usageCount: 0,
              };
              setTemplates(prev => [...prev, newTemplate]);
              handleSelectTemplate(newTemplate);
              setIsEditing(true);
            }}>+ New</button>
          </div>

          <div className="category-filters">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`cat-btn ${categoryFilter === cat ? 'active' : ''}`}
                onClick={() => setCategoryFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="template-list">
            {filteredTemplates.map(template => (
              <div
                key={template.id}
                className={`template-item ${selectedTemplate?.id === template.id ? 'selected' : ''}`}
                onClick={() => handleSelectTemplate(template)}
              >
                <div className="template-item-header">
                  <span className="template-name">{template.name}</span>
                  <span className="template-category">{template.category}</span>
                </div>
                <div className="template-preview">{template.preview}</div>
                <div className="template-meta">
                  {template.lastUsed && <span>Used {template.lastUsed}</span>}
                  <span>{template.usageCount} sends</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Editor / Preview Panel */}
        <div className="editor-panel">
          {!selectedTemplate ? (
            <div className="no-selection">
              <p>Select a template to edit or preview</p>
            </div>
          ) : (
            <>
              <div className="editor-header">
                <div className="editor-title">
                  <h3>{selectedTemplate.name}</h3>
                  <span className="template-badge">{selectedTemplate.category}</span>
                </div>
                <div className="editor-actions">
                  {!isEditing ? (
                    <>
                      <button className="btn-secondary btn-sm" onClick={() => { setShowPreview(!showPreview); setPreviewMode('desktop'); }}>
                        {showPreview ? 'Edit' : 'Preview'}
                      </button>
                      <button className="btn-primary btn-sm" onClick={() => setIsEditing(true)}>Edit</button>
                    </>
                  ) : (
                    <>
                      <button className="btn-secondary btn-sm" onClick={() => setShowVariablePicker(!showVariablePicker)}>
                        Insert Variable
                      </button>
                      <button className="btn-secondary btn-sm" onClick={() => setIsEditing(false)}>Cancel</button>
                      <button className="btn-primary btn-sm" onClick={handleSave}>Save</button>
                    </>
                  )}
                </div>
              </div>

              {/* Variable Picker */}
              {showVariablePicker && (
                <div className="variable-picker">
                  <h4>Insert Variable</h4>
                  <div className="variable-grid">
                    {TEMPLATE_VARIABLES.map(v => (
                      <button
                        key={v.key}
                        className="variable-btn"
                        onClick={() => handleInsertVariable(v.key)}
                        title={v.desc}
                      >
                        <code>{v.key}</code>
                        <span>{v.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {showPreview ? (
                /* Preview Mode */
                <div className="preview-panel">
                  <div className="preview-controls">
                    <button
                      className={`preview-mode-btn ${previewMode === 'desktop' ? 'active' : ''}`}
                      onClick={() => setPreviewMode('desktop')}
                    >Desktop</button>
                    <button
                      className={`preview-mode-btn ${previewMode === 'mobile' ? 'active' : ''}`}
                      onClick={() => setPreviewMode('mobile')}
                    >Mobile</button>
                    <button className="btn-secondary btn-sm" onClick={handleExportHTML}>Export HTML</button>
                  </div>
                  <div className={`email-preview-container ${previewMode}`}>
                    <div className="email-preview-header">
                      <div className="preview-field">
                        <label>To:</label>
                        <span>user@example.com</span>
                      </div>
                      <div className="preview-field">
                        <label>Subject:</label>
                        <span>{editSubject}</span>
                      </div>
                    </div>
                    <div className="email-preview-body">
                      <pre>{editBody.replace(/\{\{([^}]+)\}\}/g, '[$1]')}</pre>
                    </div>
                  </div>
                </div>
              ) : (
                /* Edit Mode */
                <div className="edit-panel">
                  <div className="form-group">
                    <label>Subject Line</label>
                    <input
                      type="text"
                      value={editSubject}
                      onChange={e => setEditSubject(e.target.value)}
                      disabled={!isEditing}
                      placeholder="Email subject..."
                    />
                  </div>

                  <div className="form-group">
                    <label>Body</label>
                    <textarea
                      id="email-body-editor"
                      ref={editorRef}
                      value={editBody}
                      onChange={e => setEditBody(e.target.value)}
                      disabled={!isEditing}
                      placeholder="Email body..."
                      rows={14}
                    />
                  </div>

                  {/* Test Send */}
                  <div className="test-send-section">
                    <h4>Send Test Email</h4>
                    <div className="test-send-row">
                      <input
                        type="email"
                        value={testEmail}
                        onChange={e => setTestEmail(e.target.value)}
                        placeholder="test@example.com"
                      />
                      <button
                        className={`btn-primary btn-sm ${testSent ? 'btn-success' : ''}`}
                        onClick={handleSendTest}
                        disabled={!testEmail}
                      >
                        {testSent ? '✓ Sent!' : 'Send Test'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default EmailTemplatesPage;
