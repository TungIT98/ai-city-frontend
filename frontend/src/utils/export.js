/**
 * Data Export Utilities - CSV export for data tables
 * Part of Phase 9: Enterprise Features (AIC-905)
 */
import Papa from 'papaparse';
import { saveAs } from 'file-saver';

/**
 * Convert array of objects to CSV and download
 */
export function exportToCSV(data, filename = 'export', columns = null) {
  if (!data || !data.length) {
    console.warn('No data to export');
    return;
  }

  // If columns not specified, use keys from first row
  const cols = columns || Object.keys(data[0]);

  // Build CSV data with headers
  const csvData = data.map(row =>
    cols.map(col => {
      const val = row[col];
      // Handle null/undefined
      if (val === null || val === undefined) return '';
      // Handle strings with commas/quotes
      const str = String(val);
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    })
  );

  // Add header row
  const headers = cols.map(col =>
    col
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim()
  );

  const csvContent = [headers, ...csvData]
    .map(row => row.join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
  saveAs(blob, `${filename}-${formatDate(new Date())}.csv`);
}

function formatDate(date) {
  return date.toISOString().split('T')[0];
}

/**
 * Format cell value for export
 */
export function formatExportValue(value, type = 'string') {
  if (value === null || value === undefined) return '';

  switch (type) {
    case 'date':
      return new Date(value).toLocaleDateString();
    case 'datetime':
      return new Date(value).toLocaleString();
    case 'currency':
      return formatCurrency(value);
    case 'percentage':
      return `${value}%`;
    case 'number':
      return Number(value).toLocaleString();
    default:
      return String(value);
  }
}

function formatCurrency(value, currency = 'VND') {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(value);
}

/**
 * Export leads to CSV
 */
export function exportLeads(leads) {
  const data = leads.map(lead => ({
    id: lead.id,
    name: lead.name,
    email: lead.email,
    phone: lead.phone || '',
    company: lead.company || '',
    source: lead.source || '',
    status: lead.status || '',
    score: lead.score || 0,
    value: formatExportValue(lead.value, 'currency'),
    created: formatExportValue(lead.createdAt || lead.created_at, 'date'),
    updated: formatExportValue(lead.updatedAt || lead.updated_at, 'date'),
  }));
  exportToCSV(data, 'leads', ['id', 'name', 'email', 'phone', 'company', 'source', 'status', 'score', 'value', 'created', 'updated']);
}

/**
 * Export agents to CSV
 */
export function exportAgents(agents) {
  const data = agents.map(agent => ({
    id: agent.id,
    name: agent.name,
    category: agent.category || '',
    status: agent.status || '',
    runs: agent.runs || 0,
    successRate: formatExportValue(agent.successRate || agent.success_rate, 'percentage'),
    description: agent.description || '',
    created: formatExportValue(agent.createdAt || agent.created_at, 'date'),
  }));
  exportToCSV(data, 'agents', ['id', 'name', 'category', 'status', 'runs', 'successRate', 'description', 'created']);
}

/**
 * Export reports to CSV
 */
export function exportReports(reports) {
  const data = reports.map(report => ({
    id: report.id,
    title: report.title || report.name || '',
    type: report.type || report.report_type || '',
    status: report.status || '',
    created: formatExportValue(report.createdAt || report.created_at, 'datetime'),
    createdBy: report.createdBy || report.created_by || '',
  }));
  exportToCSV(data, 'reports', ['id', 'title', 'type', 'status', 'created', 'createdBy']);
}

/**
 * Export users to CSV (admin)
 */
export function exportUsers(users) {
  const data = users.map(user => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role || '',
    status: user.status || 'active',
    workspace: user.workspaceName || user.workspace_name || '',
    joined: formatExportValue(user.createdAt || user.created_at || user.joinedAt, 'date'),
  }));
  exportToCSV(data, 'users', ['id', 'name', 'email', 'role', 'status', 'workspace', 'joined']);
}

/**
 * Export audit log to CSV
 */
export function exportAuditLog(logs) {
  const data = logs.map(log => ({
    id: log.id,
    action: log.action || '',
    user: log.userName || log.user_name || log.user || '',
    resource: log.resource || '',
    details: log.details || '',
    ip: log.ip || log.ip_address || '',
    timestamp: formatExportValue(log.timestamp || log.created_at, 'datetime'),
  }));
  exportToCSV(data, 'audit-log', ['id', 'action', 'user', 'resource', 'details', 'ip', 'timestamp']);
}

/**
 * Export API usage to CSV
 */
export function exportApiUsage(usage) {
  const data = (usage.endpoints || usage).map(item => ({
    endpoint: item.endpoint || item.path || '',
    method: item.method || '',
    calls: item.calls || item.count || 0,
    avgLatency: item.avgLatency || item.avg_latency || 0,
    errors: item.errors || 0,
    period: item.period || '',
  }));
  exportToCSV(data, 'api-usage', ['endpoint', 'method', 'calls', 'avgLatency', 'errors', 'period']);
}
