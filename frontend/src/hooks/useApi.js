/**
 * useApi - React hook for data fetching with loading/error states
 * Part of Phase 7: Backend Integration & Real API (AIC-700)
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import api from '../services/api';

/**
 * Generic data fetching hook
 * @param {Function} fetchFn - API function to call
 * @param {Array} deps - Dependency array for re-fetching
 * @returns {Object} { data, loading, error, refetch }
 */
export function useApi(fetchFn, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFn();
      if (mountedRef.current) {
        setData(result);
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err.message || 'Failed to fetch data');
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    mountedRef.current = true;
    fetch();
    return () => {
      mountedRef.current = false;
    };
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}

/**
 * Hook for fetching leads with filtering
 */
export function useLeads(status = null) {
  return useApi(() => api.getLeads(status), [status]);
}

/**
 * Hook for fetching analytics overview
 */
export function useAnalytics() {
  return useApi(() => api.getAnalyticsOverview());
}

/**
 * Hook for fetching agents
 */
export function useAgents() {
  return useApi(() => api.getAgents());
}

/**
 * Hook for fetching notifications
 */
export function useNotifications() {
  return useApi(() => api.getNotifications());
}

/**
 * Hook for fetching AI insights
 */
export function useAIInsights() {
  return useApi(() => api.getAIInsights());
}

/**
 * Hook for fetching MRR data
 */
export function useMRR() {
  return useApi(() => api.getMRR());
}

/**
 * Hook for mutation operations (POST, PUT, DELETE)
 * @param {Function} mutationFn - API mutation function
 * @returns {Object} { mutate, loading, error, data, reset }
 */
export function useMutation(mutationFn) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const mutate = useCallback(async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const result = await mutationFn(payload);
      setData(result);
      return result;
    } catch (err) {
      const errorMsg = err.message || 'Operation failed';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [mutationFn]);

  const reset = useCallback(() => {
    setError(null);
    setData(null);
  }, []);

  return { mutate, loading, error, data, reset };
}

export default useApi;
