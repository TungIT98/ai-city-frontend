/**
 * AI City API Service
 * Connects frontend to backend API
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const PAPERCLIP_API = import.meta.env.VITE_PAPERCLIP_API || 'http://127.0.0.1:3100';

class ApiService {
  constructor(baseUrl = API_BASE) {
    this.baseUrl = baseUrl;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Health check
  async getHealth() {
    return this.request('/health');
  }

  // Analytics
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

  // Leads
  async getLeads(status = null, limit = 50) {
    const query = status ? `?status=${status}&limit=${limit}` : `?limit=${limit}`;
    return this.request(`/leads${query}`);
  }

  async getLead(id) {
    return this.request(`/leads/${id}`);
  }

  async createLead(lead) {
    return this.request('/leads', { method: 'POST', body: lead });
  }

  async updateLead(id, lead) {
    return this.request(`/leads/${id}`, { method: 'PATCH', body: lead });
  }

  async getLeadAnalytics() {
    return this.request('/leads/analytics/conversion');
  }

  // Reports
  async getReports(limit = 10) {
    return this.request(`/reports?limit=${limit}`);
  }

  async getReport(id) {
    return this.request(`/reports/${id}`);
  }

  async generateReport(type = 'weekly') {
    return this.request('/reports/generate', { method: 'POST', body: { report_type: type } });
  }

  // Search (RAG)
  async search(query, limit = 5) {
    return this.request('/search', { method: 'POST', body: { query, limit } });
  }

  // AI Agents
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

  // CEO Dashboard - Usage Tracking & Revenue Analytics
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

  // MRR Dashboard - Customer Metrics
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
}

// Paperclip API Service - Agent & Task visualization data
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
      const response = await fetch(url, config);
      if (!response.ok) {
        throw new Error(`Paperclip API Error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Paperclip API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Get current agent identity
  async getMe() {
    return this.request('/api/agents/me');
  }

  // Get all agents in company
  async getAgents(companyId) {
    return this.request(`/api/companies/${companyId}/agents`);
  }

  // Get agent by ID
  async getAgent(agentId) {
    return this.request(`/api/agents/${agentId}`);
  }

  // Get issues/tasks for visualization
  async getIssues(companyId, params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/api/companies/${companyId}/issues${query ? `?${query}` : ''}`);
  }

  // Get dashboard data
  async getDashboard(companyId) {
    return this.request(`/api/companies/${companyId}/dashboard`);
  }

  // Get company info
  async getCompany(companyId) {
    return this.request(`/api/companies/${companyId}`);
  }
}

export const api = new ApiService();
export const paperclipApi = new PaperclipApiService();
export default api;