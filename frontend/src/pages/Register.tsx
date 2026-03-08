import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, Loader, ArrowLeft } from 'lucide-react';
import i18n from '../lib/i18n';

const ROLES = [
  { value: 'farmer', labelUr: 'کسان', labelEn: 'Farmer', icon: '👨‍🌾' },
  { value: 'urban_farmer', labelUr: 'شہری کسان', labelEn: 'Urban Farmer', icon: '🏘️' },
  { value: 'buyer', labelUr: 'خریدار', labelEn: 'Buyer', icon: '🛒' },
  { value: 'agriculture_expert', labelUr: 'زرعی ماہر', labelEn: 'Ag Expert', icon: '🎓' },
];

export default function Register() {
  const { signUpWithEmail, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'farmer' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);

  const isUrdu = i18n.language === 'ur';

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError(isUrdu ? 'پاس ورڈ مماثل نہیں ہیں' : 'Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      setError(isUrdu ? 'پاس ورڈ کم از کم 6 حروف کا ہونا چاہیے' : 'Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    setError('');
    const { error } = await signUpWithEmail(form.email, form.password, form.name);
    if (error) {
      setError(error.message === 'User already registered'
        ? (isUrdu ? 'یہ ای میل پہلے سے رجسٹرڈ ہے' : 'This email is already registered')
        : (isUrdu ? 'رجسٹریشن ناکام۔ دوبارہ کوشش کریں۔' : 'Registration failed. Please try again.'));
      setLoading(false);
      return;
    }
    await updateProfile({ name: form.name, role: form.role as 'farmer' | 'urban_farmer' | 'buyer' | 'agriculture_expert' });
    navigate('/app');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-agri-dark dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to landing */}
        <div className="mb-4">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary transition-colors"
          >
            <ArrowLeft size={15} />
            {isUrdu ? 'واپس' : 'Back to Home'}
          </Link>
        </div>

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
            <span className="text-3xl">🌱</span>
          </div>
          <h1 className="text-3xl font-bold text-primary">AgriSmart 360</h1>
          <p className="font-urdu text-gray-600 dark:text-gray-400 mt-1">
            {isUrdu ? 'نیا اکاؤنٹ بنائیں' : 'Create a new account'}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-5 font-urdu">
            {isUrdu ? 'رجسٹر کریں' : 'Register'}
          </h2>

          {/* Step 1: Role Selection */}
          {step === 1 && (
            <div className="space-y-4">
              <p className="font-urdu text-gray-600 dark:text-gray-300">
                {isUrdu ? 'آپ کا کردار منتخب کریں:' : 'Select your role:'}
              </p>
              <div className="grid grid-cols-2 gap-3">
                {ROLES.map(role => (
                  <button
                    key={role.value}
                    onClick={() => setForm({ ...form, role: role.value })}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-colors ${form.role === role.value ? 'border-primary bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-600 hover:border-primary-200'}`}
                  >
                    <span className="text-3xl">{role.icon}</span>
                    <span className="font-urdu text-sm font-medium text-gray-700 dark:text-gray-200">
                      {isUrdu ? role.labelUr : role.labelEn}
                    </span>
                  </button>
                ))}
              </div>
              <button onClick={() => setStep(2)} className="btn-primary w-full">
                {isUrdu ? 'اگلا مرحلہ →' : 'Next Step →'}
              </button>
            </div>
          )}

          {/* Step 2: Account Details */}
          {step === 2 && (
            <form onSubmit={handleRegister} className="space-y-4">
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg px-4 py-2 font-urdu">
                  ⚠️ {error}
                </div>
              )}

              <div>
                <label className="text-sm text-gray-600 dark:text-gray-300 mb-1 block font-urdu">
                  {isUrdu ? 'پورا نام' : 'Full Name'}
                </label>
                <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input-field" placeholder={isUrdu ? 'آپ کا نام' : 'Your name'} />
              </div>
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-300 mb-1 block">
                  {isUrdu ? 'ای میل' : 'Email'}
                </label>
                <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="input-field" placeholder="email@example.com" dir="ltr" />
              </div>
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-300 mb-1 block font-urdu">
                  {isUrdu ? 'پاس ورڈ' : 'Password'}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    className="input-field pe-10"
                    placeholder="••••••••"
                    dir="ltr"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-300 mb-1 block font-urdu">
                  {isUrdu ? 'پاس ورڈ تصدیق' : 'Confirm Password'}
                </label>
                <input type="password" required value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} className="input-field" placeholder="••••••••" dir="ltr" />
              </div>

              <div className="flex gap-2">
                <button type="button" onClick={() => setStep(1)} className="btn-secondary flex-1">
                  {isUrdu ? '← واپس' : '← Back'}
                </button>
                <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
                  {loading && <Loader size={16} className="animate-spin" />}
                  {isUrdu ? 'رجسٹر کریں' : 'Register'}
                </button>
              </div>
            </form>
          )}

          <p className="text-center text-sm text-gray-500 mt-4 font-urdu">
            {isUrdu ? 'پہلے سے اکاؤنٹ ہے؟' : 'Already have an account?'}{' '}
            <Link to="/login" className="text-primary font-semibold hover:text-primary-700">
              {isUrdu ? 'لاگ ان کریں' : 'Sign In'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
