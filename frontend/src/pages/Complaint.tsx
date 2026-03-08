import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle, Clock, AlertCircle, XCircle } from 'lucide-react';
import type { Complaint } from '../types';

const SAMPLE_COMPLAINTS: Complaint[] = [
  {
    id: '1', userId: 'u1',
    subject: 'قیمت میں غلط معلومات',
    description: 'لاہور منڈی میں گندم کی قیمت ₨3,800 دکھ رہی ہے لیکن اصل قیمت ₨3,850 ہے',
    status: 'resolved', category: 'price',
    createdAt: new Date(Date.now() - 432000000).toISOString(),
    updatedAt: new Date(Date.now() - 259200000).toISOString(),
    adminResponse: 'آپ کی شکایت درست تھی۔ قیمت اپ ڈیٹ کر دی گئی ہے۔ شکریہ!',
  },
  {
    id: '2', userId: 'u1',
    subject: 'موسم کی غلط پیش گوئی',
    description: 'کل بارش کی پیش گوئی تھی لیکن بارش نہیں ہوئی، اس وجہ سے سپرے رک گیا',
    status: 'in_review', category: 'weather',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

const STATUS_CONFIG = {
  pending: { label: 'زیر التواء', icon: Clock, color: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20' },
  in_review: { label: 'زیر جائزہ', icon: AlertCircle, color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' },
  resolved: { label: 'حل ہو گئی', icon: CheckCircle, color: 'text-green-500 bg-green-50 dark:bg-green-900/20' },
  closed: { label: 'بند', icon: XCircle, color: 'text-gray-500 bg-gray-100 dark:bg-gray-700' },
};

const CAT_LABELS: Record<string, string> = {
  price: 'قیمت',
  weather: 'موسم',
  app: 'ایپ مسئلہ',
  marketplace: 'بازار',
  other: 'دیگر',
};

export default function Complaint() {
  const { t } = useTranslation();
  const [complaints, setComplaints] = useState<Complaint[]>(SAMPLE_COMPLAINTS);
  const [form, setForm] = useState({ subject: '', description: '', category: 'other' });
  const [submitted, setSubmitted] = useState(false);
  const [tab, setTab] = useState<'new' | 'list'>('new');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newComplaint: Complaint = {
      id: Date.now().toString(),
      userId: 'current_user',
      subject: form.subject,
      description: form.description,
      status: 'pending',
      category: form.category as Complaint['category'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setComplaints(prev => [newComplaint, ...prev]);
    setForm({ subject: '', description: '', category: 'other' });
    setSubmitted(true);
    setTab('list');
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t('complaint')}</h1>
        <p className="text-sm text-gray-500 font-urdu mt-0.5">شکایت درج کریں یا اپنی شکایات کی حیثیت دیکھیں</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setTab('new')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${tab === 'new' ? 'bg-primary text-white' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300'}`}
        >
          نئی شکایت
        </button>
        <button
          onClick={() => setTab('list')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${tab === 'list' ? 'bg-primary text-white' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300'}`}
        >
          میری شکایات ({complaints.length})
        </button>
      </div>

      {/* Success Message */}
      {submitted && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle className="text-green-600" size={20} />
          <p className="font-urdu text-green-700 dark:text-green-400">
            آپ کی شکایت کامیابی سے درج ہو گئی۔ 24 گھنٹے میں جواب دیا جائے گا۔
          </p>
        </div>
      )}

      {/* New Complaint Form */}
      {tab === 'new' && (
        <div className="card max-w-2xl">
          <h2 className="font-bold text-gray-800 dark:text-gray-100 mb-4 font-urdu">شکایت درج کریں</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-300 mb-1 block font-urdu">شکایت کی قسم</label>
              <select
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
                className="input-field"
              >
                {Object.entries(CAT_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-300 mb-1 block font-urdu">موضوع</label>
              <input
                required
                value={form.subject}
                onChange={e => setForm({ ...form, subject: e.target.value })}
                className="input-field"
                dir="rtl"
                placeholder="مختصر موضوع لکھیں..."
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-300 mb-1 block font-urdu">تفصیل</label>
              <textarea
                required
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                className="input-field h-32"
                dir="rtl"
                placeholder="شکایت کی مکمل تفصیل لکھیں..."
              />
            </div>
            <button type="submit" className="btn-primary w-full">شکایت جمع کریں</button>
          </form>

          {/* Contact Info */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
            <h3 className="font-semibold text-blue-700 dark:text-blue-400 font-urdu mb-2">📞 براہ راست رابطہ</h3>
            <p className="font-urdu text-sm text-blue-600 dark:text-blue-300">
              • فون: 0800-27474 (مفت)<br />
              • ای میل: support@agrismart360.pk<br />
              • اوقات: صبح 9 بجے سے شام 6 بجے
            </p>
          </div>
        </div>
      )}

      {/* Complaints List */}
      {tab === 'list' && (
        <div className="space-y-4 max-w-2xl">
          {complaints.length === 0 ? (
            <div className="card text-center py-8">
              <p className="font-urdu text-gray-500">کوئی شکایت نہیں</p>
            </div>
          ) : (
            complaints.map(comp => {
              const cfg = STATUS_CONFIG[comp.status];
              const Icon = cfg.icon;
              return (
                <div key={comp.id} className="card">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold font-urdu text-gray-800 dark:text-gray-100">{comp.subject}</h3>
                      <span className="text-xs text-gray-400">{new Date(comp.createdAt).toLocaleDateString('ur')}</span>
                    </div>
                    <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${cfg.color}`}>
                      <Icon size={12} />
                      {cfg.label}
                    </span>
                  </div>
                  <p className="text-sm font-urdu text-gray-600 dark:text-gray-400">{comp.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-gray-600 dark:text-gray-300">
                      {CAT_LABELS[comp.category]}
                    </span>
                  </div>
                  {comp.adminResponse && (
                    <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <p className="text-xs font-semibold text-green-600 dark:text-green-400 mb-1">ایڈمن جواب:</p>
                      <p className="text-sm font-urdu text-green-700 dark:text-green-300">{comp.adminResponse}</p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
