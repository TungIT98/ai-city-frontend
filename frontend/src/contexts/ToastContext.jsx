/**
 * Toast Context - Global real-time toast notification system
 * Phase 10: Replaces alert() calls across all pages
 */
import { createContext, useContext, useState, useCallback, useRef } from 'react';

const ToastContext = createContext(null);

const ICONS = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ℹ',
};

const COLORS = {
  success: { bg: '#f0fdf4', border: '#22c55e', icon: '#16a34a', text: '#15803d' },
  error: { bg: '#fef2f2', border: '#ef4444', icon: '#dc2626', text: '#b91c1c' },
  warning: { bg: '#fffbeb', border: '#f59e0b', icon: '#d97706', text: '#b45309' },
  info: { bg: '#eff6ff', border: '#3b82f6', icon: '#2563eb', text: '#1d4ed8' },
};

let toastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
    if (timers.current[id]) {
      clearTimeout(timers.current[id]);
      delete timers.current[id];
    }
  }, []);

  const addToast = useCallback((message, type = 'info', duration = 5000) => {
    const id = ++toastId;
    setToasts(prev => {
      const next = [{ id, message, type, createdAt: Date.now() }, ...prev];
      return next.slice(0, 5);
    });

    if (duration > 0) {
      timers.current[id] = setTimeout(() => removeToast(id), duration);
    }

    return id;
  }, [removeToast]);

  // Convenience methods
  const toast = {
    success: (msg, duration) => addToast(msg, 'success', duration),
    error: (msg, duration) => addToast(msg, 'error', duration),
    warning: (msg, duration) => addToast(msg, 'warning', duration),
    info: (msg, duration) => addToast(msg, 'info', duration),
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast, toast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}

function ToastContainer({ toasts, removeToast }) {
  if (toasts.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '16px',
        right: '16px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        maxWidth: '380px',
        width: 'calc(100vw - 32px)',
      }}
      role="region"
      aria-label="Notifications"
    >
      {toasts.map(t => (
        <ToastItem key={t.id} toast={t} onRemove={() => removeToast(t.id)} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onRemove }) {
  const colors = COLORS[toast.type] || COLORS.info;
  const [progress, setProgress] = useState(100);
  const startTime = useRef(Date.now());
  const duration = 5000;

  // Progress bar animation
  useState(() => {
    if (duration <= 0) return;
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime.current;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);
      if (remaining <= 0) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  });

  return (
    <div
      role="alert"
      aria-live={toast.type === 'error' ? 'assertive' : 'polite'}
      style={{
        background: colors.bg,
        border: `1px solid ${colors.border}`,
        borderRadius: '10px',
        padding: '14px 16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        animation: 'slideInRight 0.3s ease',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Progress bar */}
      {duration > 0 && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            height: '3px',
            width: `${progress}%`,
            background: colors.border,
            transition: 'width 50ms linear',
            borderRadius: '0 2px 2px 0',
          }}
        />
      )}

      {/* Icon */}
      <div
        style={{
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          background: colors.icon,
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px',
          fontWeight: 'bold',
          flexShrink: 0,
        }}
      >
        {ICONS[toast.type]}
      </div>

      {/* Message */}
      <div style={{ flex: 1, fontSize: '14px', color: colors.text, lineHeight: 1.5, paddingRight: '8px' }}>
        {toast.message}
      </div>

      {/* Close */}
      <button
        onClick={onRemove}
        aria-label="Dismiss notification"
        style={{
          background: 'none',
          border: 'none',
          color: colors.text,
          cursor: 'pointer',
          fontSize: '16px',
          opacity: 0.6,
          padding: '0 4px',
          flexShrink: 0,
          lineHeight: 1,
        }}
        onMouseEnter={e => e.target.style.opacity = 1}
        onMouseLeave={e => e.target.style.opacity = 0.6}
      >
        ✕
      </button>
    </div>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}

export default ToastContext;
