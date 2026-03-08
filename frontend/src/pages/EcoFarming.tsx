import { useTranslation } from 'react-i18next';
import { ECO_TIPS } from '../lib/api';

const CATEGORY_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  water: { label: 'پانی بچاؤ', color: 'text-blue-700', bg: 'bg-blue-50 dark:bg-blue-900/20' },
  soil: { label: 'مٹی کی حفاظت', color: 'text-earth', bg: 'bg-amber-50 dark:bg-amber-900/20' },
  pest: { label: 'کیڑا انتظام', color: 'text-green-700', bg: 'bg-green-50 dark:bg-green-900/20' },
  energy: { label: 'توانائی', color: 'text-yellow-700', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
};

const ECO_STATS = [
  { icon: '💧', value: '60%', label: 'پانی بچت ڈرپ آبپاشی سے', color: 'text-blue-600' },
  { icon: '🌱', value: '30%', label: 'زیادہ پیداوار نامیاتی کھاد سے', color: 'text-green-600' },
  { icon: '☀️', value: '80%', label: 'کم لاگت شمسی پمپ سے', color: 'text-yellow-600' },
  { icon: '🌍', value: '40%', label: 'کم کاربن ماحول دوست طریقوں سے', color: 'text-teal-600' },
];

export default function EcoFarming() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-700 to-teal-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold">{t('eco')}</h1>
        <p className="font-urdu mt-1 opacity-90 text-lg">پاکستان کی زمین، پانی اور مستقبل کی حفاظت کریں</p>
        <p className="text-sm opacity-70 mt-1">Sustainable & Eco-Friendly Farming Practices</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {ECO_STATS.map((stat, i) => (
          <div key={i} className="card text-center">
            <span className="text-3xl block mb-2">{stat.icon}</span>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-gray-500 font-urdu mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Tips Grid */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">ماحول دوست زراعت کے طریقے</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ECO_TIPS.map(tip => {
            const cfg = CATEGORY_CONFIG[tip.category];
            return (
              <div key={tip.id} className={`card hover:shadow-lg transition-shadow ${cfg?.bg || 'bg-gray-50'}`}>
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-3xl">{tip.icon}</span>
                  <div>
                    <span className={`text-xs font-medium ${cfg?.color || 'text-gray-600'}`}>{cfg?.label || tip.category}</span>
                    <h3 className="font-bold text-gray-800 dark:text-gray-100 font-urdu">{tip.titleUrdu}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{tip.title}</p>
                  </div>
                </div>
                <p className="text-sm font-urdu text-gray-700 dark:text-gray-300 leading-relaxed">{tip.descriptionUrdu}</p>
                <p className="text-xs text-gray-500 mt-2 leading-relaxed">{tip.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Eco Certifications Section */}
      <div className="card">
        <h2 className="font-bold text-gray-800 dark:text-gray-100 mb-4">🏅 ماحول دوست زراعت سرٹیفیکیشن</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              title: 'نامیاتی کاشتکاری سرٹیفکیٹ',
              titleUrdu: 'Organic Farming Certificate',
              desc: 'سندھ فوڈ اتھارٹی سے نامیاتی کاشتکاری کا سرٹیفکیٹ حاصل کریں اور زیادہ قیمت پائیں',
              icon: '🌿',
            },
            {
              title: 'پانی بچاؤ اسکیم',
              titleUrdu: 'Water Conservation Scheme',
              desc: 'IRSA اسکیم کے تحت ڈرپ آبپاشی لگائیں اور 60% تک سبسڈی حاصل کریں',
              icon: '💧',
            },
          ].map((cert, i) => (
            <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{cert.icon}</span>
                <div>
                  <h3 className="font-bold font-urdu text-gray-800 dark:text-gray-100">{cert.title}</h3>
                  <p className="text-xs text-gray-400">{cert.titleUrdu}</p>
                </div>
              </div>
              <p className="text-sm font-urdu text-gray-600 dark:text-gray-400">{cert.desc}</p>
              <button className="btn-secondary mt-3 text-sm py-1.5 w-full">مزید معلومات</button>
            </div>
          ))}
        </div>
      </div>

      {/* Seasonal Calendar */}
      <div className="card">
        <h2 className="font-bold text-gray-800 dark:text-gray-100 mb-4">📅 فصل کا ماحول دوست کیلنڈر</h2>
        <div className="space-y-3">
          {[
            { season: 'خریف (جولائی - نومبر)', crops: 'چاول، کپاس، مکئی، گنا', tip: 'کیڑوں کی روک تھام کے لیے IPM استعمال کریں', icon: '☀️' },
            { season: 'ربیع (اکتوبر - اپریل)', crops: 'گندم، سرسوں، چنا، مسور', tip: 'ہرے کھاد کے لیے دالیں اگائیں', icon: '❄️' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <span className="text-2xl">{item.icon}</span>
              <div>
                <h3 className="font-bold font-urdu text-gray-800 dark:text-gray-100">{item.season}</h3>
                <p className="text-sm font-urdu text-gray-600 dark:text-gray-400">فصلیں: {item.crops}</p>
                <p className="text-xs text-green-600 dark:text-green-400 font-urdu mt-1">💡 {item.tip}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
