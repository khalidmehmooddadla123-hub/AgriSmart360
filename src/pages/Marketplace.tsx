import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Search, MapPin, Phone, X } from 'lucide-react';
import type { MarketplaceListing } from '../types';

const SAMPLE_LISTINGS: MarketplaceListing[] = [
  {
    id: '1', userId: 'u1', title: 'Fresh Wheat', titleUrdu: 'تازہ گندم',
    category: 'crop', description: 'High quality wheat from Punjab farms.',
    price: 3750, quantity: 500, unit: 'kg', qualityGrade: 'A',
    location: 'Lahore, Punjab', images: ['https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400'],
    contactPhone: '0300-1234567', createdAt: new Date().toISOString(), status: 'active',
  },
  {
    id: '2', userId: 'u2', title: 'Basmati Rice', titleUrdu: 'باسمتی چاول',
    category: 'crop', description: 'Premium Basmati rice, 1121 variety.',
    price: 7200, quantity: 200, unit: 'kg', qualityGrade: 'A',
    location: 'Gujranwala, Punjab', images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400'],
    contactPhone: '0321-9876543', createdAt: new Date(Date.now() - 86400000).toISOString(), status: 'active',
  },
  {
    id: '3', userId: 'u3', title: 'Fresh Tomatoes', titleUrdu: 'تازہ ٹماٹر',
    category: 'vegetable', description: 'Farm-fresh tomatoes, picked today.',
    price: 1100, quantity: 100, unit: 'kg', qualityGrade: 'B',
    location: 'Karachi, Sindh', images: ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400'],
    contactPhone: '0333-5555555', createdAt: new Date(Date.now() - 172800000).toISOString(), status: 'active',
  },
  {
    id: '4', userId: 'u4', title: 'Cotton Crop', titleUrdu: 'کپاس',
    category: 'crop', description: 'Long staple cotton, Multan variety.',
    price: 8000, quantity: 300, unit: 'kg', qualityGrade: 'A',
    location: 'Multan, Punjab', images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'],
    contactPhone: '0301-2222222', createdAt: new Date(Date.now() - 259200000).toISOString(), status: 'active',
  },
  {
    id: '5', userId: 'u5', title: 'Mango (Chaunsa)', titleUrdu: 'آم (چونسہ)',
    category: 'fruit', description: 'Fresh Chaunsa mangoes from Rahim Yar Khan.',
    price: 4000, quantity: 150, unit: 'kg', qualityGrade: 'A',
    location: 'Rahim Yar Khan', images: ['https://images.unsplash.com/photo-1553279768-865429fa0078?w=400'],
    contactPhone: '0344-7777777', createdAt: new Date(Date.now() - 345600000).toISOString(), status: 'active',
  },
  {
    id: '6', userId: 'u6', title: 'Wheat Seeds (Super Saver)', titleUrdu: 'گندم بیج (سپر سیور)',
    category: 'seed', description: 'Certified wheat seeds, 100% germination rate.',
    price: 5500, quantity: 50, unit: 'kg', qualityGrade: 'A',
    location: 'Faisalabad, Punjab', images: ['https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400'],
    contactPhone: '0311-3333333', createdAt: new Date(Date.now() - 432000000).toISOString(), status: 'active',
  },
];

const CATEGORIES = ['all', 'crop', 'fruit', 'vegetable', 'seed', 'equipment'];
const GRADE_COLORS = { A: 'bg-green-100 text-green-700', B: 'bg-yellow-100 text-yellow-700', C: 'bg-red-100 text-red-600' };

export default function Marketplace() {
  const { t } = useTranslation();
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedListing, setSelectedListing] = useState<MarketplaceListing | null>(null);
  const [form, setForm] = useState({
    titleUrdu: '', category: 'crop', price: '', quantity: '', unit: 'kg',
    location: '', description: '', contactPhone: '', qualityGrade: 'A',
  });

  const filtered = SAMPLE_LISTINGS.filter(l => {
    const matchCat = category === 'all' || l.category === category;
    const matchSearch = !search ||
      l.titleUrdu?.includes(search) ||
      l.title.toLowerCase().includes(search.toLowerCase()) ||
      l.location.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('آپ کا اشتہار کامیابی سے شائع ہو گیا! ✅\n(In production, this will be saved to database)');
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t('marketplace')}</h1>
          <p className="text-sm text-gray-500 font-urdu mt-0.5">فصل، پھل، سبزی اور بیج براہ راست بیچیں</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
          <Plus size={18} />
          <span className="hidden sm:inline">{t('postListing')}</span>
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="فصل یا مقام تلاش کریں..."
            className="input-field pl-9"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${category === cat ? 'bg-primary text-white' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300'}`}
            >
              {cat === 'all' ? 'سب' : cat === 'crop' ? 'فصل' : cat === 'fruit' ? 'پھل' : cat === 'vegetable' ? 'سبزی' : cat === 'seed' ? 'بیج' : 'مشینری'}
            </button>
          ))}
        </div>
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(listing => (
          <div
            key={listing.id}
            className="card p-0 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => setSelectedListing(listing)}
          >
            <div className="relative">
              <img
                src={listing.images[0]}
                alt={listing.title}
                className="w-full h-44 object-cover"
              />
              {listing.qualityGrade && (
                <span className={`absolute top-2 right-2 px-2 py-0.5 rounded text-xs font-bold ${GRADE_COLORS[listing.qualityGrade]}`}>
                  Grade {listing.qualityGrade}
                </span>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-bold font-urdu text-gray-800 dark:text-gray-100">{listing.titleUrdu}</h3>
              <p className="text-xl font-bold text-primary mt-1">
                ₨{listing.price}
                <span className="text-sm text-gray-400 font-normal ml-1">/{listing.unit}</span>
              </p>
              <div className="flex items-center gap-1 text-gray-500 text-xs mt-1">
                <MapPin size={12} />
                <span>{listing.location}</span>
              </div>
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-gray-500">{listing.quantity} {listing.unit} دستیاب</span>
                <span className="text-xs bg-primary-50 text-primary px-2 py-0.5 rounded-full">
                  {listing.category === 'crop' ? 'فصل' : listing.category === 'fruit' ? 'پھل' : listing.category === 'vegetable' ? 'سبزی' : listing.category === 'seed' ? 'بیج' : listing.category}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Listing Detail Modal */}
      {selectedListing && (
        <Modal onClose={() => setSelectedListing(null)}>
          <div className="space-y-4">
            <img
              src={selectedListing.images[0]}
              alt={selectedListing.title}
              className="w-full h-56 object-cover rounded-xl"
            />
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold font-urdu text-gray-800 dark:text-gray-100">{selectedListing.titleUrdu}</h2>
                <p className="text-gray-500 text-sm">{selectedListing.title}</p>
              </div>
              <span className="text-2xl font-bold text-primary">₨{selectedListing.price}/{selectedListing.unit}</span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm">{selectedListing.description}</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                <p className="text-gray-500">مقدار</p>
                <p className="font-bold">{selectedListing.quantity} {selectedListing.unit}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                <p className="text-gray-500">معیار</p>
                <p className="font-bold">Grade {selectedListing.qualityGrade || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <MapPin size={16} />
              <span>{selectedListing.location}</span>
            </div>
            <a
              href={`tel:${selectedListing.contactPhone}`}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <Phone size={16} />
              {selectedListing.contactPhone} پر رابطہ کریں
            </a>
          </div>
        </Modal>
      )}

      {/* Post Listing Form Modal */}
      {showForm && (
        <Modal onClose={() => setShowForm(false)} title="نیا اشتہار دیں">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-300 mb-1 block font-urdu">فصل کا نام (اردو)</label>
              <input required value={form.titleUrdu} onChange={e => setForm({ ...form, titleUrdu: e.target.value })} className="input-field" dir="rtl" placeholder="مثال: تازہ گندم" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-300 mb-1 block font-urdu">قسم</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="input-field">
                  <option value="crop">فصل</option>
                  <option value="fruit">پھل</option>
                  <option value="vegetable">سبزی</option>
                  <option value="seed">بیج</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-300 mb-1 block font-urdu">معیار</label>
                <select value={form.qualityGrade} onChange={e => setForm({ ...form, qualityGrade: e.target.value })} className="input-field">
                  <option value="A">Grade A</option>
                  <option value="B">Grade B</option>
                  <option value="C">Grade C</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-300 mb-1 block font-urdu">قیمت (₨)</label>
                <input required type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="input-field" placeholder="3800" />
              </div>
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-300 mb-1 block font-urdu">مقدار (kg)</label>
                <input required type="number" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} className="input-field" placeholder="500" />
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-300 mb-1 block font-urdu">مقام</label>
              <input required value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="input-field" dir="rtl" placeholder="لاہور، پنجاب" />
            </div>
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-300 mb-1 block font-urdu">فون نمبر</label>
              <input required value={form.contactPhone} onChange={e => setForm({ ...form, contactPhone: e.target.value })} className="input-field" placeholder="0300-1234567" />
            </div>
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-300 mb-1 block font-urdu">تفصیل</label>
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="input-field h-20" dir="rtl" placeholder="فصل کی تفصیل لکھیں..." />
            </div>
            <button type="submit" className="btn-primary w-full">اشتہار شائع کریں</button>
          </form>
        </Modal>
      )}
    </div>
  );
}

function Modal({ children, onClose, title }: { children: React.ReactNode; onClose: () => void; title?: string }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-bold text-gray-800 dark:text-gray-100 font-urdu">{title || 'تفصیل'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
