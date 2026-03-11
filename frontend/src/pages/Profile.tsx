import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { Save } from 'lucide-react';
import { PAKISTAN_PROVINCES } from '../lib/api';

const USER_ROLES = ['farmer', 'urban_farmer', 'buyer', 'agriculture_expert', 'admin'];
const CROP_LIST = ['گندم', 'چاول', 'کپاس', 'مکئی', 'گنا', 'سرسوں', 'چنا', 'مسور', 'آم', 'کینو'];

export default function Profile() {
  const { t } = useTranslation();
  const { user, updateProfile } = useAuth();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security'>('profile');

  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    city: user?.city || '',
    province: user?.province || 'Punjab',
    country: user?.country || 'Pakistan',
    farmSize: user?.farmSize || '',
    cropsGrown: user?.cropsGrown || [],
    languagePreference: user?.languagePreference || 'ur',
    role: user?.role || 'farmer',
  });

  const [notifPrefs, setNotifPrefs] = useState({
    email: user?.notificationPreferences?.email ?? true,
    sms: user?.notificationPreferences?.sms ?? true,
    dashboard: user?.notificationPreferences?.dashboard ?? true,
    priceAlerts: user?.notificationPreferences?.priceAlerts ?? true,
    weatherWarnings: user?.notificationPreferences?.weatherWarnings ?? true,
    diseaseAlerts: user?.notificationPreferences?.diseaseAlerts ?? true,
    govtAnnouncements: user?.notificationPreferences?.govtAnnouncements ?? true,
  });

  const handleSave = async () => {
    setSaving(true);
    await updateProfile({
      ...form,
      notificationPreferences: notifPrefs,
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const toggleCrop = (crop: string) => {
    setForm(f => ({
      ...f,
      cropsGrown: f.cropsGrown.includes(crop)
        ? f.cropsGrown.filter(c => c !== crop)
        : [...f.cropsGrown, crop],
    }));
  };

  const cities = PAKISTAN_PROVINCES[form.province as keyof typeof PAKISTAN_PROVINCES] || [];

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold">
          {form.name?.charAt(0)?.toUpperCase() || 'U'}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{form.name || t('profile')}</h1>
          <p className="text-sm text-gray-500">{t(form.role)}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {(['profile', 'notifications', 'security'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${activeTab === tab ? 'bg-primary text-white' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300'}`}
          >
            {tab === 'profile' ? 'پروفائل' : tab === 'notifications' ? 'اطلاعات' : 'سکیورٹی'}
          </button>
        ))}
      </div>

      {/* Success Banner */}
      {saved && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 rounded-xl p-3 text-green-700 dark:text-green-400 font-urdu text-sm">
          ✅ پروفائل کامیابی سے محفوظ ہو گیا!
        </div>
      )}

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="card space-y-4">
          <h2 className="font-bold text-gray-800 dark:text-gray-100 font-urdu">ذاتی معلومات</h2>

          <div>
            <label className="text-sm text-gray-600 dark:text-gray-300 mb-1 block font-urdu">{t('name')}</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input-field" placeholder="آپ کا نام" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-300 mb-1 block font-urdu">{t('phone')}</label>
              <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="input-field" placeholder="0300-1234567" />
            </div>
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-300 mb-1 block font-urdu">{t('email')}</label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="input-field" placeholder="email@example.com" />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-600 dark:text-gray-300 mb-1 block font-urdu">کردار (Role)</label>
            <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value as typeof form.role })} className="input-field">
              {USER_ROLES.map(r => (
                <option key={r} value={r}>{t(r)}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-300 mb-1 block font-urdu">{t('province')}</label>
              <select value={form.province} onChange={e => setForm({ ...form, province: e.target.value, city: '' })} className="input-field">
                {Object.keys(PAKISTAN_PROVINCES).map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-300 mb-1 block font-urdu">{t('city')}</label>
              <select value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} className="input-field">
                <option value="">منتخب کریں</option>
                {cities.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-600 dark:text-gray-300 mb-1 block font-urdu">{t('farmSize')} (ایکڑ)</label>
            <input type="number" value={form.farmSize} onChange={e => setForm({ ...form, farmSize: e.target.value })} className="input-field" placeholder="مثال: 25" />
          </div>

          <div>
            <label className="text-sm text-gray-600 dark:text-gray-300 mb-2 block font-urdu">{t('cropsGrown')}</label>
            <div className="flex flex-wrap gap-2">
              {CROP_LIST.map(crop => (
                <button
                  key={crop}
                  type="button"
                  onClick={() => toggleCrop(crop)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-urdu transition-colors ${form.cropsGrown.includes(crop) ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                >
                  {crop}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-600 dark:text-gray-300 mb-1 block font-urdu">زبان کی ترجیح</label>
            <select value={form.languagePreference} onChange={e => setForm({ ...form, languagePreference: e.target.value })} className="input-field">
              <option value="ur">اردو</option>
              <option value="en">English</option>
              <option value="pa">Punjabi</option>
              <option value="sd">Sindhi</option>
            </select>
          </div>

          <button onClick={handleSave} disabled={saving} className="btn-primary w-full flex items-center justify-center gap-2">
            <Save size={16} />
            {saving ? 'محفوظ ہو رہا ہے...' : t('updateProfile')}
          </button>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="card space-y-4">
          <h2 className="font-bold text-gray-800 dark:text-gray-100 font-urdu">اطلاع کی ترجیحات</h2>

          <div className="space-y-3">
            {[
              { key: 'email', label: 'ای میل اطلاعات', desc: 'قیمت اور موسم کی تازہ خبریں' },
              { key: 'sms', label: 'SMS اطلاعات', desc: 'فوری انتباہ اور قیمت تبدیلیاں' },
              { key: 'dashboard', label: 'ڈیش بورڈ اطلاعات', desc: 'ایپ کے اندر اطلاعات' },
              { key: 'priceAlerts', label: 'قیمت انتباہ', desc: 'قیمت بڑھنے یا گھٹنے پر اطلاع' },
              { key: 'weatherWarnings', label: 'موسمی انتباہ', desc: 'بارش، طوفان کی اطلاع' },
              { key: 'diseaseAlerts', label: 'بیماری انتباہ', desc: 'علاقے میں فصل بیماری' },
              { key: 'govtAnnouncements', label: 'سرکاری اعلانات', desc: 'سبسڈی اور اسکیمیں' },
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <div>
                  <p className="font-semibold font-urdu text-gray-800 dark:text-gray-100">{label}</p>
                  <p className="text-xs text-gray-500 font-urdu">{desc}</p>
                </div>
                <button
                  onClick={() => setNotifPrefs(p => ({ ...p, [key]: !p[key as keyof typeof p] }))}
                  className={`w-12 h-6 rounded-full transition-colors relative ${notifPrefs[key as keyof typeof notifPrefs] ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'}`}
                >
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${notifPrefs[key as keyof typeof notifPrefs] ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
              </div>
            ))}
          </div>

          <button onClick={handleSave} disabled={saving} className="btn-primary w-full flex items-center justify-center gap-2">
            <Save size={16} />
            {saving ? 'محفوظ ہو رہا ہے...' : 'ترجیحات محفوظ کریں'}
          </button>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="card space-y-4">
          <h2 className="font-bold text-gray-800 dark:text-gray-100 font-urdu">سکیورٹی سیٹنگز</h2>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-300 mb-1 block font-urdu">موجودہ پاس ورڈ</label>
              <input type="password" className="input-field" placeholder="••••••••" />
            </div>
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-300 mb-1 block font-urdu">نیا پاس ورڈ</label>
              <input type="password" className="input-field" placeholder="••••••••" />
            </div>
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-300 mb-1 block font-urdu">پاس ورڈ تصدیق</label>
              <input type="password" className="input-field" placeholder="••••••••" />
            </div>
            <button className="btn-primary w-full">پاس ورڈ تبدیل کریں</button>
          </div>
        </div>
      )}
    </div>
  );
}
