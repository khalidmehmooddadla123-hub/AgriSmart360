import { useState } from 'react';
import type { Notification } from '../types';

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: '1', userId: '1', title: 'گندم کی قیمت میں اضافہ', message: 'لاہور منڈی میں گندم کی قیمت 50 روپے فی من بڑھ گئی', type: 'price', read: false, createdAt: new Date().toISOString() },
  { id: '2', userId: '1', title: 'موسمی انتباہ', message: 'کل لاہور میں بارش متوقع ہے، سپرے نہ کریں', type: 'weather', read: false, createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: '3', userId: '1', title: 'حکومتی اعلان', message: 'گندم کسانوں کے لیے نئی سبسڈی اسکیم', type: 'govt', read: true, createdAt: new Date(Date.now() - 86400000).toISOString() },
];

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return { notifications, unreadCount, markAsRead, markAllAsRead };
}
