import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const urResources = {
  translation: {
    // Navigation
    dashboard: 'ڈیش بورڈ',
    prices: 'فصل کی قیمتیں',
    weather: 'موسم',
    marketplace: 'بازار',
    disease: 'بیماری کی تشخیص',
    news: 'زرعی خبریں',
    land: 'زمین اور جائیداد',
    complaint: 'شکایت',
    profile: 'پروفائل',
    history: 'تاریخ',
    eco: 'ماحول دوست زراعت',
    advisory: 'زرعی مشورہ',
    notifications: 'اطلاعات',
    chat: 'AI مددگار',
    logout: 'لاگ آؤٹ',
    login: 'لاگ ان',
    register: 'رجسٹر',
    
    // Common
    loading: 'لوڈ ہو رہا ہے...',
    error: 'خرابی',
    success: 'کامیاب',
    save: 'محفوظ کریں',
    cancel: 'منسوخ کریں',
    submit: 'جمع کریں',
    search: 'تلاش کریں',
    filter: 'فلٹر',
    all: 'سب',
    view: 'دیکھیں',
    edit: 'ترمیم',
    delete: 'حذف کریں',
    
    // Auth
    email: 'ای میل',
    password: 'پاس ورڈ',
    phone: 'فون نمبر',
    name: 'نام',
    loginWithGoogle: 'گوگل سے لاگ ان',
    loginWithPhone: 'فون سے لاگ ان',
    enterOTP: 'OTP درج کریں',
    forgotPassword: 'پاس ورڈ بھول گئے؟',
    noAccount: 'اکاؤنٹ نہیں ہے؟',
    hasAccount: 'اکاؤنٹ ہے؟',
    
    // Dashboard
    welcomeBack: 'خوش آمدید',
    todayPrices: 'آج کی قیمتیں',
    weatherAlert: 'موسمی انتباہ',
    marketTrend: 'بازار کا رجحان',
    recentActivity: 'حالیہ سرگرمی',
    
    // Prices
    globalPrices: 'عالمی قیمتیں',
    pakistanPrices: 'پاکستان مارکیٹ قیمتیں',
    selectProvince: 'صوبہ منتخب کریں',
    selectCity: 'شہر منتخب کریں',
    selectMarket: 'منڈی منتخب کریں',
    wheat: 'گندم',
    rice: 'چاول',
    cotton: 'کپاس',
    sugarcane: 'گنا',
    corn: 'مکئی',
    
    // Weather
    temperature: 'درجہ حرارت',
    humidity: 'نمی',
    windSpeed: 'ہوا کی رفتار',
    rainProbability: 'بارش کا امکان',
    
    // Chat
    askQuestion: 'سوال پوچھیں...',
    voiceInput: 'آواز سے پوچھیں',
    
    // Marketplace
    postListing: 'اشتہار دیں',
    myListings: 'میرے اشتہار',
    cropName: 'فصل کا نام',
    quantity: 'مقدار',
    price: 'قیمت',
    location: 'مقام',
    quality: 'معیار',
    
    // Profile
    updateProfile: 'پروفائل اپ ڈیٹ کریں',
    city: 'شہر',
    province: 'صوبہ',
    country: 'ملک',
    farmSize: 'کھیت کا سائز',
    cropsGrown: 'اگائی گئی فصلیں',
    
    // Roles
    farmer: 'کسان',
    urban_farmer: 'شہری کسان',
    buyer: 'خریدار',
    agriculture_expert: 'زرعی ماہر',
    admin: 'ایڈمن',
    
    appName: 'ایگری اسمارٹ 360',
    tagline: 'پاکستانی کسانوں کا ڈیجیٹل ساتھی',
  }
};

const enResources = {
  translation: {
    // Navigation
    dashboard: 'Dashboard',
    prices: 'Crop Prices',
    weather: 'Weather',
    marketplace: 'Marketplace',
    disease: 'Disease Detection',
    news: 'Agriculture News',
    land: 'Land & Property',
    complaint: 'Complaints',
    profile: 'Profile',
    history: 'History',
    eco: 'Eco-Friendly Farming',
    advisory: 'Advisory',
    notifications: 'Notifications',
    chat: 'AI Assistant',
    logout: 'Logout',
    login: 'Login',
    register: 'Register',
    
    // Common
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    save: 'Save',
    cancel: 'Cancel',
    submit: 'Submit',
    search: 'Search',
    filter: 'Filter',
    all: 'All',
    view: 'View',
    edit: 'Edit',
    delete: 'Delete',
    
    // Auth
    email: 'Email',
    password: 'Password',
    phone: 'Phone Number',
    name: 'Name',
    loginWithGoogle: 'Login with Google',
    loginWithPhone: 'Login with Phone',
    enterOTP: 'Enter OTP',
    forgotPassword: 'Forgot Password?',
    noAccount: "Don't have an account?",
    hasAccount: 'Already have an account?',
    
    // Dashboard
    welcomeBack: 'Welcome back',
    todayPrices: "Today's Prices",
    weatherAlert: 'Weather Alert',
    marketTrend: 'Market Trend',
    recentActivity: 'Recent Activity',
    
    // Prices
    globalPrices: 'Global Prices',
    pakistanPrices: 'Pakistan Market Prices',
    selectProvince: 'Select Province',
    selectCity: 'Select City',
    selectMarket: 'Select Market',
    wheat: 'Wheat',
    rice: 'Rice',
    cotton: 'Cotton',
    sugarcane: 'Sugarcane',
    corn: 'Corn',
    
    // Weather
    temperature: 'Temperature',
    humidity: 'Humidity',
    windSpeed: 'Wind Speed',
    rainProbability: 'Rain Probability',
    
    // Chat
    askQuestion: 'Ask a question...',
    voiceInput: 'Ask with voice',
    
    // Marketplace
    postListing: 'Post Listing',
    myListings: 'My Listings',
    cropName: 'Crop Name',
    quantity: 'Quantity',
    price: 'Price',
    location: 'Location',
    quality: 'Quality',
    
    // Profile
    updateProfile: 'Update Profile',
    city: 'City',
    province: 'Province',
    country: 'Country',
    farmSize: 'Farm Size',
    cropsGrown: 'Crops Grown',
    
    // Roles
    farmer: 'Farmer',
    urban_farmer: 'Urban Farmer',
    buyer: 'Buyer',
    agriculture_expert: 'Agriculture Expert',
    admin: 'Admin',
    
    appName: 'AgriSmart 360',
    tagline: "Pakistan Farmers' Digital Companion",
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      ur: urResources,
      en: enResources,
    },
    lng: localStorage.getItem('agrismart_lang') || 'ur',
    fallbackLng: 'ur',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;

export const LANGUAGES = [
  { code: 'ur', name: 'اردو', dir: 'rtl' },
  { code: 'en', name: 'English', dir: 'ltr' },
];
