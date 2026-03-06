import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TrendingUp, TrendingDown, RefreshCw, Globe, MapPin } from 'lucide-react';
import { PAKISTAN_CROPS, GLOBAL_CROPS, PAKISTAN_PROVINCES } from '../lib/api';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const historicalData = {
  wheat: [
    { date: 'Jan', price: 3600 }, { date: 'Feb', price: 3650 }, { date: 'Mar', price: 3800 },
    { date: 'Apr', price: 3750 }, { date: 'May', price: 3700 }, { date: 'Jun', price: 3720 },
  ],
  rice: [
    { date: 'Jan', price: 7200 }, { date: 'Feb', price: 7300 }, { date: 'Mar', price: 7500 },
    { date: 'Apr', price: 7450 }, { date: 'May', price: 7600 }, { date: 'Jun', price: 7500 },
  ],
};

export default function Prices() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<'pakistan' | 'global'>('pakistan');
  const [province, setProvince] = useState('Punjab');
  const [city, setCity] = useState('Lahore');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('wheat');
  const [lastUpdated] = useState(new Date().toLocaleTimeString('ur'));

  const cities = PAKISTAN_PROVINCES[province as keyof typeof PAKISTAN_PROVINCES] || [];
  
  const filteredPakistanCrops = PAKISTAN_CROPS.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.nameUrdu.includes(searchQuery)
  );
  const filteredGlobalCrops = GLOBAL_CROPS.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.nameUrdu.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t('prices')}</h1>
          <p className="text-sm text-gray-500 font-urdu mt-0.5">آج کی تازہ ترین فصل قیمتیں</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <RefreshCw size={14} />
          <span>آخری اپ ڈیٹ: {lastUpdated}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setTab('pakistan')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors ${tab === 'pakistan' ? 'bg-primary text-white' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700'}`}
        >
          <MapPin size={16} />
          <span>{t('pakistanPrices')}</span>
        </button>
        <button
          onClick={() => setTab('global')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors ${tab === 'global' ? 'bg-primary text-white' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700'}`}
        >
          <Globe size={16} />
          <span>{t('globalPrices')}</span>
        </button>
      </div>

      {/* Pakistan Prices */}
      {tab === 'pakistan' && (
        <div className="space-y-4">
          {/* Location Filters */}
          <div className="card">
            <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-3">📍 منڈی منتخب کریں</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">{t('selectProvince')}</label>
                <select
                  value={province}
                  onChange={e => { setProvince(e.target.value); setCity(''); }}
                  className="input-field"
                >
                  {Object.keys(PAKISTAN_PROVINCES).map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">{t('selectCity')}</label>
                <select
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  className="input-field"
                >
                  {cities.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">{t('search')}</label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="فصل تلاش کریں..."
                  className="input-field"
                  dir="rtl"
                />
              </div>
            </div>
          </div>

          {/* Price Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPakistanCrops.map(crop => (
              <PriceCard key={crop.id} crop={crop} currency="₨" />
            ))}
          </div>
        </div>
      )}

      {/* Global Prices */}
      {tab === 'global' && (
        <div className="space-y-4">
          <div className="card">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search crops..."
              className="input-field max-w-xs"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGlobalCrops.map(crop => (
              <PriceCard key={crop.id} crop={crop} currency="$" />
            ))}
          </div>
        </div>
      )}

      {/* Price Chart */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-800 dark:text-gray-100">قیمت کی تاریخ</h2>
          <select
            value={selectedCrop}
            onChange={e => setSelectedCrop(e.target.value)}
            className="input-field w-auto text-sm"
          >
            <option value="wheat">گندم</option>
            <option value="rice">چاول</option>
          </select>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={historicalData[selectedCrop as keyof typeof historicalData]}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip formatter={(v) => `₨${v}`} />
            <Legend />
            <Line type="monotone" dataKey="price" name="قیمت (₨)" stroke="#2E7D32" strokeWidth={2.5} dot={{ fill: '#2E7D32', r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function PriceCard({ crop, currency }: { crop: typeof PAKISTAN_CROPS[0]; currency: string }) {
  const isUp = crop.change >= 0;
  return (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-urdu text-lg font-semibold text-gray-800 dark:text-gray-100">{crop.nameUrdu}</h3>
        <span className={`flex items-center gap-1 text-sm font-semibold ${isUp ? 'text-green-600' : 'text-red-500'}`}>
          {isUp ? <TrendingUp size={15} /> : <TrendingDown size={15} />}
          {isUp ? '+' : ''}{crop.changePercent.toFixed(1)}%
        </span>
      </div>
      <p className="text-2xl font-bold text-primary">
        {currency}{crop.price}
        <span className="text-sm text-gray-400 font-normal ml-1">/{crop.unit}</span>
      </p>
      <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
        <span>{crop.market}</span>
        <span className={`font-medium ${isUp ? 'text-green-600' : 'text-red-500'}`}>
          {isUp ? '+' : ''}{currency}{Math.abs(crop.change)}
        </span>
      </div>
    </div>
  );
}
