import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, Bell, Sun, Moon, LogOut, ChevronDown, Globe } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useNotifications } from '../../hooks/useNotifications';
import { LANGUAGES } from '../../lib/i18n';
import i18n from '../../lib/i18n';
import { Link } from 'react-router-dom';

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const { t } = useTranslation();
  const { user, signOut } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { unreadCount } = useNotifications();
  const [langOpen, setLangOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  const currentLang = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0];

  const handleLangChange = (code: string, dir: string) => {
    i18n.changeLanguage(code);
    localStorage.setItem('agrismart_lang', code);
    document.documentElement.dir = dir;
    document.documentElement.lang = code;
    setLangOpen(false);
  };

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left: Hamburger + Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden text-gray-600 dark:text-gray-300 hover:text-primary"
          >
            <Menu size={22} />
          </button>
          <div className="hidden lg:block">
            <span className="text-lg font-bold text-primary">AgriSmart 360</span>
          </div>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-2">
          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Globe size={16} />
              <span className="hidden sm:inline">{currentLang.name}</span>
              <ChevronDown size={14} />
            </button>
            {langOpen && (
              <div className="absolute right-0 mt-1 w-44 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50 max-h-72 overflow-y-auto">
                {LANGUAGES.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => handleLangChange(lang.code, lang.dir)}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-primary-50 dark:hover:bg-primary-900 hover:text-primary transition-colors
                      ${lang.code === i18n.language ? 'text-primary font-semibold bg-primary-50 dark:bg-primary-900' : 'text-gray-700 dark:text-gray-200'}`}
                    dir={lang.dir}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Notifications */}
          <Link
            to="/notifications"
            className="relative p-1.5 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </Link>

          {/* User Menu */}
          {user && (
            <div className="relative">
              <button
                onClick={() => setUserOpen(!userOpen)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {user.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <span className="hidden sm:inline text-sm text-gray-700 dark:text-gray-200 max-w-24 truncate">
                  {user.name}
                </span>
                <ChevronDown size={14} className="text-gray-500" />
              </button>
              {userOpen && (
                <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{user.name}</p>
                    <p className="text-xs text-gray-500">{t(user.role)}</p>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setUserOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    {t('profile')}
                  </Link>
                  <button
                    onClick={() => { signOut(); setUserOpen(false); }}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 w-full"
                  >
                    <LogOut size={15} />
                    {t('logout')}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
