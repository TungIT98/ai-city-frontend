/**
 * Realtime Context - WebSocket connection for live dashboard updates
 */
import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { io } from 'socket.io-client';

const RealtimeContext = createContext(null);

// Simulated real-time data for demo (when backend WebSocket is unavailable)
function createSimulatedUpdates() {
  const events = [];
  const now = Date.now();

  // Live metrics simulation
  events.push({
    type: 'metrics_update',
    data: {
      visitors: Math.floor(Math.random() * 50) + 150,
      leads: Math.floor(Math.random() * 10) + 25,
      conversions: (Math.random() * 5 + 2).toFixed(1),
      revenue: Math.floor(Math.random() * 5000) + 15000,
    },
    timestamp: now,
  });

  // Activity events
  const activityTypes = ['lead_created', 'agent_started', 'conversion', 'user_login'];
  events.push({
    type: 'activity',
    data: {
      action: activityTypes[Math.floor(Math.random() * activityTypes.length)],
      agent: `Agent ${Math.floor(Math.random() * 4) + 1}`,
      timestamp: now,
    },
    timestamp: now,
  });

  // Alert events (occasional)
  if (Math.random() > 0.8) {
    events.push({
      type: 'alert',
      data: {
        severity: Math.random() > 0.5 ? 'warning' : 'info',
        message: 'Lead score threshold exceeded',
        metric: 'lead_score',
      },
      timestamp: now,
    });
  }

  return events;
}

export function RealtimeProvider({ children }) {
  const [connected, setConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('connecting'); // connecting, connected, disconnected, error
  const [liveMetrics, setLiveMetrics] = useState({
    visitors: 0,
    leads: 0,
    conversions: 0,
    revenue: 0,
    activeUsers: 0,
  });
  const [activities, setActivities] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const socketRef = useRef(null);
  const reconnectAttempts = useRef(0);
  const simulationRef = useRef(null);

  // Connect to WebSocket
  const connect = useCallback(() => {
    const wsUrl = import.meta.env.VITE_API_URL?.replace('http', 'ws') || 'ws://localhost:8000';

    try {
      socketRef.current = io(wsUrl, {
        path: '/socket.io',
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 10000,
      });

      socketRef.current.on('connect', () => {
        setConnected(true);
        setConnectionStatus('connected');
        reconnectAttempts.current = 0;
      });

      socketRef.current.on('disconnect', () => {
        setConnected(false);
        setConnectionStatus('disconnected');
        startSimulation();
      });

      socketRef.current.on('connect_error', () => {
        setConnectionStatus('error');
        startSimulation();
      });

      // Listen for real-time events
      socketRef.current.on('metrics_update', (data) => {
        setLiveMetrics(data);
      });

      socketRef.current.on('activity', (data) => {
        setActivities(prev => [data, ...prev.slice(0, 49)]);
      });

      socketRef.current.on('alert', (data) => {
        setAlerts(prev => [data, ...prev.slice(0, 19)]);
      });

    } catch {
      startSimulation();
    }
  }, []);

  // Start simulated updates (demo mode)
  const startSimulation = useCallback(() => {
    if (simulationRef.current) return;
    setConnectionStatus('simulated');

    // Initial metrics
    setLiveMetrics({
      visitors: Math.floor(Math.random() * 50) + 150,
      leads: Math.floor(Math.random() * 10) + 25,
      conversions: (Math.random() * 5 + 2).toFixed(1),
      revenue: Math.floor(Math.random() * 5000) + 15000,
      activeUsers: Math.floor(Math.random() * 20) + 30,
    });

    simulationRef.current = setInterval(() => {
      const events = createSimulatedUpdates();
      events.forEach(event => {
        if (event.type === 'metrics_update') {
          setLiveMetrics(prev => ({
            ...prev,
            ...event.data,
            activeUsers: prev.activeUsers + Math.floor(Math.random() * 3) - 1,
          }));
        } else if (event.type === 'activity') {
          setActivities(prev => [event.data, ...prev.slice(0, 49)]);
        } else if (event.type === 'alert') {
          setAlerts(prev => [event.data, ...prev.slice(0, 19)]);
        }
      });
    }, 5000);
  }, []);

  // Disconnect
  const disconnect = useCallback(() => {
    if (simulationRef.current) {
      clearInterval(simulationRef.current);
      simulationRef.current = null;
    }
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    setConnected(false);
    setConnectionStatus('disconnected');
  }, []);

  // Emit event
  const emit = useCallback((event, data) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, data);
    }
  }, []);

  // Clear alerts
  const clearAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  // Connect on mount
  useEffect(() => {
    connect();
    return () => {
      if (simulationRef.current) {
        clearInterval(simulationRef.current);
      }
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [connect]);

  const value = {
    connected,
    connectionStatus,
    liveMetrics,
    activities,
    alerts,
    connect,
    disconnect,
    emit,
    clearAlerts,
  };

  return (
    <RealtimeContext.Provider value={value}>
      {children}
    </RealtimeContext.Provider>
  );
}

export function useRealtime() {
  const context = useContext(RealtimeContext);
  if (!context) {
    throw new Error('useRealtime must be used within RealtimeProvider');
  }
  return context;
}

export default RealtimeContext;
