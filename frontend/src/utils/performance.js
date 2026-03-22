/**
 * Performance monitoring - Real User Metrics (RUM)
 * Part of Phase 9: Backend Integration & Metrics (AIC-901)
 */
import { onCLS, onFCP, onLCP, onTTFB, onINP } from 'web-vitals';

// Performance metrics store
const metrics = {
  LCP: [],
  CLS: [],
  TTFB: [],
  FCP: [],
  INP: [],
};

// Track API latency
const apiLatency = [];

// Session quality score
let sessionScore = 100;

function getVitalStatus(value, thresholds) {
  if (value <= thresholds.good) return 'good';
  if (value <= thresholds.needsImprovement) return 'needs-improvement';
  return 'poor';
}

function updateSessionScore(metric, delta) {
  // Deduct points based on metric importance
  const impact = { LCP: 30, INP: 25, CLS: 25, FID: 10, TTFB: 10 }[metric] || 10;
  if (delta > 0) sessionScore = Math.max(0, sessionScore - impact * delta * 0.01);
}

function sendToAnalytics(metric, value, rating) {
  // Send to analytics endpoint if available
  if (navigator.sendBeacon && typeof navigator.sendBeacon === 'function') {
    const data = JSON.stringify({
      metric,
      value,
      rating,
      url: window.location.pathname,
      timestamp: Date.now(),
    });
    // Don't block the main thread
    navigator.sendBeacon('/api/metrics', data);
  }
}

function handleVital({ name, value, delta, rating }) {
  if (!metrics[name]) return;

  metrics[name].push({
    value,
    delta,
    rating,
    timestamp: Date.now(),
    url: window.location.pathname,
  });

  updateSessionScore(name, delta);
  sendToAnalytics(name, value, rating);

  // Log in development
  if (import.meta.env.DEV) {
    const color = rating === 'good' ? '#10b981' : rating === 'needs-improvement' ? '#f59e0b' : '#ef4444';
    console.log(
      `%c${name}: ${Math.round(value * 100) / 100}${name === 'CLS' ? '' : 'ms'}`,
      `color: ${color}; font-weight: bold;`,
      `rating: ${rating}, delta: ${Math.round(delta * 100) / 100}`
    );
  }
}

/**
 * Start collecting web vitals
 */
export function startWebVitals() {
  // Only run in browser
  if (typeof window === 'undefined') return;

  // CLS - Cumulative Layout Shift
  onCLS(handleVital);

  // FID - First Input Delay (deprecated in v5, INP replaces it)
  // onFID(handleVital);

  // FCP - First Contentful Paint
  onFCP(handleVital);

  // LCP - Largest Contentful Paint
  onLCP(handleVital);

  // TTFB - Time To First Byte
  onTTFB(handleVital);

  // INP - Interaction to Next Paint
  onINP(handleVital);
}

/**
 * Track API latency
 */
export function trackApiLatency(endpoint, duration, status) {
  apiLatency.push({
    endpoint,
    duration,
    status,
    timestamp: Date.now(),
  });

  // Keep last 100 entries
  if (apiLatency.length > 100) {
    apiLatency.shift();
  }
}

/**
 * Get aggregated metrics for display
 */
export function getAggregatedMetrics() {
  const getStats = (arr, unit = 'ms') => {
    if (!arr.length) return { latest: 0, avg: 0, p50: 0, p95: 0, count: 0 };
    const values = arr.map(m => m.value).sort((a, b) => a - b);
    const sum = values.reduce((a, b) => a + b, 0);
    return {
      latest: values[values.length - 1],
      avg: Math.round(sum / values.length),
      p50: values[Math.floor(values.length * 0.5)],
      p95: values[Math.floor(values.length * 0.95)],
      count: values.length,
    };
  };

  return {
    LCP: getStats(metrics.LCP, 'ms'),
    CLS: getStats(metrics.CLS),
    TTFB: getStats(metrics.TTFB, 'ms'),
    FCP: getStats(metrics.FCP, 'ms'),
    INP: getStats(metrics.INP, 'ms'),
    sessionScore: Math.round(sessionScore),
    apiLatency: apiLatency.slice(-20),
  };
}

/**
 * Get thresholds for each metric
 */
export const VITALS_THRESHOLDS = {
  LCP: { good: 2500, needsImprovement: 4000, unit: 'ms' },
  CLS: { good: 0.1, needsImprovement: 0.25, unit: '' },
  TTFB: { good: 800, needsImprovement: 1800, unit: 'ms' },
  FCP: { good: 1800, needsImprovement: 3000, unit: 'ms' },
  INP: { good: 200, needsImprovement: 500, unit: 'ms' },
};

/**
 * Get color for metric rating
 */
export function getVitalColor(rating) {
  return rating === 'good' ? '#10b981' : rating === 'needs-improvement' ? '#f59e0b' : '#ef4444';
}
