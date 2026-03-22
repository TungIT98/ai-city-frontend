/**
 * DemoModeBanner - Shows when API is unavailable and demo data is in use
 * Part of Phase 7: Backend Integration & Real API (AIC-700)
 */
import { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';

export function DemoModeBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show banner after a short delay to avoid flash
    const timer = setTimeout(() => {
      if (!navigator.onLine) {
        setVisible(true);
      }
    }, 2000);

    const handleOnline = () => setVisible(false);
    const handleOffline = () => setVisible(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="demo-mode-banner" role="alert" aria-live="polite">
      <WifiOff size={14} />
      <span>
        Demo Mode — Using sample data. Connect to backend for live data.
      </span>
    </div>
  );
}

export default DemoModeBanner;
