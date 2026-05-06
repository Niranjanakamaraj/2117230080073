"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

type NotificationContextType = {
  readStatus: Record<string, boolean>;
  markAsRead: (id: string) => void;
};

const NotificationContext = createContext<NotificationContextType>({
  readStatus: {},
  markAsRead: () => {},
});

export const useNotificationContext = () => useContext(NotificationContext);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [readStatus, setReadStatus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const saved = localStorage.getItem('notificationReadStatus');
    if (saved) {
      try {
        setReadStatus(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse read status", e);
      }
    }
  }, []);

  const markAsRead = (id: string) => {
    setReadStatus(prev => {
      if (prev[id]) return prev; // Already read
      const newStatus = { ...prev, [id]: true };
      localStorage.setItem('notificationReadStatus', JSON.stringify(newStatus));
      return newStatus;
    });
  };

  return (
    <NotificationContext.Provider value={{ readStatus, markAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
}
