/**
 * Notification Bell - In-app notification dropdown
 */
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './NotificationBell.css';

const QUICK_NOTIFS = [
  { id: 1, type: 'alert', icon: '⚠️', text: 'Churn risk: TechCorp 78%', time: '5m' },
  { id: 2, type: 'success', icon: '✅', text: 'MRR report ready', time: '23m' },
  { id: 3, type: 'info', icon: '🤖', text: 'Agent completed 47 posts', time: '1h' },
];

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifs, setNotifs] = useState(QUICK_NOTIFS);
  const ref = useRef(null);

  const unread = notifs.filter(n => n.type === 'alert').length;

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="notif-bell" ref={ref}>
      <button
        className="bell-btn"
        onClick={() => setOpen(!open)}
        aria-label="Notifications"
      >
        🔔
        {unread > 0 && <span className="bell-badge">{unread}</span>}
      </button>

      {open && (
        <div className="notif-dropdown">
          <div className="notif-dropdown-header">
            <span>Notifications</span>
            <Link to="/notifications" onClick={() => setOpen(false)}>View all</Link>
          </div>
          <div className="notif-dropdown-list">
            {notifs.map(notif => (
              <div key={notif.id} className={`notif-dropdown-item type-${notif.type}`}>
                <span className="notif-dropdown-icon">{notif.icon}</span>
                <div className="notif-dropdown-content">
                  <p>{notif.text}</p>
                  <span>{notif.time} ago</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
