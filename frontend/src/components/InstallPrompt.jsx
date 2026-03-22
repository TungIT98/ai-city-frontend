/**
 * PWA Install Prompt Component
 * Shows install banner for mobile/desktop PWA installation
 */
import { useState, useEffect } from 'react';
import './InstallPrompt.css';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(() => {
    return localStorage.getItem('installDismissed') === 'true';
  });

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (!dismissed) {
        setTimeout(() => setShow(true), 3000);
      }
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, [dismissed]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShow(false);
      // Request push notification permission after install
      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShow(false);
    setDismissed(true);
    localStorage.setItem('installDismissed', 'true');
  };

  if (!show) return null;

  return (
    <div className="install-prompt">
      <div className="install-content">
        <div className="install-icon">🚀</div>
        <div className="install-text">
          <strong>Install AI City</strong>
          <span>Get the app for faster access and offline use</span>
        </div>
      </div>
      <div className="install-actions">
        <button className="install-btn" onClick={handleInstall}>Install</button>
        <button className="dismiss-btn" onClick={handleDismiss}>Later</button>
      </div>
    </div>
  );
}
