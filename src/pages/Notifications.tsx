import { useTranslation } from 'react-i18next';
import { useNotifications } from '../hooks/useNotifications';
import { Bell, BellOff, Check } from 'lucide-react';
import type { Notification } from '../types';

const TYPE_CONFIG: Record<Notification['type'], { icon: string; color: string; bg: string }> = {
  price: { icon: '💹', color: 'text-green-700', bg: 'bg-green-50 dark:bg-green-900/20' },
  weather: { icon: '🌤️', color: 'text-blue-700', bg: 'bg-blue-50 dark:bg-blue-900/20' },
  disease: { icon: '🔬', color: 'text-amber-700', bg: 'bg-amber-50 dark:bg-amber-900/20' },
  govt: { icon: '📢', color: 'text-purple-700', bg: 'bg-purple-50 dark:bg-purple-900/20' },
  order: { icon: '📦', color: 'text-orange-700', bg: 'bg-orange-50 dark:bg-orange-900/20' },
  general: { icon: '🔔', color: 'text-gray-700', bg: 'bg-gray-50 dark:bg-gray-700' },
};

export default function Notifications() {
  const { t } = useTranslation();
  const { notifications, markAsRead, markAllAsRead, unreadCount } = useNotifications();

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    const diff = Date.now() - d.getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (hours < 1) return 'ابھی ابھی';
    if (hours < 24) return `${hours} گھنٹے پہلے`;
    return `${days} دن پہلے`;
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t('notifications')}</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-primary font-urdu">{unreadCount} نئی اطلاعات</p>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-1 text-sm text-primary hover:text-primary-700"
          >
            <Check size={15} />
            سب پڑھ لیں
          </button>
        )}
      </div>

      {/* Notifications */}
      {notifications.length === 0 ? (
        <div className="card text-center py-12">
          <BellOff className="mx-auto text-gray-300 mb-3" size={48} />
          <p className="font-urdu text-gray-500">کوئی اطلاع نہیں</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map(notif => {
            const cfg = TYPE_CONFIG[notif.type];
            return (
              <div
                key={notif.id}
                className={`card p-4 cursor-pointer transition-all ${!notif.read ? 'border-l-4 border-primary shadow-md' : ''} ${cfg.bg}`}
                onClick={() => markAsRead(notif.id)}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0">{cfg.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className={`font-semibold font-urdu ${notif.read ? 'text-gray-600 dark:text-gray-400' : 'text-gray-800 dark:text-gray-100'}`}>
                        {notif.title}
                      </h3>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {!notif.read && (
                          <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                        )}
                        <span className="text-xs text-gray-400">{formatTime(notif.createdAt)}</span>
                      </div>
                    </div>
                    <p className={`text-sm font-urdu mt-1 ${notif.read ? 'text-gray-500' : 'text-gray-700 dark:text-gray-300'}`}>
                      {notif.message}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Notification Settings Link */}
      <div className="card bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800">
        <div className="flex items-center gap-3">
          <Bell className="text-primary" size={20} />
          <div>
            <h3 className="font-semibold text-primary font-urdu">اطلاع کی ترجیحات</h3>
            <p className="text-xs text-gray-500 font-urdu">کون سی اطلاعات موصول کریں یہ پروفائل میں سیٹ کریں</p>
          </div>
          <a href="/profile" className="btn-primary ml-auto text-sm py-1.5 px-3">سیٹ کریں</a>
        </div>
      </div>
    </div>
  );
}
