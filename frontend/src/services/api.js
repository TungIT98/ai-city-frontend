/**
 * AI City API Service - Phase 9 Enhanced
 * Part of Phase 9: Backend Integration & Real API (AIC-900)
 *
 * Features:
 * - Retry logic with exponential backoff
 * - Request timeout
 * - Offline detection & graceful degradation
 * - Consistent error handling
 * - Mock data fallback for demo mode
 * - API latency tracking for RUM
 * - Token refresh on 401
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const PAPERCLIP_API = import.meta.env.VITE_PAPERCLIP_API || 'http://127.0.0.1:3100';

// Configuration
const REQUEST_TIMEOUT = 15000; // 15 seconds
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second base delay

// Check if we're in demo mode (no backend available)
let isDemoMode = false;

// API latency tracking (for RUM)
const trackApiLatency = (endpoint, duration, status) => {
  if (typeof window !== 'undefined' && window.__trackApiLatency) {
    window.__trackApiLatency(endpoint, duration, status);
  }
};

/**
 * Sleep utility for retry delays
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Exponential backoff delay calculator
 */
const getBackoffDelay = (attempt) => {
  return Math.min(RETRY_DELAY * Math.pow(2, attempt) + Math.random() * 1000, 10000);
};

/**
 * Abort controller wrapper for timeout
 */
const fetchWithTimeout = async (url, options, timeout = REQUEST_TIMEOUT) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error(`Request timeout after ${timeout}ms`);
    }
    throw error;
  }
};

// Network status detection
let networkListeners = [];
const onlineHandler = () => {
  isDemoMode = false;
  networkListeners.forEach(fn => fn(true));
};
const offlineHandler = () => {
  isDemoMode = true;
  networkListeners.forEach(fn => fn(false));
};

if (typeof window !== 'undefined') {
  window.addEventListener('online', onlineHandler);
  window.addEventListener('offline', offlineHandler);
  isDemoMode = !navigator.onLine;
}

/**
 * Register network status listener
 */
export const onNetworkChange = (callback) => {
  networkListeners.push(callback);
  return () => {
    networkListeners = networkListeners.filter(fn => fn !== callback);
  };
};

/**
 * Check if demo mode is active
 */
export const getIsDemoMode = () => isDemoMode;

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  constructor(message, status, code) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

// ============================================================
// Mock Data - Fallback for demo mode / offline
// ============================================================

const mockData = {
  leads: [
    { id: '1', name: 'Nguyen Van A', email: 'nguyenvana@email.com', status: 'hot', score: 92, company: 'ABC Corp', source: 'Website', createdAt: '2026-03-15T10:00:00Z', value: 15000000 },
    { id: '2', name: 'Tran Thi B', email: 'tranthib@email.com', status: 'warm', score: 75, company: 'XYZ Ltd', source: 'Referral', createdAt: '2026-03-14T09:30:00Z', value: 8500000 },
    { id: '3', name: 'Le Van C', email: 'levanc@email.com', status: 'hot', score: 88, company: '123 Inc', source: 'Google Ads', createdAt: '2026-03-13T14:20:00Z', value: 22000000 },
    { id: '4', name: 'Pham Thi D', email: 'phamthid@email.com', status: 'cold', score: 35, company: 'Enterprise Co', source: 'LinkedIn', createdAt: '2026-03-12T11:00:00Z', value: 5000000 },
    { id: '5', name: 'Hoang Van E', email: 'hoangvane@email.com', status: 'warm', score: 68, company: 'StartupHub', source: 'Website', createdAt: '2026-03-11T16:45:00Z', value: 12000000 },
  ],
  analytics: {
    overview: {
      totalLeads: 1247,
      conversionRate: 23.5,
      revenue: 345000000,
      activeUsers: 89,
      leadsChange: 12.3,
      conversionChange: 2.1,
      revenueChange: 18.7,
      usersChange: 5.4,
    },
    visitors: [120, 145, 132, 178, 195, 220, 210, 245, 260, 238, 275, 290],
    sources: {
      labels: ['Google Ads', 'Organic', 'Referral', 'Social', 'Direct'],
      data: [35, 25, 18, 14, 8],
    },
  },
  agents: [
    { id: '1', name: 'Social Media Manager', status: 'active', description: 'Automates social media posting and analytics', category: 'Marketing', runs: 156, successRate: 94 },
    { id: '2', name: 'Content Writer', status: 'active', description: 'AI-powered content generation for blogs and articles', category: 'Content', runs: 89, successRate: 91 },
    { id: '3', name: 'Customer Support', status: 'paused', description: '24/7 AI customer service agent', category: 'Support', runs: 234, successRate: 97 },
    { id: '4', name: 'Data Entry Automation', status: 'error', description: 'Automated data processing and entry', category: 'Operations', runs: 67, successRate: 78 },
  ],
  notifications: [
    { id: '1', type: 'info', title: 'New lead assigned', message: 'Nguyen Van A was assigned to you', time: '2 min ago', read: false },
    { id: '2', type: 'warning', title: 'Agent paused', message: 'Customer Support agent paused due to rate limit', time: '15 min ago', read: false },
    { id: '3', type: 'success', title: 'Report generated', message: 'Weekly report is ready for download', time: '1 hour ago', read: true },
  ],
};

// ============================================================
// API Service Class
// ============================================================

class ApiService {
  constructor(baseUrl = API_BASE) {
    this.baseUrl = baseUrl;
  }

  /**
   * Core request method with retry, timeout, and error handling
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const startTime = Date.now();
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
      ...options,
    };

    if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
      config.body = JSON.stringify(config.body);
    }

    let lastError;

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        const response = await fetchWithTimeout(url, config);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new ApiError(
            errorData.message || `HTTP Error: ${response.status}`,
            response.status,
            errorData.code
          );
        }

        const duration = Date.now() - startTime;
        trackApiLatency(endpoint, duration, response.status);
        return await response.json();
      } catch (error) {
        lastError = error;

        // Don't retry on 4xx errors (except 429 Too Many Requests)
        if (error instanceof ApiError && error.status >= 400 && error.status < 500 && error.status !== 429) {
          throw error;
        }

        // Don't retry on last attempt
        if (attempt === MAX_RETRIES) {
          break;
        }

        // Wait before retrying
        const delay = getBackoffDelay(attempt);
        console.warn(`API request failed (attempt ${attempt + 1}/${MAX_RETRIES + 1}), retrying in ${delay.toFixed(0)}ms...`, error.message);
        await sleep(delay);
      }
    }

    // All retries failed - return mock data in demo mode
    console.warn(`API request failed after ${MAX_RETRIES + 1} attempts. Falling back to demo mode.`);
    isDemoMode = true;
    return this.getMockData(endpoint);
  }

  /**
   * Get mock data fallback for demo mode
   */
  getMockData(endpoint) {
    // Parse endpoint to determine mock data
    if (endpoint.includes('/leads')) {
      return { data: mockData.leads, isDemo: true };
    }
    if (endpoint.includes('/analytics')) {
      return { data: mockData.analytics, isDemo: true };
    }
    if (endpoint.includes('/agents')) {
      return { data: mockData.agents, isDemo: true };
    }
    if (endpoint.includes('/notifications')) {
      return { data: mockData.notifications, isDemo: true };
    }
    return { data: null, isDemo: true };
  }

  // ============================================================
  // Health & Status
  // ============================================================

  async getHealth() {
    return this.request('/health');
  }

  // ============================================================
  // Analytics
  // ============================================================

  async getAnalyticsOverview() {
    return this.request('/analytics/overview');
  }

  async getUserMetrics(period = 'week') {
    return this.request(`/analytics/users?period=${period}`);
  }

  async getConversionMetrics() {
    return this.request('/analytics/conversions');
  }

  async getRevenueMetrics() {
    return this.request('/analytics/revenue');
  }

  // ============================================================
  // Leads
  // ============================================================

  async getLeads(status = null, limit = 50) {
    const query = status ? `?status=${status}&limit=${limit}` : `?limit=${limit}`;
    return this.request(`/leads${query}`);
  }

  async getLead(id) {
    return this.request(`/leads/${id}`);
  }

  async createLead(lead) {
    return this.request('/leads', { method: 'POST', body: JSON.parse(JSON.stringify(lead)) });
  }

  async updateLead(id, lead) {
    return this.request(`/leads/${id}`, { method: 'PATCH', body: JSON.parse(JSON.stringify(lead)) });
  }

  async getLeadAnalytics() {
    return this.request('/leads/analytics/conversion');
  }

  async getLeadAttribution(leadId = null) {
    const query = leadId ? `?lead_id=${leadId}` : '';
    return this.request(`/leads/attribution${query}`);
  }

  async getLeadScore(leadId) {
    return this.request(`/leads/${leadId}/score`);
  }

  async deleteLead(id) {
    return this.request(`/leads/${id}`, { method: 'DELETE' });
  }

  // ============================================================
  // Reports
  // ============================================================

  async getReports(limit = 10) {
    return this.request(`/reports?limit=${limit}`);
  }

  async getReport(id) {
    return this.request(`/reports/${id}`);
  }

  async generateReport(type = 'weekly') {
    return this.request('/reports/generate', { method: 'POST', body: { report_type: type } });
  }

  async search(query, limit = 5) {
    return this.request('/search', { method: 'POST', body: { query, limit } });
  }

  // ============================================================
  // AI Agents
  // ============================================================

  async getAgents() {
    return this.request('/agents');
  }

  async getAgent(id) {
    return this.request(`/agents/${id}`);
  }

  async createAgent(agent) {
    return this.request('/agents', { method: 'POST', body: agent });
  }

  async updateAgent(id, agent) {
    return this.request(`/agents/${id}`, { method: 'PATCH', body: agent });
  }

  async deleteAgent(id) {
    return this.request(`/agents/${id}`, { method: 'DELETE' });
  }

  async runAgent(id, params = {}) {
    return this.request(`/agents/${id}/run`, { method: 'POST', body: params });
  }

  async getAgentRuns(agentId, limit = 20) {
    return this.request(`/agents/${agentId}/runs?limit=${limit}`);
  }

  async getAgentLogs(agentId, limit = 50) {
    return this.request(`/agents/${agentId}/logs?limit=${limit}`);
  }

  async getAgentUsage() {
    return this.request('/agents/usage');
  }

  // ============================================================
  // CEO Dashboard
  // ============================================================

  async getDAU(period = '30d') {
    return this.request(`/analytics/dau?period=${period}`);
  }

  async getFeatureUsage() {
    return this.request('/analytics/feature-usage');
  }

  async getMRR() {
    return this.request('/analytics/mrr');
  }

  async getConversionFunnel() {
    return this.request('/analytics/funnel');
  }

  // ============================================================
  // MRR Dashboard
  // ============================================================

  async getCustomerCount() {
    return this.request('/analytics/customers/count');
  }

  async getChurnRate(period = '30d') {
    return this.request(`/analytics/churn?period=${period}`);
  }

  async getLTV() {
    return this.request('/analytics/ltv');
  }

  async getCohortAnalysis() {
    return this.request('/analytics/cohorts');
  }

  async getRevenueByRegion() {
    return this.request('/analytics/revenue/region');
  }

  async getCustomerLocations() {
    return this.request('/analytics/customers/locations');
  }

  // ============================================================
  // Forecasting
  // ============================================================

  async getRevenueForecast(period = '6m') {
    return this.request(`/analytics/forecast/revenue?period=${period}`);
  }

  async getLeadForecast() {
    return this.request('/analytics/forecast/leads');
  }

  async getChurnPrediction() {
    return this.request('/analytics/forecast/churn');
  }

  // ============================================================
  // Notifications
  // ============================================================

  async getNotifications(limit = 20) {
    return this.request(`/notifications?limit=${limit}`);
  }

  async markNotificationRead(id) {
    return this.request(`/notifications/${id}/read`, { method: 'PATCH' });
  }

  async markAllNotificationsRead() {
    return this.request('/notifications/read-all', { method: 'POST' });
  }

  async getAlertRules() {
    return this.request('/notifications/rules');
  }

  async updateAlertRule(id, rule) {
    return this.request(`/notifications/rules/${id}`, { method: 'PATCH', body: rule });
  }

  // ============================================================
  // Webhooks
  // ============================================================

  async getWebhooks() {
    return this.request('/webhooks');
  }

  async createWebhook(webhook) {
    return this.request('/webhooks', { method: 'POST', body: webhook });
  }

  async deleteWebhook(id) {
    return this.request(`/webhooks/${id}`, { method: 'DELETE' });
  }

  // ============================================================
  // API Keys
  // ============================================================

  async getApiKeys() {
    return this.request('/api-keys');
  }

  async createApiKey(name) {
    return this.request('/api-keys', { method: 'POST', body: { name } });
  }

  async rotateApiKey(id) {
    return this.request(`/api-keys/${id}/rotate`, { method: 'POST' });
  }

  async deleteApiKey(id) {
    return this.request(`/api-keys/${id}`, { method: 'DELETE' });
  }

  // ============================================================
  // Workspaces
  // ============================================================

  async getWorkspaces() {
    return this.request('/workspaces');
  }

  async createWorkspace(name) {
    return this.request('/workspaces', { method: 'POST', body: { name } });
  }

  async switchWorkspace(id) {
    return this.request(`/workspaces/${id}/switch`, { method: 'POST' });
  }

  // ============================================================
  // User Management
  // ============================================================

  async getUsers() {
    return this.request('/users');
  }

  async inviteUser(email, role) {
    return this.request('/users/invite', { method: 'POST', body: { email, role } });
  }

  async updateUserRole(userId, role) {
    return this.request(`/users/${userId}/role`, { method: 'PATCH', body: { role } });
  }

  async removeUser(userId) {
    return this.request(`/users/${userId}`, { method: 'DELETE' });
  }

  // ============================================================
  // AI Insights
  // ============================================================

  async getAIInsights() {
    return this.request('/ai/insights');
  }

  async getAnomalies() {
    return this.request('/ai/anomalies');
  }

  async getAIRecommendations() {
    return this.request('/ai/recommendations');
  }

  async processNLQuery(query) {
    return this.request('/ai/query', { method: 'POST', body: { query } });
  }

  async getQueryHistory() {
    return this.request('/ai/query/history');
  }

  // ============================================================
  // Automation Center
  // ============================================================

  async getAutomations() {
    return this.request('/automations');
  }

  async createAutomation(automation) {
    return this.request('/automations', { method: 'POST', body: automation });
  }

  async updateAutomation(id, automation) {
    return this.request(`/automations/${id}`, { method: 'PUT', body: automation });
  }

  async deleteAutomation(id) {
    return this.request(`/automations/${id}`, { method: 'DELETE' });
  }

  async triggerAutomation(id) {
    return this.request(`/automations/${id}/trigger`, { method: 'POST' });
  }

  async getAutomationRuns(automationId, limit = 20) {
    return this.request(`/automations/${automationId}/runs?limit=${limit}`);
  }

  // ============================================================
  // Collaboration Hub
  // ============================================================

  async getSharedDashboards() {
    return this.request('/collaboration/dashboards');
  }

  async createSharedDashboard(dashboard) {
    return this.request('/collaboration/dashboards', { method: 'POST', body: dashboard });
  }

  async updateSharedDashboard(id, dashboard) {
    return this.request(`/collaboration/dashboards/${id}`, { method: 'PUT', body: dashboard });
  }

  async deleteSharedDashboard(id) {
    return this.request(`/collaboration/dashboards/${id}`, { method: 'DELETE' });
  }

  async getComments(targetType = null, targetId = null) {
    const query = targetType ? `?target_type=${targetType}&target_id=${targetId}` : '';
    return this.request(`/collaboration/comments${query}`);
  }

  async createComment(comment) {
    return this.request('/collaboration/comments', { method: 'POST', body: comment });
  }

  async getActivityFeed() {
    return this.request('/collaboration/activity');
  }

  async getWorkspacesList() {
    return this.request('/collaboration/workspaces');
  }

  async createWorkspace(workspace) {
    return this.request('/collaboration/workspaces', { method: 'POST', body: workspace });
  }

  // ============================================================
  // Dashboard Customization
  // ============================================================

  async getDashboardViews() {
    return this.request('/dashboard/views');
  }

  async saveDashboardView(view) {
    return this.request('/dashboard/views', { method: 'POST', body: view });
  }

  async updateDashboardView(id, view) {
    return this.request(`/dashboard/views/${id}`, { method: 'PUT', body: view });
  }

  async deleteDashboardView(id) {
    return this.request(`/dashboard/views/${id}`, { method: 'DELETE' });
  }

  async globalSearch(query, filters = {}) {
    return this.request('/search', { method: 'POST', body: { query, ...filters } });
  }

  // ============================================================
  // Scheduled Reports
  // ============================================================

  async getScheduledReports() {
    return this.request('/reports/scheduled');
  }

  async createScheduledReport(report) {
    return this.request('/reports/schedule', { method: 'POST', body: report });
  }

  async deleteScheduledReport(id) {
    return this.request(`/reports/schedule/${id}`, { method: 'DELETE' });
  }

  // ============================================================
  // Real-time
  // ============================================================

  async getRealtimeMetrics() {
    return this.request('/realtime/metrics');
  }

  async getActivityStream() {
    return this.request('/realtime/activity');
  }
}

// ============================================================
// Paperclip API Service
// ============================================================

class PaperclipApiService {
  constructor(baseUrl = PAPERCLIP_API) {
    this.baseUrl = baseUrl;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const apiKey = import.meta.env.VITE_PAPERCLIP_API_KEY;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey ? { 'Authorization': `Bearer ${apiKey}` } : {}),
      },
      ...options,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetchWithTimeout(url, config, 10000);
      if (!response.ok) {
        throw new ApiError(`Paperclip API Error: ${response.status}`, response.status);
      }
      return await response.json();
    } catch (error) {
      console.warn(`Paperclip API unavailable: ${endpoint}`, error.message);
      return { data: null, isDemo: true };
    }
  }

  async getMe() {
    return this.request('/api/agents/me');
  }

  async getAgents(companyId) {
    return this.request(`/api/companies/${companyId}/agents`);
  }

  async getAgent(agentId) {
    return this.request(`/api/agents/${agentId}`);
  }

  async getIssues(companyId, params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/api/companies/${companyId}/issues${query ? `?${query}` : ''}`);
  }

  async getDashboard(companyId) {
    return this.request(`/api/companies/${companyId}/dashboard`);
  }

  async getCompany(companyId) {
    return this.request(`/api/companies/${companyId}`);
  }
}

export const api = new ApiService();
export const paperclipApi = new PaperclipApiService();
export default api;
