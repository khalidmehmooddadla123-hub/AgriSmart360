import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard, TrendingUp, CloudSun, ShoppingBag, Leaf,
  Newspaper, MapPin, MessageCircle, User, History,
  HeartHandshake, BrainCircuit, Bell, X
} from 'lucide-react';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const navItems = [
  { key: 'dashboard', path: '/app', icon: LayoutDashboard },
  { key: 'prices', path: '/app/prices', icon: TrendingUp },
  { key: 'weather', path: '/app/weather', icon: CloudSun },
  { key: 'marketplace', path: '/app/marketplace', icon: ShoppingBag },
  { key: 'disease', path: '/app/disease', icon: Leaf },
  { key: 'news', path: '/app/news', icon: Newspaper },
  { key: 'land', path: '/app/land', icon: MapPin },
  { key: 'advisory', path: '/app/advisory', icon: BrainCircuit },
  { key: 'eco', path: '/app/eco', icon: HeartHandshake },
  { key: 'chat', path: '/app/chat', icon: MessageCircle },
  { key: 'notifications', path: '/app/notifications', icon: Bell },
  { key: 'history', path: '/app/history', icon: History },
  { key: 'complaint', path: '/app/complaint', icon: MessageCircle },
  { key: 'profile', path: '/app/profile', icon: User },
];

export default function Sidebar({ open, onClose }: SidebarProps) {
  const { t } = useTranslation();
  const isRTL = document.documentElement.dir === 'rtl';

  return (
    <>
      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar – positioned on start edge (right in RTL, left in LTR) */}
      <aside
        className={`fixed top-0 h-full w-64 bg-white dark:bg-gray-900 shadow-xl z-30 transform transition-transform duration-300
          ${isRTL ? 'right-0' : 'left-0'}
          ${open
            ? 'translate-x-0'
            : isRTL ? 'translate-x-full' : '-translate-x-full'
          }
          lg:translate-x-0 lg:static lg:shadow-none lg:z-auto`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white text-lg">🌱</span>
            </div>
            <div>
              <h1 className="font-bold text-primary text-sm">AgriSmart 360</h1>
              <p className="text-xs text-gray-500 font-urdu">ڈیجیٹل زراعت</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1 overflow-y-auto h-[calc(100%-73px)]">
          {navItems.map(({ key, path, icon: Icon }) => (
            <NavLink
              key={key}
              to={path}
              end={path === '/app'}
              onClick={() => onClose()}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <Icon size={18} />
              <span className="text-sm">{t(key)}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
