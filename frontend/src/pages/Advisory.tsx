import { useTranslation } from 'react-i18next';
import { PAKISTAN_CROPS } from '../lib/api';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';

const CROP_DEMAND = [
  { crop: 'گندم', demand: 90, supply: 75, profitability: 80 },
  { crop: 'چاول', demand: 85, supply: 70, profitability: 85 },
  { crop: 'کپاس', demand: 70, supply: 80, profitability: 75 },
  { crop: 'مکئی', demand: 80, supply: 60, profitability: 85 },
  { crop: 'سرسوں', demand: 75, supply: 55, profitability: 80 },
];

// Static price predictions (in production: use ML model or time series API)
const PRICE_PREDICTIONS: Record<string, { trend: 'up' | 'down'; percent: string }> = {
  '1': { trend: 'up', percent: '3.2' },
  '2': { trend: 'down', percent: '1.8' },
  '3': { trend: 'up', percent: '5.5' },
  '4': { trend: 'up', percent: '2.1' },
};

const SEASON_RECOMMENDATIONS = [
  {
    season: 'ربیع (موجودہ)',
    recommended: ['گندم', 'سرسوں', 'چنا', 'مسور'],
    reason: 'سردی کا موسم، پانی کم درکار، اچھی قیمت متوقع',
    profit: '₨45,000–₨80,000 فی ایکڑ',
    icon: '❄️',
  },
  {
    season: 'خریف (اگلا)',
    recommended: ['چاول', 'کپاس', 'مکئی', 'گنا'],
    reason: 'گرم موسم، مانسون بارشیں، زیادہ پیداوار',
    profit: '₨60,000–₨120,000 فی ایکڑ',
    icon: '☀️',
  },
];

const FERTILIZER_SCHEDULE = [
  { crop: 'گندم', dap: '1 بیگ/ایکڑ', urea: '2 بیگ/ایکڑ', timing: 'بوائی پر + 25 دن بعد' },
  { crop: 'چاول', dap: '1.5 بیگ/ایکڑ', urea: '3 بیگ/ایکڑ', timing: 'پنیری + کھلی کھیتی' },
  { crop: 'کپاس', dap: '1 بیگ/ایکڑ', urea: '2.5 بیگ/ایکڑ', timing: 'بوائی + 30 + 60 دن' },
];

export default function Advisory() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t('advisory')}</h1>
        <p className="text-sm text-gray-500 font-urdu mt-0.5">بہترین فصل، کھاد اور پیداوار کے مشورے</p>
      </div>

      {/* Season Recommendations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {SEASON_RECOMMENDATIONS.map((rec, i) => (
          <div key={i} className={`card border-t-4 ${i === 0 ? 'border-blue-400' : 'border-orange-400'}`}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">{rec.icon}</span>
              <h3 className="font-bold font-urdu text-gray-800 dark:text-gray-100">{rec.season}</h3>
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              {rec.recommended.map(crop => (
                <span key={crop} className="px-2 py-1 bg-primary-50 dark:bg-primary-900/30 text-primary text-sm rounded-lg font-urdu">
                  {crop}
                </span>
              ))}
            </div>
            <p className="text-sm font-urdu text-gray-600 dark:text-gray-400">{rec.reason}</p>
            <div className="mt-3 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-xs text-green-700 dark:text-green-400 font-urdu">💰 متوقع آمدنی: {rec.profit}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Demand Analysis Chart */}
      <div className="card">
        <h2 className="font-bold text-gray-800 dark:text-gray-100 mb-4">📊 فصل مانگ و منافع تجزیہ</h2>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={CROP_DEMAND}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="crop" tick={{ fontSize: 11 }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="demand" name="مانگ" fill="#2E7D32" radius={[4, 4, 0, 0]} />
            <Bar dataKey="profitability" name="منافع" fill="#4FC3F7" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Fertilizer Schedule */}
      <div className="card">
        <h2 className="font-bold text-gray-800 dark:text-gray-100 mb-4">🌿 کھاد کا شیڈول</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-right pb-2 text-gray-500 font-medium">فصل</th>
                <th className="text-right pb-2 text-gray-500 font-medium">DAP</th>
                <th className="text-right pb-2 text-gray-500 font-medium">یوریا</th>
                <th className="text-right pb-2 text-gray-500 font-medium">وقت</th>
              </tr>
            </thead>
            <tbody>
              {FERTILIZER_SCHEDULE.map((row, i) => (
                <tr key={i} className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-3 font-urdu font-semibold text-gray-800 dark:text-gray-100">{row.crop}</td>
                  <td className="py-3 text-gray-600 dark:text-gray-400">{row.dap}</td>
                  <td className="py-3 text-gray-600 dark:text-gray-400">{row.urea}</td>
                  <td className="py-3 font-urdu text-gray-500 text-xs">{row.timing}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pest Warning */}
      <div className="card border-l-4 border-amber-500 bg-amber-50 dark:bg-amber-900/10">
        <h2 className="font-bold text-amber-700 dark:text-amber-400 mb-3 font-urdu">⚠️ آج کے کیڑا انتباہ</h2>
        <div className="space-y-2">
          {[
            { crop: 'گندم', pest: 'کنگی (Yellow Rust)', area: 'پنجاب', severity: 'medium' },
            { crop: 'کپاس', pest: 'سفید مکھی', area: 'ملتان ریجن', severity: 'high' },
          ].map((warn, i) => (
            <div key={i} className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg p-3">
              <div>
                <span className="font-urdu font-semibold text-gray-800 dark:text-gray-100">{warn.crop}</span>
                <span className="text-gray-400 mx-2">—</span>
                <span className="font-urdu text-sm text-red-600">{warn.pest}</span>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">{warn.area}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full ${warn.severity === 'high' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                  {warn.severity === 'high' ? 'شدید' : 'درمیانی'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Market Prediction */}
      <div className="card">
        <h2 className="font-bold text-gray-800 dark:text-gray-100 mb-4">🔮 قیمت کی پیش گوئی (اگلے 3 ماہ)</h2>
        <div className="space-y-3">
          {PAKISTAN_CROPS.slice(0, 4).map(crop => {
            const prediction = PRICE_PREDICTIONS[crop.id] || { trend: 'up' as const, percent: '2.0' };
            return (
              <div key={crop.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <span className="font-urdu font-semibold text-gray-800 dark:text-gray-100">{crop.nameUrdu}</span>
                <div className="text-right">
                  <p className="font-mono text-gray-700 dark:text-gray-200">₨{crop.price}</p>
                  <p className={`text-sm font-medium ${prediction.trend === 'up' ? 'text-green-600' : 'text-red-500'}`}>
                    {prediction.trend === 'up' ? `+${prediction.percent}% ↑` : `-${prediction.percent}% ↓`}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
