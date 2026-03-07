import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { TrendingUp, TrendingDown, RefreshCw, Globe, MapPin, Clock } from 'lucide-react';
import { getPakistanMarketPrices, getGlobalMarketPrices, PAKISTAN_PROVINCES } from '../lib/api';
import type { CropPrice } from '../types';
import i18n from '../lib/i18n';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const historicalData = {
  wheat: [
    { date: 'Jan', price: 3600 }, { date: 'Feb', price: 3650 }, { date: 'Mar', price: 3800 },
    { date: 'Apr', price: 3750 }, { date: 'May', price: 3700 }, { date: 'Jun', price: 3820 },
  ],
  rice: [
    { date: 'Jan', price: 7200 }, { date: 'Feb', price: 7300 }, { date: 'Mar', price: 7500 },
    { date: 'Apr', price: 7450 }, { date: 'May', price: 7600 }, { date: 'Jun', price: 7480 },
  ],
};

export default function Prices() {
  const { t } = useTranslation();
  const isUrdu = i18n.language === 'ur';
  const [tab, setTab] = useState<'pakistan' | 'global'>('pakistan');
  const [province, setProvince] = useState('Punjab');
  const [city, setCity] = useState('Lahore');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('wheat');
  const [pakistanCrops, setPakistanCrops] = useState<CropPrice[]>([]);
  const [globalCrops, setGlobalCrops] = useState<CropPrice[]>([]);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);

  const loadPrices = useCallback(() => {
    setPakistanCrops(getPakistanMarketPrices());
    setGlobalCrops(getGlobalMarketPrices());
    setLastUpdated(new Date());
  }, []);

  useEffect(() => {
    loadPrices();
    // Refresh prices every 30 minutes
    const interval = setInterval(loadPrices, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [loadPrices]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(r => setTimeout(r, 600));
    loadPrices();
    setRefreshing(false);
  };

  const cities = PAKISTAN_PROVINCES[province as keyof typeof PAKISTAN_PROVINCES] || [];

  const filteredPakistanCrops = pakistanCrops.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.nameUrdu.includes(searchQuery)
  );
  const filteredGlobalCrops = globalCrops.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.nameUrdu.includes(searchQuery)
  );

  const formatTime = (d: Date) =>
    d.toLocaleTimeString(isUrdu ? 'ur-PK' : 'en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="space-y-6">
      {/* ─── Header ─── */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t('prices')}</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {isUrdu ? 'آج کی تازہ ترین فصل قیمتیں' : "Today's Latest Crop Prices"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full">
            <Clock size={12} />
            <span>{isUrdu ? 'آخری اپ ڈیٹ:' : 'Updated:'} {formatTime(lastUpdated)}</span>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-1.5 text-xs text-primary bg-primary-50 dark:bg-primary-900/20 px-3 py-1.5 rounded-full hover:bg-primary-100 transition-colors"
          >
            <RefreshCw size={12} className={refreshing ? 'animate-spin' : ''} />
            {isUrdu ? 'تازہ کریں' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* ─── Tab Selector ─── */}
      <div className="flex gap-2">
        <button
          onClick={() => setTab('pakistan')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-colors ${tab === 'pakistan' ? 'bg-primary text-white shadow-sm' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-primary hover:text-primary'}`}
        >
          <MapPin size={16} />
          {t('pakistanPrices')}
        </button>
        <button
          onClick={() => setTab('global')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-colors ${tab === 'global' ? 'bg-primary text-white shadow-sm' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-primary hover:text-primary'}`}
        >
          <Globe size={16} />
          {t('globalPrices')}
        </button>
      </div>

      {/* ─── Pakistan Prices ─── */}
      {tab === 'pakistan' && (
        <div className="space-y-4">
          {/* Location & Search Filters */}
          <div className="card">
            <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-3 flex items-center gap-2">
              <MapPin size={16} className="text-primary" />
              {isUrdu ? 'منڈی منتخب کریں' : 'Select Market'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-gray-500 mb-1.5 block font-medium">{t('selectProvince')}</label>
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
                <label className="text-xs text-gray-500 mb-1.5 block font-medium">{t('selectCity')}</label>
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
                <label className="text-xs text-gray-500 mb-1.5 block font-medium">{t('search')}</label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder={isUrdu ? 'فصل تلاش کریں...' : 'Search crop...'}
                  className="input-field"
                />
              </div>
            </div>
          </div>

          {/* Price Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPakistanCrops.map(crop => (
              <PriceCard key={crop.id} crop={crop} currency="₨" isUrdu={isUrdu} />
            ))}
          </div>
        </div>
      )}

      {/* ─── Global Prices ─── */}
      {tab === 'global' && (
        <div className="space-y-4">
          <div className="card">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Globe size={15} />
                {isUrdu ? 'عالمی اجناس منڈی (CBOT / ICE)' : 'Global Commodity Markets (CBOT / ICE)'}
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={isUrdu ? 'تلاش کریں...' : 'Search...'}
                className="input-field w-auto max-w-xs text-sm"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGlobalCrops.map(crop => (
              <PriceCard key={crop.id} crop={crop} currency="$" isUrdu={isUrdu} />
            ))}
          </div>
        </div>
      )}

      {/* ─── Price History Chart ─── */}
      <div className="card">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
          <h2 className="font-bold text-gray-800 dark:text-gray-100">
            {isUrdu ? 'قیمت کی تاریخ (6 ماہ)' : 'Price History (6 Months)'}
          </h2>
          <select
            value={selectedCrop}
            onChange={e => setSelectedCrop(e.target.value)}
            className="input-field w-auto text-sm"
          >
            <option value="wheat">{isUrdu ? 'گندم' : 'Wheat'}</option>
            <option value="rice">{isUrdu ? 'چاول' : 'Rice'}</option>
          </select>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={historicalData[selectedCrop as keyof typeof historicalData]}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip formatter={(v) => `₨${v}`} />
            <Legend />
            <Line
              type="monotone"
              dataKey="price"
              name={isUrdu ? 'قیمت (₨)' : 'Price (₨)'}
              stroke="#2E7D32"
              strokeWidth={2.5}
              dot={{ fill: '#2E7D32', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function PriceCard({ crop, currency, isUrdu }: { crop: CropPrice; currency: string; isUrdu: boolean }) {
  const isUp = crop.change >= 0;
  const absChange = Math.abs(typeof crop.change === 'number' ? crop.change : 0);
  return (
    <div className="card hover:shadow-lg transition-all hover:-translate-y-0.5 border border-transparent hover:border-primary/20">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-bold text-gray-800 dark:text-gray-100 text-base">
            {isUrdu ? crop.nameUrdu : crop.name}
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">{isUrdu ? crop.name : crop.nameUrdu}</p>
        </div>
        <span className={`flex items-center gap-1 text-sm font-semibold px-2 py-1 rounded-lg ${isUp ? 'text-green-700 bg-green-50 dark:bg-green-900/20' : 'text-red-600 bg-red-50 dark:bg-red-900/20'}`}>
          {isUp ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
          {isUp ? '+' : ''}{crop.changePercent.toFixed(1)}%
        </span>
      </div>
      <p className="text-2xl font-bold text-primary mb-1">
        {currency}{typeof crop.price === 'number' && crop.price < 10 ? crop.price.toFixed(3) : crop.price.toLocaleString()}
        <span className="text-sm text-gray-400 font-normal ml-1">/{crop.unit}</span>
      </p>
      <div className="flex items-center justify-between text-xs text-gray-500 mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
        <span className="flex items-center gap-1">
          <MapPin size={11} />
          {crop.market}
        </span>
        <span className={`font-semibold ${isUp ? 'text-green-600' : 'text-red-500'}`}>
          {isUp ? '+' : '-'}{currency}{absChange}
        </span>
      </div>
    </div>
  );
}

