import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Wind, Droplets, Umbrella, Search } from 'lucide-react';
import { fetchWeather } from '../lib/api';
import type { WeatherData } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const defaultCities = ['Lahore', 'Karachi', 'Islamabad', 'Faisalabad', 'Multan', 'Peshawar', 'Quetta'];

const weekForecast = [
  { day: 'آج', temp: 28, rain: 10, icon: '☀️' },
  { day: 'کل', temp: 25, rain: 60, icon: '🌧️' },
  { day: 'جمعرات', temp: 24, rain: 40, icon: '⛅' },
  { day: 'جمعہ', temp: 27, rain: 15, icon: '☀️' },
  { day: 'ہفتہ', temp: 29, rain: 5, icon: '☀️' },
  { day: 'اتوار', temp: 26, rain: 30, icon: '⛅' },
  { day: 'پیر', temp: 23, rain: 70, icon: '🌦️' },
];

const hourlyTemp = [
  { time: '6AM', temp: 22 }, { time: '9AM', temp: 25 }, { time: '12PM', temp: 28 },
  { time: '3PM', temp: 31 }, { time: '6PM', temp: 29 }, { time: '9PM', temp: 24 },
];

export default function Weather() {
  const { t } = useTranslation();
  const [city, setCity] = useState('Lahore');
  const [searchInput, setSearchInput] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);

  const loadWeather = async (c: string) => {
    setLoading(true);
    const data = await fetchWeather(c);
    setWeather(data);
    setLoading(false);
  };

  useEffect(() => { loadWeather(city); }, [city]);

  const handleSearch = () => {
    if (searchInput.trim()) {
      setCity(searchInput.trim());
      setSearchInput('');
    }
  };

  const getWeatherBg = (temp: number) => {
    if (temp >= 35) return 'from-orange-500 to-red-500';
    if (temp >= 25) return 'from-sky-400 to-blue-500';
    return 'from-blue-400 to-indigo-500';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t('weather')}</h1>
        <p className="text-sm text-gray-500 font-urdu mt-0.5">زرعی موسمی معلومات اور سپرے سفارشات</p>
      </div>

      {/* Search */}
      <div className="flex gap-2">
        <input
          type="text"
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
          placeholder="شہر تلاش کریں... (e.g. Lahore)"
          className="input-field flex-1"
        />
        <button onClick={handleSearch} className="btn-primary px-4">
          <Search size={18} />
        </button>
      </div>

      {/* Quick City Select */}
      <div className="flex gap-2 flex-wrap">
        {defaultCities.map(c => (
          <button
            key={c}
            onClick={() => setCity(c)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${city === c ? 'bg-primary text-white' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300'}`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Main Weather Card */}
      {loading ? (
        <div className="card flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent" />
        </div>
      ) : weather && (
        <div className={`rounded-2xl bg-gradient-to-br ${getWeatherBg(weather.temperature)} p-6 text-white`}>
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-3xl font-bold">{weather.city}</h2>
              <p className="text-lg opacity-90 capitalize">{weather.description}</p>
            </div>
            <div className="text-right">
              <p className="text-6xl font-bold">{weather.temperature}°</p>
              <p className="opacity-80">محسوس: {weather.feelsLike}°C</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6">
            <WeatherStat icon={<Droplets size={20} />} label={t('humidity')} value={`${weather.humidity}%`} />
            <WeatherStat icon={<Wind size={20} />} label={t('windSpeed')} value={`${weather.windSpeed} km/h`} />
            <WeatherStat icon={<Umbrella size={20} />} label={t('rainProbability')} value={`${weather.rainProbability}%`} />
          </div>
        </div>
      )}

      {/* Spray Recommendation */}
      {weather && (
        <div className={`card border-l-4 ${weather.rainProbability > 50 ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-green-500 bg-green-50 dark:bg-green-900/10'}`}>
          <div className="flex items-start gap-3">
            <span className="text-2xl">{weather.rainProbability > 50 ? '⚠️' : '✅'}</span>
            <div>
              <h3 className="font-bold text-gray-800 dark:text-gray-100">سپرے کی سفارش</h3>
              <p className="font-urdu text-gray-700 dark:text-gray-300 mt-1">
                {weather.sprayRecommendation}
              </p>
              {weather.rainProbability > 50 && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-1 font-urdu">
                  بارش کے بعد 24 گھنٹے انتظار کریں
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 7-Day Forecast */}
      <div className="card">
        <h2 className="font-bold text-gray-800 dark:text-gray-100 mb-4">7 روزہ پیش گوئی</h2>
        <div className="grid grid-cols-7 gap-2">
          {weekForecast.map((day, i) => (
            <div key={i} className="text-center">
              <p className="text-xs text-gray-500 font-urdu mb-1">{day.day}</p>
              <span className="text-2xl block mb-1">{day.icon}</span>
              <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm">{day.temp}°</p>
              <p className="text-xs text-blue-500">{day.rain}%</p>
            </div>
          ))}
        </div>
      </div>

      {/* Hourly Temperature Chart */}
      <div className="card">
        <h2 className="font-bold text-gray-800 dark:text-gray-100 mb-4">آج کا درجہ حرارت (وقت کے مطابق)</h2>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={hourlyTemp}>
            <defs>
              <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4FC3F7" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#4FC3F7" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" tick={{ fontSize: 11 }} />
            <YAxis domain={[15, 40]} tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v) => `${v}°C`} />
            <Area type="monotone" dataKey="temp" name="درجہ حرارت" stroke="#4FC3F7" fill="url(#tempGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Agriculture Tips */}
      <div className="card">
        <h2 className="font-bold text-gray-800 dark:text-gray-100 mb-3">🌾 زرعی موسمی مشورے</h2>
        <ul className="space-y-2">
          {[
            'گندم کی بوائی کے لیے 15-20°C درجہ حرارت بہترین ہے',
            'کپاس کو 25-35°C درجہ حرارت کی ضرورت ہے',
            'بارش سے پہلے فصل کٹائی مکمل کریں',
            'تیز ہوا میں کیڑے مار دوائیں چھڑکنے سے گریز کریں',
          ].map((tip, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <span className="text-primary mt-0.5">•</span>
              <span className="font-urdu text-gray-700 dark:text-gray-300">{tip}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function WeatherStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="opacity-80">{icon}</div>
      <p className="text-sm opacity-80">{label}</p>
      <p className="font-bold text-lg">{value}</p>
    </div>
  );
}
