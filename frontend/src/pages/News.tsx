import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AGRICULTURE_NEWS } from '../lib/api';
import type { NewsItem } from '../types';
import { ExternalLink, Calendar } from 'lucide-react';

const CATEGORIES = ['all', 'policy', 'subsidy', 'scheme', 'water', 'general'];

const CATEGORY_LABELS: Record<string, string> = {
  all: 'سب خبریں',
  policy: 'پالیسی',
  subsidy: 'سبسڈی',
  scheme: 'اسکیم',
  water: 'آبی پالیسی',
  general: 'عمومی',
};

const CATEGORY_COLORS: Record<string, string> = {
  policy: 'bg-blue-100 text-blue-700',
  subsidy: 'bg-green-100 text-green-700',
  scheme: 'bg-purple-100 text-purple-700',
  water: 'bg-cyan-100 text-cyan-700',
  general: 'bg-gray-100 text-gray-700',
};

export default function News() {
  const { t } = useTranslation();
  const [category, setCategory] = useState('all');
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  const filtered = AGRICULTURE_NEWS.filter(
    n => category === 'all' || n.category === category
  );

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('ur-PK', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t('news')}</h1>
        <p className="text-sm text-gray-500 font-urdu mt-0.5">حکومتی پالیسیاں، سبسڈیاں اور زرعی اسکیمیں</p>
      </div>

      {/* Featured News */}
      {filtered[0] && (
        <div
          className="relative rounded-2xl overflow-hidden cursor-pointer h-64"
          onClick={() => setSelectedNews(filtered[0])}
        >
          <img src={filtered[0].imageUrl} alt={filtered[0].title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
            <span className={`text-xs px-2 py-0.5 rounded-full mb-2 inline-block ${CATEGORY_COLORS[filtered[0].category]}`}>
              {CATEGORY_LABELS[filtered[0].category]}
            </span>
            <h2 className="font-bold text-xl font-urdu">{filtered[0].titleUrdu}</h2>
            <div className="flex items-center gap-1 text-white/70 text-xs mt-1">
              <Calendar size={12} />
              <span>{formatDate(filtered[0].publishedAt)}</span>
              <span>•</span>
              <span>{filtered[0].source}</span>
            </div>
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap font-urdu transition-colors ${category === cat ? 'bg-primary text-white' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300'}`}
          >
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* News Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filtered.slice(1).map(news => (
          <NewsCard
            key={news.id}
            news={news}
            onClick={() => setSelectedNews(news)}
            formatDate={formatDate}
          />
        ))}
      </div>

      {/* News Detail Modal */}
      {selectedNews && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {selectedNews.imageUrl && (
              <img src={selectedNews.imageUrl} alt={selectedNews.title} className="w-full h-52 object-cover rounded-t-2xl" />
            )}
            <div className="p-5 space-y-3">
              <span className={`text-xs px-2 py-0.5 rounded-full ${CATEGORY_COLORS[selectedNews.category]}`}>
                {CATEGORY_LABELS[selectedNews.category]}
              </span>
              <h2 className="text-xl font-bold font-urdu text-gray-800 dark:text-gray-100">{selectedNews.titleUrdu || selectedNews.title}</h2>
              <div className="flex items-center gap-1 text-gray-500 text-xs">
                <Calendar size={12} />
                <span>{formatDate(selectedNews.publishedAt)}</span>
                <span>•</span>
                <span>{selectedNews.source}</span>
              </div>
              <p className="font-urdu text-gray-700 dark:text-gray-300 leading-relaxed">
                {selectedNews.summaryUrdu || selectedNews.summary}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {selectedNews.summary}
              </p>
              <div className="flex gap-2 pt-2">
                {selectedNews.url && (
                  <a href={selectedNews.url} target="_blank" rel="noopener noreferrer" className="btn-primary flex items-center gap-2 flex-1 justify-center">
                    <ExternalLink size={15} />
                    مزید پڑھیں
                  </a>
                )}
                <button onClick={() => setSelectedNews(null)} className="btn-secondary flex-1">بند کریں</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function NewsCard({ news, onClick, formatDate }: { news: NewsItem; onClick: () => void; formatDate: (d: string) => string }) {
  return (
    <div onClick={onClick} className="card p-0 overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
      {news.imageUrl && (
        <img src={news.imageUrl} alt={news.title} className="w-full h-40 object-cover" />
      )}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className={`text-xs px-2 py-0.5 rounded-full ${CATEGORY_COLORS[news.category]}`}>
            {CATEGORY_LABELS[news.category]}
          </span>
        </div>
        <h3 className="font-bold font-urdu text-gray-800 dark:text-gray-100 line-clamp-2">{news.titleUrdu || news.title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2 font-urdu">{news.summaryUrdu || news.summary}</p>
        <div className="flex items-center gap-1 text-gray-400 text-xs mt-2">
          <Calendar size={11} />
          <span>{formatDate(news.publishedAt)}</span>
          <span>•</span>
          <span className="truncate">{news.source}</span>
        </div>
      </div>
    </div>
  );
}
