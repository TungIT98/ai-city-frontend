/**
 * AgentStore - LocalStorage-based agent persistence
 * Provides real storage for agent configs, runs, logs, and usage tracking
 */

const STORAGE_KEYS = {
  AGENTS: 'aicity_agents',
  RUNS: 'aicity_agent_runs',
  LOGS: 'aicity_agent_logs',
  USAGE: 'aicity_agent_usage',
  FAQS: 'aicity_faqs',
  POSTS: 'aicity_generated_posts',
  TEMPLATES: 'aicity_templates',
};

function getItem(key, defaultValue = null) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

// Agent definitions
export const AGENT_DEFINITIONS = [
  {
    id: 'social-media',
    name: 'Social Media Manager',
    description: 'Auto-generate posts, schedule to LinkedIn/Facebook, generate engagement responses',
    icon: '📱',
    color: '#6366f1',
    capabilities: ['Generate posts', 'Hashtag suggestions', 'Engagement analysis'],
  },
  {
    id: 'content-writer',
    name: 'Content Writer',
    description: 'Blog post generator, ad copy generator, email template generator',
    icon: '✍️',
    color: '#10b981',
    capabilities: ['Blog posts', 'Ad copy', 'Email templates', 'Landing page copy'],
  },
  {
    id: 'customer-support',
    name: 'Customer Support',
    description: 'FAQ automation, ticket categorization, response suggestions',
    icon: '🎧',
    color: '#f59e0b',
    capabilities: ['FAQ automation', 'Response suggestions', 'Ticket routing'],
  },
  {
    id: 'data-entry',
    name: 'Data Entry Automation',
    description: 'Form auto-fill, data extraction from documents, spreadsheet automation',
    icon: '📊',
    color: '#ec4899',
    capabilities: ['CSV import', 'Field mapping', 'Data validation', 'Export'],
  },
];

// Load agent configs
export function loadAgentConfigs() {
  return getItem(STORAGE_KEYS.AGENTS, {});
}

// Save agent config
export function saveAgentConfig(agentId, config) {
  const configs = loadAgentConfigs();
  configs[agentId] = { ...configs[agentId], ...config, updatedAt: Date.now() };
  setItem(STORAGE_KEYS.AGENTS, configs);
  return configs[agentId];
}

// Load agent runs
export function loadAgentRuns(agentId = null, limit = 20) {
  const allRuns = getItem(STORAGE_KEYS.RUNS, []);
  if (agentId) {
    return allRuns.filter(r => r.agentId === agentId).slice(0, limit);
  }
  return allRuns.slice(0, limit);
}

// Save a new run
export function saveAgentRun(run) {
  const runs = getItem(STORAGE_KEYS.RUNS, []);
  const newRun = {
    id: `run_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    ...run,
    createdAt: Date.now(),
  };
  runs.unshift(newRun);
  // Keep only last 100 runs
  if (runs.length > 100) runs.splice(100);
  setItem(STORAGE_KEYS.RUNS, runs);
  return newRun;
}

// Load agent logs
export function loadAgentLogs(agentId = null, limit = 50) {
  const allLogs = getItem(STORAGE_KEYS.LOGS, []);
  let logs = agentId ? allLogs.filter(l => l.agentId === agentId) : allLogs;
  return logs.slice(0, limit);
}

// Add a log entry
export function addAgentLog(agentId, level, message) {
  const logs = getItem(STORAGE_KEYS.LOGS, []);
  const log = {
    id: `log_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    agentId,
    level,
    message,
    timestamp: new Date().toISOString(),
  };
  logs.unshift(log);
  if (logs.length > 200) logs.splice(200);
  setItem(STORAGE_KEYS.LOGS, logs);
  return log;
}

// Load usage stats
export function loadUsageStats() {
  const stats = getItem(STORAGE_KEYS.USAGE, {
    totalCredits: 1000,
    usedCredits: 0,
    availableCredits: 1000,
    runsCount: 0,
    lastReset: Date.now(),
  });

  // Recalculate from runs
  const runs = getItem(STORAGE_KEYS.RUNS, []);
  const usedCredits = runs.reduce((sum, r) => sum + (r.creditsUsed || 0), 0);
  stats.usedCredits = usedCredits;
  stats.availableCredits = Math.max(0, stats.totalCredits - usedCredits);
  stats.runsCount = runs.length;
  setItem(STORAGE_KEYS.USAGE, stats);
  return stats;
}

// Use credits for a run
export function useCredits(amount) {
  const stats = loadUsageStats();
  if (stats.availableCredits < amount) {
    throw new Error('Insufficient credits');
  }
  stats.usedCredits += amount;
  stats.availableCredits -= amount;
  setItem(STORAGE_KEYS.USAGE, stats);
  return stats;
}

// Get agent status
export function getAgentStatus(agentId) {
  const configs = loadAgentConfigs();
  return configs[agentId]?.status || 'paused';
}

// Set agent status
export function setAgentStatus(agentId, status) {
  return saveAgentConfig(agentId, { status });
}

// Get agent stats
export function getAgentStats(agentId) {
  const runs = loadAgentRuns(agentId, 100);
  const totalRuns = runs.length;
  const successfulRuns = runs.filter(r => r.status === 'success').length;
  const successRate = totalRuns > 0 ? Math.round((successfulRuns / totalRuns) * 100) : 0;
  const totalCredits = runs.reduce((sum, r) => sum + (r.creditsUsed || 0), 0);
  return { totalRuns, successRate, creditsUsed: totalCredits };
}

// FAQ management
export function loadFAQs() {
  return getItem(STORAGE_KEYS.FAQS, []);
}

export function saveFAQ(faq) {
  const faqs = loadFAQs();
  const existing = faqs.findIndex(f => f.id === faq.id);
  if (existing >= 0) {
    faqs[existing] = { ...faqs[existing], ...faq, updatedAt: Date.now() };
  } else {
    faqs.push({ ...faq, id: `faq_${Date.now()}`, createdAt: Date.now() });
  }
  setItem(STORAGE_KEYS.FAQS, faqs);
  return faqs;
}

export function deleteFAQ(faqId) {
  const faqs = loadFAQs().filter(f => f.id !== faqId);
  setItem(STORAGE_KEYS.FAQS, faqs);
  return faqs;
}

// Generated posts
export function loadGeneratedPosts() {
  return getItem(STORAGE_KEYS.POSTS, []);
}

export function saveGeneratedPost(post) {
  const posts = loadGeneratedPosts();
  posts.unshift({ ...post, id: `post_${Date.now()}`, createdAt: Date.now() });
  if (posts.length > 50) posts.splice(50);
  setItem(STORAGE_KEYS.POSTS, posts);
  return posts;
}

// Templates
export function loadTemplates() {
  return getItem(STORAGE_KEYS.TEMPLATES, []);
}

export function saveTemplate(template) {
  const templates = loadTemplates();
  templates.push({ ...template, id: `tmpl_${Date.now()}`, createdAt: Date.now() });
  setItem(STORAGE_KEYS.TEMPLATES, templates);
  return templates;
}
