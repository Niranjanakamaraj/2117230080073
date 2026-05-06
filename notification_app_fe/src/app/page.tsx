"use client";

import { useEffect, useState } from 'react';
import { useNotificationContext } from '../lib/contexts/NotificationContext';
import { Notification } from '../lib/utils/notifications';
import { Log } from 'logging_middleware';

export default function AllNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination & Filters
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [filterType, setFilterType] = useState<string>('All');
  
  const { readStatus, markAsRead } = useNotificationContext();

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      setError(null);
      try {
        let url = `/api/notifications?page=${page}&limit=${limit}`;
        if (filterType !== 'All') {
          url += `&notification_type=${filterType}`;
        }
        
        Log('frontend', 'info', 'page', `Fetching notifications page ${page}`);
        const res = await fetch(url);
        
        if (!res.ok) {
          throw new Error('Failed to fetch notifications');
        }
        const data = await res.json();
        
        if (data.notifications && Array.isArray(data.notifications)) {
          // Add random ID/Type for mock test server responses if they lack it
          const parsedNotifications = data.notifications.map((n: any) => ({
             ...n,
             ID: n.ID || Math.random().toString(36).substring(7),
             Type: n.Type || ['Placement', 'Result', 'Event'][Math.floor(Math.random() * 3)]
          }));
          setNotifications(parsedNotifications);
        } else {
           setNotifications([]);
        }
      } catch (err) {
        Log('frontend', 'error', 'page', `Failed to fetch notifications`);
        // Fallback to MOCK data for UI demonstration
        const MOCK = [
          { "ID": "d146095a", "Type": "Result", "Message": "mid-sem", "Timestamp": "2026-04-22 17:51:30" },
          { "ID": "b283218f", "Type": "Placement", "Message": "CSX Corporation hiring", "Timestamp": "2026-04-22 17:51:18" },
          { "ID": "81589ada", "Type": "Event", "Message": "farewell", "Timestamp": "2026-04-22 17:51:06" },
          { "ID": "0005513a", "Type": "Result", "Message": "mid-sem", "Timestamp": "2026-04-22 17:50:54" },
          { "ID": "ea836726", "Type": "Result", "Message": "project-review", "Timestamp": "2026-04-22 17:50:42" },
          { "ID": "a1", "Type": "Placement", "Message": "Google Hiring", "Timestamp": "2026-04-23 10:00:00" },
          { "ID": "a2", "Type": "Event", "Message": "Tech Talk", "Timestamp": "2026-04-23 11:00:00" }
        ];
        // Apply local filtering to mock data if needed
        let filteredMock = MOCK;
        if (filterType !== 'All') {
            filteredMock = filteredMock.filter(n => n.Type === filterType);
        }
        setNotifications(filteredMock.slice(0, limit));
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [page, limit, filterType]);

  return (
    <main className="main-container">
      <header className="app-header">
        <h1>Campus Notifications Platform</h1>
      </header>
      <section className="dashboard-content">
        <div className="all-notifications">
      <div className="inbox-header">
        <h2>All Notifications</h2>
        
        <div className="controls">
          <select 
            className="filter-select" 
            value={filterType} 
            onChange={(e) => {
                setFilterType(e.target.value);
                setPage(1); // Reset to page 1 on filter change
            }}
          >
            <option value="All">All Types</option>
            <option value="Placement">Placement</option>
            <option value="Result">Result</option>
            <option value="Event">Event</option>
          </select>
          
          <select 
            className="filter-select" 
            value={limit} 
            onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
            }}
          >
            <option value={5}>5 per page</option>
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
          </select>
        </div>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      {loading ? (
        <div className="loading">Loading notifications...</div>
      ) : (
        <>
          <div className="notification-list">
            {notifications.length === 0 && <div className="empty-state">No notifications found.</div>}
            
            {notifications.map((notif, index) => {
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
                  {!isRead && <div className="unread-dot"></div>}
                </div>
              );
            })}
          </div>
          
          <div className="pagination">
             <button 
                className="btn-paginate" 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
             >
                 Previous
             </button>
             <span className="page-indicator">Page {page}</span>
             <button 
                className="btn-paginate" 
                onClick={() => setPage(p => p + 1)}
                disabled={notifications.length < limit}
             >
                 Next
             </button>
          </div>
        </>
      )}
    </div>
      </section>
    </main>
  );
}
