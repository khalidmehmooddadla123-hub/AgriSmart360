import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import i18n, { LANGUAGES } from '../lib/i18n';
import {
  TrendingUp, CloudSun, ShoppingBag, Leaf,
  MessageCircle, BrainCircuit, Globe, ChevronDown,
  ArrowLeft, ArrowRight, Sprout, Users, MapPin,
} from 'lucide-react';

const features = [
  {
    icon: TrendingUp,
    titleUr: 'فصل کی قیمتیں',
    titleEn: 'Crop Prices',
    descUr: 'روزانہ اپ ڈیٹ شدہ پاکستان و عالمی منڈیوں کی قیمتیں',
    descEn: 'Daily updated Pakistan & global market prices',
    color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
  },
  {
    icon: CloudSun,
    titleUr: 'موسمی پیشگوئی',
    titleEn: 'Weather Forecast',
    descUr: '7 دن کی موسمی پیشگوئی اور زرعی مشورے',
    descEn: '7-day weather forecast with farming advice',
    color: 'bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300',
  },
  {
    icon: ShoppingBag,
    titleUr: 'آن لائن بازار',
    titleEn: 'Online Marketplace',
    descUr: 'فصل براہ راست خریداروں کو بیچیں',
    descEn: 'Sell crops directly to buyers',
    color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
  },
  {
    icon: Leaf,
    titleUr: 'بیماری تشخیص',
    titleEn: 'Disease Detection',
    descUr: 'AI سے فصل کی بیماری کی فوری تشخیص',
    descEn: 'AI-powered instant crop disease detection',
    color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
  },
  {
    icon: MessageCircle,
    titleUr: 'AI مددگار',
    titleEn: 'AI Assistant',
    descUr: 'اردو میں زرعی سوالات کے جوابات',
    descEn: 'Agricultural Q&A in Urdu',
    color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
  },
  {
    icon: BrainCircuit,
    titleUr: 'زرعی مشورہ',
    titleEn: 'Agricultural Advisory',
    descUr: 'ماہرین سے رابطہ اور زرعی رہنمائی',
    descEn: 'Expert guidance and agricultural advisory',
    color: 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300',
  },
];

const stats = [
  { valueUr: '50,000+', valueEn: '50,000+', labelUr: 'رجسٹرڈ کسان', labelEn: 'Registered Farmers' },
  { valueUr: '150+', valueEn: '150+', labelUr: 'منڈیاں', labelEn: 'Markets Covered' },
  { valueUr: '4', valueEn: '4', labelUr: 'صوبے', labelEn: 'Provinces' },
  { valueUr: '24/7', valueEn: '24/7', labelUr: 'آن لائن سپورٹ', labelEn: 'Online Support' },
];

export default function LandingPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [langOpen, setLangOpen] = useState(false);
  const isRTL = document.documentElement.dir === 'rtl';

  // Redirect logged-in users to the app
  useEffect(() => {
    if (user) {
      navigate('/app');
    }
    // Also check demo user
    const demoData = localStorage.getItem('demo_user');
    if (demoData) {
      try {
        const parsed = JSON.parse(demoData);
        if (parsed.expiresAt && Date.now() < parsed.expiresAt) {
          navigate('/app');
        }
      } catch {
        // ignore
      }
    }
  }, [user, navigate]);

  const handleLangChange = (code: string, dir: string) => {
    i18n.changeLanguage(code);
    localStorage.setItem('agrismart_lang', code);
    document.documentElement.dir = dir;
    document.documentElement.lang = code;
    setLangOpen(false);
  };

  const currentLang = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0];
  const isUrdu = i18n.language === 'ur';

  return (
    <div className="min-h-screen bg-agri-bg dark:bg-agri-dark">
      {/* ── HEADER ── */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-40 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-md">
              <Sprout className="text-white w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-primary text-base leading-none">AgriSmart 360</h1>
              <p className="text-xs text-gray-500 font-urdu leading-none mt-0.5">
                {isUrdu ? 'پاکستانی کسانوں کا ساتھی' : "Farmers' Digital Companion"}
              </p>
            </div>
          </div>

          {/* Nav actions */}
          <div className="flex items-center gap-2">
            {/* Language toggle */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <Globe size={15} />
                <span className="hidden sm:inline">{currentLang.name}</span>
                <ChevronDown size={13} />
              </button>
              {langOpen && (
                <div className="absolute end-0 mt-1 w-36 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
                  {LANGUAGES.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => handleLangChange(lang.code, lang.dir)}
                      className={`w-full text-start px-4 py-2.5 text-sm hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:text-primary transition-colors
                        ${lang.code === i18n.language ? 'text-primary font-semibold bg-primary-50 dark:bg-primary-900/30' : 'text-gray-700 dark:text-gray-200'}`}
                      dir={lang.dir}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Link
              to="/login"
              className="px-4 py-2 text-sm font-semibold text-primary border border-primary rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
            >
              {t('login')}
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 text-sm font-semibold bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
            >
              {t('register')}
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-800 via-primary-700 to-primary-900 text-white">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>

        {/* Decorative circles */}
        <div className="absolute -top-20 -end-20 w-96 h-96 bg-white/5 rounded-full" />
        <div className="absolute top-1/2 -start-10 w-64 h-64 bg-white/5 rounded-full" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <span className="inline-block bg-white/15 backdrop-blur-sm border border-white/20 text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
              🌾 {isUrdu ? 'پاکستان کی نمبر 1 زرعی ایپ' : "Pakistan's #1 Agriculture App"}
            </span>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-4">
              {isUrdu ? (
                <span className="font-urdu">
                  ڈیجیٹل زراعت کا<br />
                  <span className="text-yellow-300">نیا دور</span>
                </span>
              ) : (
                <>
                  The New Era of<br />
                  <span className="text-yellow-300">Digital Farming</span>
                </>
              )}
            </h1>

            <p className="text-lg sm:text-xl text-white/80 mb-8 leading-relaxed font-urdu max-w-2xl mx-auto">
              {isUrdu
                ? 'AgriSmart 360 – پاکستانی کسانوں کے لیے ایک مکمل ڈیجیٹل پلیٹ فارم۔ قیمتیں، موسم، بازار، بیماری تشخیص اور AI مشورے – سب کچھ ایک جگہ۔'
                : 'AgriSmart 360 – A complete digital platform for Pakistani farmers. Prices, weather, marketplace, disease detection and AI advice – all in one place.'}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Link
                to="/register"
                className="group flex items-center gap-2 bg-white text-primary-800 font-bold px-8 py-3.5 rounded-xl hover:bg-yellow-300 hover:text-primary-900 transition-all duration-200 shadow-lg hover:shadow-xl text-base w-full sm:w-auto justify-center"
              >
                <Sprout size={18} />
                {isUrdu ? 'ابھی رجسٹر کریں' : 'Register Now'}
                {isRTL ? <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> : <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
              </Link>
              <Link
                to="/login"
                className="flex items-center gap-2 border-2 border-white/60 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/10 hover:border-white transition-all duration-200 text-base w-full sm:w-auto justify-center"
              >
                {isUrdu ? 'لاگ ان کریں' : 'Sign In'}
              </Link>
            </div>

            {/* Demo link */}
            <p className="mt-4 text-white/60 text-sm">
              {isUrdu ? 'آزمانا چاہتے ہیں؟ ' : 'Want to try first? '}
              <Link to="/login" className="text-yellow-300 hover:text-yellow-200 font-medium underline underline-offset-2">
                {isUrdu ? 'ڈیمو موڈ' : 'Demo Mode'}
              </Link>
            </p>
          </div>
        </div>

        {/* Wave bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" className="w-full fill-agri-bg dark:fill-agri-dark">
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" />
          </svg>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 rounded-2xl p-5 text-center shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
            >
              <p className="text-3xl font-extrabold text-primary mb-1">
                {isUrdu ? stat.valueUr : stat.valueEn}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-urdu">
                {isUrdu ? stat.labelUr : stat.labelEn}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-3 font-urdu">
            {isUrdu ? 'ہماری خصوصیات' : 'Our Features'}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto font-urdu">
            {isUrdu
              ? 'کسانوں کی ضروریات کو مدنظر رکھتے ہوئے بنایا گیا ایک مکمل پلیٹ فارم'
              : 'A complete platform designed with farmers\' needs in mind'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md hover:-translate-y-1 transition-all duration-200 group"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${feature.color}`}>
                <feature.icon size={22} />
              </div>
              <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-2 font-urdu text-lg">
                {isUrdu ? feature.titleUr : feature.titleEn}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed font-urdu">
                {isUrdu ? feature.descUr : feature.descEn}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="bg-primary-50 dark:bg-primary-900/20 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-3 font-urdu">
              {isUrdu ? 'شروع کرنا آسان ہے' : 'Getting Started is Easy'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Connecting line (LTR) */}
            <div className="hidden md:block absolute top-10 start-1/6 end-1/6 h-0.5 bg-primary-200 dark:bg-primary-700" />

            {[
              { step: '01', iconUr: 'رجسٹریشن', iconEn: 'Register', descUr: 'اپنی معلومات درج کریں اور مفت اکاؤنٹ بنائیں', descEn: 'Enter your details and create a free account', icon: Users },
              { step: '02', iconUr: 'علاقہ منتخب کریں', iconEn: 'Select Region', descUr: 'اپنا صوبہ، ضلع اور شہر منتخب کریں', descEn: 'Select your province, district and city', icon: MapPin },
              { step: '03', iconUr: 'فائدہ اٹھائیں', iconEr: 'Benefit', descUr: 'قیمتیں، موسم اور AI مشورے سے فائدہ اٹھائیں', descEn: 'Benefit from prices, weather and AI advice', icon: Sprout },
            ].map((item, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center relative shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-md relative z-10">
                  <item.icon size={24} className="text-white" />
                </div>
                <span className="text-xs font-bold text-primary/50 tracking-widest">{item.step}</span>
                <h3 className="font-bold text-gray-800 dark:text-gray-100 mt-1 mb-2 font-urdu text-lg">
                  {isUrdu ? item.iconUr : item.iconEn}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed font-urdu">
                  {isUrdu ? item.descUr : item.descEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="bg-gradient-to-br from-primary-700 to-primary-900 rounded-3xl p-10 text-center text-white relative overflow-hidden">
          <div className="absolute -top-10 -end-10 w-64 h-64 bg-white/5 rounded-full" />
          <div className="absolute -bottom-10 -start-10 w-48 h-48 bg-white/5 rounded-full" />
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 font-urdu">
              {isUrdu ? 'آج ہی شامل ہوں' : 'Join Today'}
            </h2>
            <p className="text-white/80 mb-8 text-lg max-w-xl mx-auto font-urdu">
              {isUrdu
                ? 'ہزاروں کسانوں کے ساتھ AgriSmart 360 کا حصہ بنیں اور اپنی زراعت کو جدید بنائیں۔'
                : 'Join thousands of farmers on AgriSmart 360 and modernize your farming.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/register"
                className="bg-white text-primary-800 font-bold px-8 py-3.5 rounded-xl hover:bg-yellow-300 hover:text-primary-900 transition-all duration-200 shadow-lg text-base"
              >
                {isUrdu ? '✨ مفت رجسٹریشن' : '✨ Free Registration'}
              </Link>
              <Link
                to="/login"
                className="border-2 border-white/60 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/10 hover:border-white transition-all duration-200 text-base"
              >
                {isUrdu ? 'لاگ ان' : 'Sign In'}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-gray-800 dark:bg-gray-950 text-gray-300 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Sprout size={16} className="text-white" />
            </div>
            <span className="font-bold text-white text-lg">AgriSmart 360</span>
          </div>
          <p className="text-sm font-urdu text-gray-400 mb-4">
            {isUrdu ? 'پاکستانی کسانوں کا ڈیجیٹل ساتھی' : "Pakistan Farmers' Digital Companion"}
          </p>
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} AgriSmart 360. {isUrdu ? 'تمام حقوق محفوظ ہیں۔' : 'All rights reserved.'}
          </p>
        </div>
      </footer>
    </div>
  );
}
