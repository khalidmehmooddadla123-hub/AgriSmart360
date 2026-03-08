import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Wind, Droplets, Umbrella, Search, Thermometer, Eye } from 'lucide-react';
import { fetchWeather, fetchWeatherForecast, fetchHourlyForecast, type ForecastDay, type HourlyPoint } from '../lib/api';
import type { WeatherData } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import i18n from '../lib/i18n';

const defaultCities = ['Lahore', 'Karachi', 'Islamabad', 'Faisalabad', 'Multan', 'Peshawar', 'Quetta'];

function getWeatherEmoji(icon: string): string {
  if (icon.startsWith('01')) return '☀️';
  if (icon.startsWith('02')) return '🌤️';
  if (icon.startsWith('03') || icon.startsWith('04')) return '☁️';
  if (icon.startsWith('09') || icon.startsWith('10')) return '🌧️';
  if (icon.startsWith('11')) return '⛈️';
  if (icon.startsWith('13')) return '❄️';
  if (icon.startsWith('50')) return '🌫️';
  return '🌤️';
}

export default function Weather() {
  const { t } = useTranslation();
  const isUrdu = i18n.language === 'ur';
  const [city, setCity] = useState('Lahore');
  const [searchInput, setSearchInput] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [hourly, setHourly] = useState<HourlyPoint[]>([]);
  const [loading, setLoading] = useState(false);

  const loadWeather = async (c: string) => {
    setLoading(true);
    const [current, forecastData, hourlyData] = await Promise.all([
      fetchWeather(c),
      fetchWeatherForecast(c),
      fetchHourlyForecast(c),
    ]);
    setWeather(current);
    setForecast(forecastData);
    setHourly(hourlyData);
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
    if (temp >= 38) return 'from-red-500 to-orange-600';
    if (temp >= 30) return 'from-orange-400 to-amber-500';
    if (temp >= 20) return 'from-sky-400 to-blue-500';
    return 'from-blue-400 to-indigo-500';
  };

  const agricultureTips = isUrdu ? [
    'گندم کی بوائی کے لیے 15-20°C درجہ حرارت بہترین ہے',
    'کپاس کو 25-35°C درجہ حرارت کی ضرورت ہے',
    'بارش سے پہلے فصل کٹائی مکمل کریں',
    'تیز ہوا میں کیڑے مار دوائیں چھڑکنے سے گریز کریں',
    'کھاد ڈالنے کے بعد ہلکی آبپاشی ضروری ہے',
  ] : [
    'Optimal temperature for wheat sowing: 15–20°C',
    'Cotton requires 25–35°C for best growth',
    'Complete harvesting before expected rain',
    'Avoid spraying pesticides in strong winds',
    'Light irrigation is recommended after fertilizer application',
  ];

  return (
    <div className="space-y-6">
      {/* ─── Header ─── */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t('weather')}</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {isUrdu ? 'زرعی موسمی معلومات اور سپرے سفارشات' : 'Agricultural weather info & spray recommendations'}
        </p>
      </div>

      {/* ─── Search & City Selector ─── */}
      <div className="card space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder={isUrdu ? 'شہر تلاش کریں...' : 'Search city... (e.g. Lahore)'}
            className="input-field flex-1"
          />
          <button onClick={handleSearch} className="btn-primary px-4 flex items-center gap-1.5">
            <Search size={16} />
            {isUrdu ? 'تلاش' : 'Search'}
          </button>
        </div>
        <div className="flex gap-2 flex-wrap">
          {defaultCities.map(c => (
            <button
              key={c}
              onClick={() => setCity(c)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${city === c ? 'bg-primary text-white shadow-sm' : 'bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-primary hover:text-primary'}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Main Weather Card ─── */}
      {loading ? (
        <div className="card flex items-center justify-center h-44">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent mx-auto mb-3" />
            <p className="text-sm text-gray-500">{isUrdu ? 'موسمی ڈیٹا لوڈ ہو رہا ہے...' : 'Loading weather data...'}</p>
          </div>
        </div>
      ) : weather && (
        <div className={`rounded-2xl bg-gradient-to-br ${getWeatherBg(weather.temperature)} p-6 text-white shadow-lg`}>
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold">{weather.city}</h2>
              <p className="text-base opacity-90 capitalize mt-0.5">{weather.description}</p>
              <p className="text-sm opacity-70 mt-1">
                {isUrdu ? 'محسوس ہوتا ہے' : 'Feels like'}: {weather.feelsLike}°C
              </p>
            </div>
            <div className="text-right">
              <p className="text-7xl font-bold leading-none">{weather.temperature}°</p>
              <p className="text-sm opacity-70 mt-1">
                {isUrdu ? 'ابھی' : 'Current'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            <WeatherStat icon={<Droplets size={18} />} label={t('humidity')} value={`${weather.humidity}%`} />
            <WeatherStat icon={<Wind size={18} />} label={t('windSpeed')} value={`${weather.windSpeed} km/h`} />
            <WeatherStat icon={<Umbrella size={18} />} label={t('rainProbability')} value={`${weather.rainProbability}%`} />
            <WeatherStat icon={<Thermometer size={18} />} label={isUrdu ? 'محسوس' : 'Feels Like'} value={`${weather.feelsLike}°C`} />
          </div>
        </div>
      )}

      {/* ─── Spray Recommendation ─── */}
      {weather && (
        <div className={`card border-l-4 ${weather.rainProbability > 50 ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-green-500 bg-green-50 dark:bg-green-900/10'}`}>
          <div className="flex items-start gap-3">
            <span className="text-2xl">{weather.rainProbability > 50 ? '⚠️' : '✅'}</span>
            <div>
              <h3 className="font-bold text-gray-800 dark:text-gray-100">
                {isUrdu ? 'سپرے کی سفارش' : 'Spray Recommendation'}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mt-1">
                {weather.sprayRecommendation}
              </p>
              {weather.rainProbability > 50 && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                  {isUrdu ? 'بارش کے بعد 24 گھنٹے انتظار کریں' : 'Wait 24 hours after rain before spraying'}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── 7-Day Forecast ─── */}
      {forecast.length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-800 dark:text-gray-100">
              {isUrdu ? `${forecast.length} روزہ پیش گوئی` : `${forecast.length}-Day Forecast`}
            </h2>
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Eye size={12} />
              {isUrdu ? 'اوپن ویدر' : 'OpenWeather'}
            </span>
          </div>
          <div className={`grid gap-2 ${forecast.length <= 5 ? 'grid-cols-5' : 'grid-cols-7'}`}>
            {forecast.map((day, i) => (
              <div key={i} className="text-center p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <p className="text-xs text-gray-500 font-medium mb-1.5">
                  {isUrdu ? day.dayUrdu : day.day}
                </p>
                <span className="text-2xl block mb-1.5">{getWeatherEmoji(day.icon)}</span>
                <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm">{day.temp}°</p>
                <p className="text-xs text-gray-400">{day.tempMin}°</p>
                <p className="text-xs text-blue-500 mt-0.5">{day.rain}%</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── Hourly Temperature Chart ─── */}
      {hourly.length > 0 && (
        <div className="card">
          <h2 className="font-bold text-gray-800 dark:text-gray-100 mb-4">
            {isUrdu ? 'آج کا درجہ حرارت (وقت کے مطابق)' : 'Temperature Throughout the Day'}
          </h2>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={hourly}>
              <defs>
                <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4FC3F7" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#4FC3F7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="time" tick={{ fontSize: 11 }} />
              <YAxis domain={['auto', 'auto']} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => `${v}°C`} />
              <Area type="monotone" dataKey="temp" name={isUrdu ? 'درجہ حرارت' : 'Temperature'} stroke="#4FC3F7" fill="url(#tempGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* ─── Agriculture Tips ─── */}
      <div className="card">
        <h2 className="font-bold text-gray-800 dark:text-gray-100 mb-4">
          🌾 {isUrdu ? 'زرعی موسمی مشورے' : 'Agricultural Weather Advice'}
        </h2>
        <ul className="space-y-2.5">
          {agricultureTips.map((tip, i) => (
            <li key={i} className="flex items-start gap-3 text-sm">
              <span className="w-5 h-5 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{i + 1}</span>
              <span className="text-gray-700 dark:text-gray-300">{tip}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function WeatherStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-1 bg-white/10 rounded-xl p-2.5">
      <div className="opacity-80">{icon}</div>
      <p className="text-xs opacity-75 text-center">{label}</p>
      <p className="font-bold text-base">{value}</p>
    </div>
  );
}

