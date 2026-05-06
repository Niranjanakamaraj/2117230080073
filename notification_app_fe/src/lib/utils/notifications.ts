import { Log } from 'logging_middleware';

export type NotificationType = 'Placement' | 'Result' | 'Event';

export interface Notification {
  ID: string;
  Type: NotificationType;
  Message: string;
  Timestamp: string;
}

const TYPE_WEIGHTS: Record<NotificationType, number> = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

export function sortNotifications(notifications: Notification[]): Notification[] {
    return [...notifications].sort((a, b) => {
        const weightDiff = (TYPE_WEIGHTS[b.Type] || 0) - (TYPE_WEIGHTS[a.Type] || 0);
        if (weightDiff !== 0) {
            return weightDiff; 
        }
        const timeA = new Date(a.Timestamp).getTime();
        const timeB = new Date(b.Timestamp).getTime();
        return timeB - timeA;
    });
}

export function getTopNNotifications(notifications: Notification[], n: number = 10): Notification[] {
    Log('frontend', 'info', 'utils', `Calculating top ${n} notifications out of ${notifications.length} total.`);
    return sortNotifications(notifications).slice(0, n);
}
