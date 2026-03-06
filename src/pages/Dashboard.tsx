import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { TrendingUp, TrendingDown, CloudSun, Bell } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { PAKISTAN_CROPS, GLOBAL_CROPS } from '../lib/api';

const priceHistory = [
  { month: 'Oct', wheat: 3600, rice: 7200, cotton: 7800 },
  { month: 'Nov', wheat: 3650, rice: 7300, cotton: 7900 },
  { month: 'Dec', wheat: 3700, rice: 7450, cotton: 8000 },
  { month: 'Jan', wheat: 3720, rice: 7400, cotton: 8100 },
  { month: 'Feb', wheat: 3750, rice: 7500, cotton: 8100 },
  { month: 'Mar', wheat: 3800, rice: 7500, cotton: 8200 },
];

const weeklyData = [
  { day: 'Mon', price: 3750 },
  { day: 'Tue', price: 3760 },
  { day: 'Wed', price: 3780 },
  { day: 'Thu', price: 3770 },
  { day: 'Fri', price: 3790 },
  { day: 'Sat', price: 3800 },
  { day: 'Sun', price: 3800 },
];

export default function Dashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'local' | 'global'>('local');

  const crops = activeTab === 'local' ? PAKISTAN_CROPS.slice(0, 6) : GLOBAL_CROPS;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary-800 to-primary-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              {t('welcomeBack')}, {user?.name || 'کسان'} 👋
            </h1>
            <p className="font-urdu mt-1 opacity-90 text-lg">
              AgriSmart 360 میں خوش آمدید — آج کی تازہ ترین زرعی معلومات
            </p>
          </div>
          <div className="hidden sm:block text-6xl opacity-20">🌾</div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<TrendingUp className="text-green-600" size={22} />}
          label="گندم قیمت"
          value="₨3,800"
          change="+1.3%"
          positive
          bg="bg-green-50 dark:bg-green-900/20"
        />
        <StatCard
          icon={<TrendingDown className="text-red-500" size={22} />}
          label="چاول قیمت"
          value="₨7,500"
          change="-1.3%"
          positive={false}
          bg="bg-red-50 dark:bg-red-900/20"
        />
        <StatCard
          icon={<CloudSun className="text-sky dark:text-sky-300" size={22} />}
          label="درجہ حرارت"
          value="28°C"
          change="لاہور"
          positive
          bg="bg-sky-50 dark:bg-sky-900/20"
        />
        <StatCard
          icon={<Bell className="text-amber-500" size={22} />}
          label="نئی اطلاعات"
          value="3"
          change="آج"
          positive
          bg="bg-amber-50 dark:bg-amber-900/20"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Price Trend */}
        <div className="card">
          <h2 className="font-bold text-gray-800 dark:text-gray-100 mb-4">
            فصل قیمتوں کا رجحان (6 مہینے)
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={priceHistory}>
              <defs>
                <linearGradient id="wheatGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2E7D32" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#2E7D32" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="riceGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4FC3F7" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#4FC3F7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => `₨${v}`} />
              <Legend />
              <Area type="monotone" dataKey="wheat" name="گندم" stroke="#2E7D32" fill="url(#wheatGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="rice" name="چاول" stroke="#4FC3F7" fill="url(#riceGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="cotton" name="کپاس" stroke="#6D4C41" fill="none" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly Wheat Price */}
        <div className="card">
          <h2 className="font-bold text-gray-800 dark:text-gray-100 mb-4">
            اس ہفتے گندم کی قیمت (روپے/من)
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} />
              <YAxis domain={[3700, 3820]} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => `₨${v}`} />
              <Line type="monotone" dataKey="price" name="قیمت" stroke="#2E7D32" strokeWidth={2.5} dot={{ fill: '#2E7D32', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Current Prices */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-800 dark:text-gray-100">آج کی منڈی قیمتیں</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('local')}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${activeTab === 'local' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}
            >
              🇵🇰 پاکستان
            </button>
            <button
              onClick={() => setActiveTab('global')}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${activeTab === 'global' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}
            >
              🌍 عالمی
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-right pb-2 text-gray-500 dark:text-gray-400 font-medium">فصل</th>
                <th className="text-right pb-2 text-gray-500 dark:text-gray-400 font-medium">قیمت</th>
                <th className="text-right pb-2 text-gray-500 dark:text-gray-400 font-medium">تبدیلی</th>
                <th className="text-right pb-2 text-gray-500 dark:text-gray-400 font-medium">منڈی</th>
              </tr>
            </thead>
            <tbody>
              {crops.map(crop => (
                <tr key={crop.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="py-2.5 font-urdu text-gray-800 dark:text-gray-100">{crop.nameUrdu}</td>
                  <td className="py-2.5 font-mono text-gray-800 dark:text-gray-100">
                    {activeTab === 'local' ? '₨' : '$'}{crop.price}
                    <span className="text-xs text-gray-400 ml-1">/{crop.unit}</span>
                  </td>
                  <td className={`py-2.5 font-medium ${crop.change >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {crop.change >= 0 ? '+' : ''}{crop.changePercent.toFixed(1)}%
                  </td>
                  <td className="py-2.5 text-gray-500 dark:text-gray-400 text-xs">{crop.market}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="card">
          <h2 className="font-bold text-gray-800 dark:text-gray-100 mb-4">فوری اقدامات</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: '🌾', label: 'قیمت چیک کریں', path: '/prices' },
              { icon: '🌤️', label: 'موسم دیکھیں', path: '/weather' },
              { icon: '🛒', label: 'فصل بیچیں', path: '/marketplace' },
              { icon: '🤖', label: 'AI سے پوچھیں', path: '/chat' },
              { icon: '🔬', label: 'بیماری پہچانیں', path: '/disease' },
              { icon: '📢', label: 'اشتہار دیں', path: '/land' },
            ].map(action => (
              <a
                key={action.path}
                href={action.path}
                className="flex items-center gap-2 p-3 rounded-xl bg-primary-50 dark:bg-primary-900/30 hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors"
              >
                <span className="text-xl">{action.icon}</span>
                <span className="text-sm font-urdu text-primary-700 dark:text-primary-300">{action.label}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Monthly Sales Chart */}
        <div className="card">
          <h2 className="font-bold text-gray-800 dark:text-gray-100 mb-4">ماہانہ فروخت (ہزار روپے)</h2>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={[
              { month: 'Oct', sales: 45 },
              { month: 'Nov', sales: 52 },
              { month: 'Dec', sales: 48 },
              { month: 'Jan', sales: 61 },
              { month: 'Feb', sales: 55 },
              { month: 'Mar', sales: 70 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => `₨${v}K`} />
              <Bar dataKey="sales" name="فروخت" fill="#2E7D32" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon, label, value, change, positive, bg
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  change: string;
  positive: boolean;
  bg: string;
}) {
  return (
    <div className={`card p-4 ${bg}`}>
      <div className="flex items-start justify-between">
        <div className={`p-2 rounded-lg bg-white dark:bg-gray-800`}>{icon}</div>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${positive ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' : 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400'}`}>
          {change}
        </span>
      </div>
      <p className="mt-3 text-2xl font-bold text-gray-800 dark:text-gray-100">{value}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400 font-urdu mt-0.5">{label}</p>
    </div>
  );
}
