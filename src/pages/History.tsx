import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Trash2, Search, History as HistoryIcon } from 'lucide-react';
import type { HistoryItem } from '../types';

const SAMPLE_HISTORY: HistoryItem[] = [
  { id: '1', userId: 'u1', type: 'price_search', data: { query: 'گندم', location: 'لاہور' }, createdAt: new Date().toISOString() },
  { id: '2', userId: 'u1', type: 'weather_check', data: { city: 'Lahore' }, createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: '3', userId: 'u1', type: 'disease_detection', data: { crop: 'Wheat', disease: 'Yellow Rust' }, createdAt: new Date(Date.now() - 7200000).toISOString() },
  { id: '4', userId: 'u1', type: 'chat_query', data: { query: 'گندم کی قیمت کب بڑھے گی؟' }, createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: '5', userId: 'u1', type: 'price_search', data: { query: 'کپاس', location: 'ملتان' }, createdAt: new Date(Date.now() - 172800000).toISOString() },
  { id: '6', userId: 'u1', type: 'weather_check', data: { city: 'Multan' }, createdAt: new Date(Date.now() - 259200000).toISOString() },
];

const TYPE_CONFIG = {
  price_search: { label: 'قیمت تلاش', icon: '💹', color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' },
  weather_check: { label: 'موسم', icon: '🌤️', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' },
  disease_detection: { label: 'بیماری تشخیص', icon: '🔬', color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' },
  chat_query: { label: 'AI سوال', icon: '🤖', color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400' },
  order: { label: 'آرڈر', icon: '📦', color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400' },
};

function getHistoryDescription(item: HistoryItem): string {
  switch (item.type) {
    case 'price_search': return `${item.data.query} کی قیمت ${item.data.location} میں تلاش کی`;
    case 'weather_check': return `${item.data.city} کا موسم چیک کیا`;
    case 'disease_detection': return `${item.data.crop} میں ${item.data.disease} تشخیص ہوئی`;
    case 'chat_query': return `"${item.data.query}"`;
    case 'order': return `آرڈر ${item.data.orderId} مکمل ہوا`;
    default: return 'سرگرمی';
  }
}

export default function History() {
  const { t } = useTranslation();
  const [history, setHistory] = useState<HistoryItem[]>(SAMPLE_HISTORY);
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  const filtered = history.filter(item => {
    const matchFilter = filter === 'all' || item.type === filter;
    const desc = getHistoryDescription(item).toLowerCase();
    const matchSearch = !search || desc.includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const deleteItem = (id: string) => {
    setHistory(prev => prev.filter(h => h.id !== id));
  };

  const clearAll = () => {
    if (confirm('کیا آپ تمام تاریخ حذف کرنا چاہتے ہیں؟')) {
      setHistory([]);
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (hours < 1) return 'ابھی ابھی';
    if (hours < 24) return `${hours} گھنٹے پہلے`;
    return `${days} دن پہلے`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t('history')}</h1>
          <p className="text-sm text-gray-500 font-urdu mt-0.5">آپ کی سرگرمیوں کی تاریخ</p>
        </div>
        {history.length > 0 && (
          <button onClick={clearAll} className="flex items-center gap-1 text-red-500 hover:text-red-700 text-sm">
            <Trash2 size={16} />
            سب حذف کریں
          </button>
        )}
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="تاریخ میں تلاش کریں..."
            className="input-field pl-9"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {['all', 'price_search', 'weather_check', 'disease_detection', 'chat_query'].map(type => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-3 py-2 rounded-lg text-xs whitespace-nowrap transition-colors ${filter === type ? 'bg-primary text-white' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300'}`}
            >
              {type === 'all' ? 'سب' : TYPE_CONFIG[type as keyof typeof TYPE_CONFIG]?.label || type}
            </button>
          ))}
        </div>
      </div>

      {/* History List */}
      {filtered.length === 0 ? (
        <div className="card text-center py-12">
          <HistoryIcon className="mx-auto text-gray-300 mb-3" size={48} />
          <p className="font-urdu text-gray-500">کوئی تاریخ نہیں</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(item => {
            const cfg = TYPE_CONFIG[item.type as keyof typeof TYPE_CONFIG];
            return (
              <div key={item.id} className="card flex items-center gap-4 p-4">
                <span className="text-2xl flex-shrink-0">{cfg?.icon || '📋'}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${cfg?.color || 'bg-gray-100 text-gray-600'}`}>
                      {cfg?.label || item.type}
                    </span>
                  </div>
                  <p className="font-urdu text-gray-700 dark:text-gray-300 text-sm mt-1 truncate">
                    {getHistoryDescription(item)}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{formatDate(item.createdAt)}</p>
                </div>
                <button
                  onClick={() => deleteItem(item.id)}
                  className="text-gray-300 hover:text-red-500 transition-colors flex-shrink-0"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
