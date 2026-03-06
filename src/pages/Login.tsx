import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff, Loader, ArrowLeft } from 'lucide-react';
import i18n from '../lib/i18n';

export default function Login() {
  const { signInWithEmail, signInWithGoogle, signInWithPhone, verifyOTP } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [tab, setTab] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isUrdu = i18n.language === 'ur';

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await signInWithEmail(email, password);
    if (error) {
      setError(isUrdu
        ? 'ای میل یا پاس ورڈ غلط ہے۔ براہ کرم دوبارہ کوشش کریں۔'
        : 'Invalid email or password. Please try again.');
    } else {
      navigate('/app');
    }
    setLoading(false);
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    if (!otpSent) {
      const { error } = await signInWithPhone(phone);
      if (error) {
        setError(isUrdu
          ? 'فون نمبر غلط ہے یا SMS بھیجنے میں مسئلہ ہوا۔ Supabase میں Phone Auth فعال کریں۔'
          : 'Invalid phone number or SMS sending failed. Enable Phone Auth in Supabase.');
      } else {
        setOtpSent(true);
      }
    } else {
      const { error } = await verifyOTP(phone, otp);
      if (error) {
        setError(isUrdu ? 'OTP غلط ہے۔ دوبارہ کوشش کریں۔' : 'Invalid OTP. Please try again.');
      } else {
        navigate('/app');
      }
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    setLoading(true);
    setError('');
    const { error } = await signInWithGoogle();
    if (error) {
      setError(isUrdu
        ? 'Google لاگ ان ناکام۔ Supabase Dashboard میں Google OAuth ترتیب دیں۔'
        : 'Google login failed. Configure Google OAuth in Supabase Dashboard.');
    }
    setLoading(false);
  };

  // Demo login for testing without Supabase
  const handleDemoLogin = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    const demoSession = {
      id: 'demo-user-1',
      name: 'کسان علی',
      email: 'demo@agrismart360.pk',
      role: 'farmer',
      expiresAt: Date.now() + 24 * 60 * 60 * 1000,
    };
    localStorage.setItem('demo_user', JSON.stringify(demoSession));
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
            {t('tagline')}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-1 font-urdu">
            {isUrdu ? 'لاگ ان کریں' : 'Sign In'}
          </h2>
          <p className="text-gray-500 text-sm mb-5">
            {isUrdu ? 'اپنے اکاؤنٹ میں داخل ہوں' : 'Sign in to your account'}
          </p>

          {/* Tabs */}
          <div className="flex gap-2 mb-5">
            <button
              onClick={() => { setTab('email'); setError(''); }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'email' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}
            >
              📧 {isUrdu ? 'ای میل' : 'Email'}
            </button>
            <button
              onClick={() => { setTab('phone'); setError(''); }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'phone' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}
            >
              📱 {isUrdu ? 'فون' : 'Phone'}
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg px-4 py-2 mb-4 font-urdu leading-relaxed">
              ⚠️ {error}
            </div>
          )}

          {/* Email Form */}
          {tab === 'email' && (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-300 mb-1 block font-urdu">
                  {t('email')}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="input-field"
                  placeholder="email@example.com"
                  dir="ltr"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-300 mb-1 block font-urdu">
                  {t('password')}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className="input-field pe-10"
                    placeholder="••••••••"
                    dir="ltr"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                {loading && <Loader size={16} className="animate-spin" />}
                {isUrdu ? 'لاگ ان' : 'Sign In'}
              </button>
            </form>
          )}

          {/* Phone Form */}
          {tab === 'phone' && (
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-300 mb-1 block font-urdu">
                  {t('phone')}
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  required
                  disabled={otpSent}
                  className="input-field"
                  placeholder="+923001234567"
                  dir="ltr"
                />
              </div>
              {otpSent && (
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-300 mb-1 block font-urdu">
                    {t('enterOTP')}
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={e => setOtp(e.target.value)}
                    required
                    className="input-field"
                    placeholder="123456"
                    maxLength={6}
                    dir="ltr"
                  />
                  <p className="text-xs text-gray-500 mt-1 font-urdu">
                    {isUrdu ? 'آپ کے فون پر OTP بھیجا گیا' : 'OTP sent to your phone'}
                  </p>
                </div>
              )}
              <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                {loading && <Loader size={16} className="animate-spin" />}
                {otpSent
                  ? (isUrdu ? 'OTP تصدیق کریں' : 'Verify OTP')
                  : (isUrdu ? 'OTP بھیجیں' : 'Send OTP')}
              </button>
            </form>
          )}

          <div className="my-4 flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-600" />
            <span className="text-gray-400 text-xs">{isUrdu ? 'یا' : 'or'}</span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-600" />
          </div>

          {/* Google Login */}
          <button
            onClick={handleGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 border border-gray-300 dark:border-gray-600 rounded-lg py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors mb-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            {isUrdu ? 'Google سے لاگ ان' : 'Continue with Google'}
          </button>

          {/* Demo Login */}
          <button
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 border border-primary-200 bg-primary-50 dark:bg-primary-900/20 rounded-lg py-2.5 text-sm font-medium text-primary hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
          >
            �� {isUrdu ? 'ڈیمو موڈ (بغیر رجسٹریشن)' : 'Demo Mode (No Registration)'}
          </button>

          <p className="text-center text-sm text-gray-500 mt-4 font-urdu">
            {isUrdu ? 'اکاؤنٹ نہیں ہے؟' : "Don't have an account?"}{' '}
            <Link to="/register" className="text-primary font-semibold hover:text-primary-700">
              {isUrdu ? 'رجسٹر کریں' : 'Register'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
