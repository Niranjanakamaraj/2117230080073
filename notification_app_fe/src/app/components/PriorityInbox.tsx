"use client";

import { useEffect, useState } from 'react';
import { Notification, getTopNNotifications } from '../../lib/utils/notifications';
import { useNotificationContext } from '../../lib/contexts/NotificationContext';

const MOCK_NOTIFICATIONS: Notification[] = [
  { "ID": "d146095a", "Type": "Result", "Message": "mid-sem", "Timestamp": "2026-04-22 17:51:30" },
  { "ID": "b283218f", "Type": "Placement", "Message": "CSX Corporation hiring", "Timestamp": "2026-04-22 17:51:18" },
  { "ID": "81589ada", "Type": "Event", "Message": "farewell", "Timestamp": "2026-04-22 17:51:06" },
  { "ID": "0005513a", "Type": "Result", "Message": "mid-sem", "Timestamp": "2026-04-22 17:50:54" },
  { "ID": "ea836726", "Type": "Result", "Message": "project-review", "Timestamp": "2026-04-22 17:50:42" },
  { "ID": "a1", "Type": "Placement", "Message": "Google Hiring", "Timestamp": "2026-04-23 10:00:00" },
  { "ID": "a2", "Type": "Event", "Message": "Tech Talk", "Timestamp": "2026-04-23 11:00:00" },
  { "ID": "a3", "Type": "Result", "Message": "Finals", "Timestamp": "2026-04-23 12:00:00" },
  { "ID": "a4", "Type": "Placement", "Message": "Microsoft Hiring", "Timestamp": "2026-04-23 09:00:00" },
  { "ID": "a5", "Type": "Event", "Message": "Hackathon", "Timestamp": "2026-04-23 08:00:00" },
  { "ID": "a6", "Type": "Result", "Message": "Quiz 1", "Timestamp": "2026-04-21 17:50:42" },
  { "ID": "a7", "Type": "Placement", "Message": "Amazon Hiring", "Timestamp": "2026-04-20 17:50:42" },
];

export default function PriorityInbox() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { readStatus, markAsRead } = useNotificationContext();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch('/api/notifications');
        if (!res.ok) {
          throw new Error('Failed to fetch from API');
        }
        const data = await res.json();
        if (data.notifications && Array.isArray(data.notifications)) {
          setNotifications(data.notifications);
        } else {
           throw new Error('Invalid data format');
        }
      } catch (err) {
        setNotifications(MOCK_NOTIFICATIONS);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
    
    const interval = setInterval(() => {
        setNotifications(prev => {
            const newNotif: Notification = {
                ID: Math.random().toString(36).substring(7),
                Type: ['Placement', 'Result', 'Event'][Math.floor(Math.random() * 3)] as Notification['Type'],
                Message: 'New Notification ' + new Date().toLocaleTimeString(),
                Timestamp: new Date().toISOString()
            };
            return [...prev, newNotif];
        });
    }, 15000); 

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="loading">Loading Priority Inbox...</div>;
  }

  const topNotifications = getTopNNotifications(notifications, 10);

  return (
    <div className="priority-inbox">
      <div className="inbox-header">
        <h2>Priority Inbox</h2>
        <span className="badge">Top {topNotifications.length}</span>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="notification-list">
        {topNotifications.map((notif, index) => {
          const isRead = readStatus[notif.ID];
          return (
            <div 
              key={notif.ID} 
              className={`notification-item type-${notif.Type.toLowerCase()} ${isRead ? 'read' : 'unread'}`} 
              style={{ animationDelay: `${index * 0.05}s` }}
              onClick={() => markAsRead(notif.ID)}
            >
            <div className="notification-icon">
              {notif.Type === 'Placement' && '💼'}
              {notif.Type === 'Result' && '📊'}
              {notif.Type === 'Event' && '🎉'}
            </div>
            <div className="notification-content">
              <div className="notification-top">
                <span className={`type-badge ${notif.Type.toLowerCase()}`}>{notif.Type}</span>
                <span className="timestamp">{new Date(notif.Timestamp).toLocaleString()}</span>
              </div>
              <p className="message">{notif.Message}</p>
            </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
