import { useState, useCallback } from 'react';
import type { Notification } from '../types';

let notificationId = 0;

export function useNotification() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback(
    (type: Notification['type'], message: string, duration = 3000) => {
      const id = `notif-${++notificationId}`;
      const notification: Notification = { id, type, message, duration };
      setNotifications((prev) => [...prev, notification]);

      if (duration > 0) {
        setTimeout(() => {
          setNotifications((prev) => prev.filter((n) => n.id !== id));
        }, duration);
      }

      return id;
    },
    []
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return { notifications, addNotification, removeNotification };
}
