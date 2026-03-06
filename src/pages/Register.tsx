import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, Loader } from 'lucide-react';

const ROLES = [
  { value: 'farmer', label: 'کسان', icon: '👨‍🌾' },
  { value: 'urban_farmer', label: 'شہری کسان', icon: '🏘️' },
  { value: 'buyer', label: 'خریدار', icon: '🛒' },
  { value: 'agriculture_expert', label: 'زرعی ماہر', icon: '🎓' },
];

export default function Register() {
  const { signUpWithEmail, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'farmer' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError('پاس ورڈ مماثل نہیں ہیں');
      return;
    }
    if (form.password.length < 6) {
      setError('پاس ورڈ کم از کم 6 حروف کا ہونا چاہیے');
      return;
    }
    setLoading(true);
    setError('');
    const { error } = await signUpWithEmail(form.email, form.password, form.name);
    if (error) {
      setError(error.message === 'User already registered'
        ? 'یہ ای میل پہلے سے رجسٹرڈ ہے'
        : 'رجسٹریشن ناکام۔ دوبارہ کوشش کریں۔');
      setLoading(false);
      return;
    }
    await updateProfile({ name: form.name, role: form.role as 'farmer' | 'urban_farmer' | 'buyer' | 'agriculture_expert' });
    navigate('/');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-agri-dark dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
            <span className="text-3xl">🌱</span>
          </div>
          <h1 className="text-3xl font-bold text-primary">AgriSmart 360</h1>
          <p className="font-urdu text-gray-600 dark:text-gray-400 mt-1">نیا اکاؤنٹ بنائیں</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-5 font-urdu">رجسٹر کریں</h2>

          {/* Step 1: Role Selection */}
          {step === 1 && (
            <div className="space-y-4">
              <p className="font-urdu text-gray-600 dark:text-gray-300">آپ کا کردار منتخب کریں:</p>
              <div className="grid grid-cols-2 gap-3">
                {ROLES.map(role => (
                  <button
                    key={role.value}
                    onClick={() => setForm({ ...form, role: role.value })}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-colors ${form.role === role.value ? 'border-primary bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-600 hover:border-primary-200'}`}
                  >
                    <span className="text-3xl">{role.icon}</span>
                    <span className="font-urdu text-sm font-medium text-gray-700 dark:text-gray-200">{role.label}</span>
                  </button>
                ))}
              </div>
              <button onClick={() => setStep(2)} className="btn-primary w-full">اگلا مرحلہ →</button>
            </div>
          )}

          {/* Step 2: Account Details */}
          {step === 2 && (
            <form onSubmit={handleRegister} className="space-y-4">
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg px-4 py-2 font-urdu">
                  {error}
                </div>
              )}

              <div>
                <label className="text-sm text-gray-600 dark:text-gray-300 mb-1 block font-urdu">پورا نام</label>
                <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input-field" placeholder="آپ کا نام" dir="rtl" />
              </div>
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-300 mb-1 block">ای میل</label>
                <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="input-field" placeholder="email@example.com" />
              </div>
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-300 mb-1 block font-urdu">پاس ورڈ</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    className="input-field pr-10"
                    placeholder="••••••••"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-300 mb-1 block font-urdu">پاس ورڈ تصدیق</label>
                <input type="password" required value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} className="input-field" placeholder="••••••••" />
              </div>

              <div className="flex gap-2">
                <button type="button" onClick={() => setStep(1)} className="btn-secondary flex-1">← واپس</button>
                <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
                  {loading && <Loader size={16} className="animate-spin" />}
                  رجسٹر کریں
                </button>
              </div>
            </form>
          )}

          <p className="text-center text-sm text-gray-500 mt-4">
            پہلے سے اکاؤنٹ ہے؟{' '}
            <Link to="/login" className="text-primary font-semibold hover:text-primary-700">لاگ ان کریں</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
