import type { Notification } from '../types';

interface NotificationToastProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
}

function getNotificationStyle(type: Notification['type']) {
  switch (type) {
    case 'success':
      return {
        bg: 'bg-green-500/20',
        border: 'border-green-500/40',
        text: 'text-green-300',
        icon: '+',
      };
    case 'warning':
      return {
        bg: 'bg-amber-500/20',
        border: 'border-amber-500/40',
        text: 'text-amber-300',
        icon: '!',
      };
    case 'error':
      return {
        bg: 'bg-red-500/20',
        border: 'border-red-500/40',
        text: 'text-red-300',
        icon: 'x',
      };
    case 'info':
    default:
      return {
        bg: 'bg-blue-500/20',
        border: 'border-blue-500/40',
        text: 'text-blue-300',
        icon: 'i',
      };
  }
}

export default function NotificationToast({ notifications, onDismiss }: NotificationToastProps) {
  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => {
        const style = getNotificationStyle(notification.type);
        return (
          <div
            key={notification.id}
            className={`animate-toast-in flex items-center gap-3 px-4 py-3 rounded-lg border backdrop-blur-sm ${style.bg} ${style.border}`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${style.bg} ${style.text} border ${style.border}`}>
              {style.icon}
            </span>
            <span className={`text-sm ${style.text}`}>{notification.message}</span>
            <button
              onClick={() => onDismiss(notification.id)}
              className="ml-2 text-text-muted hover:text-text-primary transition-colors"
            >
              x
            </button>
          </div>
        );
      })}
    </div>
  );
}
