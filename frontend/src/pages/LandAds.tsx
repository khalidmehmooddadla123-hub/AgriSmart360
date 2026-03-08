import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, MapPin, Phone, X } from 'lucide-react';
import type { LandAd } from '../types';

const SAMPLE_ADS: LandAd[] = [
  {
    id: '1', userId: 'u1',
    title: 'زرعی زمین برائے فروخت — لاہور',
    description: 'نہر کنارے 25 ایکڑ زرعی زمین، پانی وافر، سڑک قریب، رجسٹری صاف',
    category: 'land', area: 25, areaUnit: 'acre',
    price: 8500000, location: 'Lahore Road', province: 'Punjab',
    images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500'],
    contactPhone: '0300-1111111', createdAt: new Date().toISOString(), status: 'active',
  },
  {
    id: '2', userId: 'u2',
    title: '50 کنال زمین برائے فروخت — ملتان',
    description: 'ٹیوب ویل سمیت 50 کنال زمین، آم کا باغ، کوٹی موجود',
    category: 'land', area: 50, areaUnit: 'kanal',
    price: 12000000, location: 'Multan Bypass', province: 'Punjab',
    images: ['https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500'],
    contactPhone: '0321-2222222', createdAt: new Date(Date.now() - 86400000).toISOString(), status: 'active',
  },
  {
    id: '3', userId: 'u3',
    title: 'John Deere ٹریکٹر برائے فروخت',
    description: 'John Deere 5310, 2020 model, سرویس شدہ، اچھی حالت میں',
    category: 'equipment',
    price: 3200000, location: 'Faisalabad', province: 'Punjab',
    images: ['https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=500'],
    contactPhone: '0333-3333333', createdAt: new Date(Date.now() - 172800000).toISOString(), status: 'active',
  },
  {
    id: '4', userId: 'u4',
    title: 'گرین ہاؤس برائے کرایہ — راولپنڈی',
    description: '5000 مربع فٹ گرین ہاؤس، ہائیڈروپونک سیٹ اپ، کلائمیٹ کنٹرول',
    category: 'greenhouse',
    price: 150000, location: 'Rawalpindi', province: 'Punjab',
    images: ['https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500'],
    contactPhone: '0344-4444444', createdAt: new Date(Date.now() - 259200000).toISOString(), status: 'active',
  },
];

const CAT_LABELS: Record<string, string> = {
  all: 'سب',
  land: 'زمین',
  equipment: 'مشینری',
  greenhouse: 'گرین ہاؤس',
};

const CAT_ICONS: Record<string, string> = {
  land: '🌾',
  equipment: '🚜',
  greenhouse: '🏡',
};

export default function LandAds() {
  const { t } = useTranslation();
  const [category, setCategory] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [selectedAd, setSelectedAd] = useState<LandAd | null>(null);
  const [form, setForm] = useState({
    title: '', category: 'land', description: '', price: '', area: '', areaUnit: 'acre',
    location: '', province: 'Punjab', contactPhone: '',
  });

  const filtered = SAMPLE_ADS.filter(a => category === 'all' || a.category === category);

  const formatPrice = (p: number) => {
    if (p >= 10000000) return `${(p / 10000000).toFixed(1)} کروڑ`;
    if (p >= 100000) return `${(p / 100000).toFixed(1)} لاکھ`;
    return `₨${p.toLocaleString()}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('آپ کا اشتہار کامیابی سے شائع ہو گیا! ✅');
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t('land')}</h1>
          <p className="text-sm text-gray-500 font-urdu mt-0.5">زمین، مشینری اور گرین ہاؤس کے اشتہارات</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
          <Plus size={18} />
          <span className="hidden sm:inline">اشتہار دیں</span>
        </button>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2">
        {Object.entries(CAT_LABELS).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setCategory(key)}
            className={`px-4 py-2 rounded-xl text-sm font-urdu transition-colors ${category === key ? 'bg-primary text-white' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300'}`}
          >
            {key !== 'all' && CAT_ICONS[key]} {label}
          </button>
        ))}
      </div>

      {/* Ads Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {filtered.map(ad => (
          <div
            key={ad.id}
            className="card p-0 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => setSelectedAd(ad)}
          >
            <div className="relative">
              <img src={ad.images[0]} alt={ad.title} className="w-full h-52 object-cover" />
              <span className="absolute top-3 right-3 bg-white/90 dark:bg-gray-800/90 px-3 py-1 rounded-full text-sm font-bold text-primary">
                {formatPrice(ad.price)}
                {ad.category === 'land' ? '' : '/ماہ'}
              </span>
              <span className="absolute top-3 left-3 bg-earth text-white px-2 py-0.5 rounded-full text-xs">
                {CAT_ICONS[ad.category]} {CAT_LABELS[ad.category]}
              </span>
            </div>
            <div className="p-4">
              <h3 className="font-bold font-urdu text-gray-800 dark:text-gray-100">{ad.title}</h3>
              <p className="text-sm text-gray-500 font-urdu mt-1 line-clamp-2">{ad.description}</p>
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-1 text-gray-400 text-xs">
                  <MapPin size={12} />
                  <span>{ad.location}, {ad.province}</span>
                </div>
                {ad.area && (
                  <span className="text-xs bg-earth-light/20 text-earth-dark px-2 py-0.5 rounded-full">
                    {ad.area} {ad.areaUnit}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Ad Detail Modal */}
      {selectedAd && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <img src={selectedAd.images[0]} alt={selectedAd.title} className="w-full h-60 object-cover rounded-t-2xl" />
            <div className="p-5 space-y-3">
              <div className="flex items-start justify-between">
                <h2 className="text-xl font-bold font-urdu text-gray-800 dark:text-gray-100">{selectedAd.title}</h2>
                <button onClick={() => setSelectedAd(null)} className="text-gray-400"><X size={20} /></button>
              </div>
              <p className="text-2xl font-bold text-primary">{formatPrice(selectedAd.price)}</p>
              <p className="font-urdu text-gray-700 dark:text-gray-300">{selectedAd.description}</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <p className="text-gray-500">صوبہ</p>
                  <p className="font-bold">{selectedAd.province}</p>
                </div>
                {selectedAd.area && (
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    <p className="text-gray-500">رقبہ</p>
                    <p className="font-bold">{selectedAd.area} {selectedAd.areaUnit}</p>
                  </div>
                )}
              </div>
              <a href={`tel:${selectedAd.contactPhone}`} className="btn-primary w-full flex items-center justify-center gap-2">
                <Phone size={16} />
                {selectedAd.contactPhone} پر رابطہ کریں
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Post Ad Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-bold font-urdu text-gray-800 dark:text-gray-100">نیا اشتہار</h3>
              <button onClick={() => setShowForm(false)}><X size={20} className="text-gray-400" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="text-sm text-gray-600 mb-1 block font-urdu">عنوان</label>
                <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="input-field" dir="rtl" placeholder="مثال: 10 ایکڑ زمین برائے فروخت" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-gray-600 mb-1 block font-urdu">قسم</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="input-field">
                    <option value="land">زمین</option>
                    <option value="equipment">مشینری</option>
                    <option value="greenhouse">گرین ہاؤس</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block font-urdu">صوبہ</label>
                  <select value={form.province} onChange={e => setForm({ ...form, province: e.target.value })} className="input-field">
                    {['Punjab', 'Sindh', 'KPK', 'Balochistan', 'Gilgit-Baltistan', 'AJK'].map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-gray-600 mb-1 block font-urdu">قیمت (₨)</label>
                  <input required type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="input-field" placeholder="10000000" />
                </div>
                {form.category === 'land' && (
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block font-urdu">رقبہ (ایکڑ)</label>
                    <input type="number" value={form.area} onChange={e => setForm({ ...form, area: e.target.value })} className="input-field" placeholder="10" />
                  </div>
                )}
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block font-urdu">مقام</label>
                <input required value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="input-field" dir="rtl" placeholder="شہر، ضلع" />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block font-urdu">فون نمبر</label>
                <input required value={form.contactPhone} onChange={e => setForm({ ...form, contactPhone: e.target.value })} className="input-field" placeholder="0300-1234567" />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block font-urdu">تفصیل</label>
                <textarea required value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="input-field h-24" dir="rtl" placeholder="تفصیل لکھیں..." />
              </div>
              <button type="submit" className="btn-primary w-full">اشتہار شائع کریں</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
