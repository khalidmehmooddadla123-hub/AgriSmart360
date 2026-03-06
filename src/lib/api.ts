import axios from 'axios';

// NOTE: VITE_OPENWEATHER_API_KEY is exposed client-side (prefixed with VITE_).
// OpenWeather free tier allows CORS requests from browsers.
// For production with paid plans, proxy via a backend/edge function to protect the key.
const OPENWEATHER_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || '';

export async function fetchWeather(city: string) {
  if (!OPENWEATHER_KEY) {
    // Return mock data when no API key
    return {
      city,
      temperature: 28,
      feelsLike: 30,
      humidity: 65,
      windSpeed: 12,
      rainProbability: 20,
      description: 'Partly Cloudy',
      icon: '02d',
      sprayRecommendation: 'موسم سپرے کے لیے مناسب ہے',
    };
  }
  try {
    const res = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${OPENWEATHER_KEY}&units=metric`
    );
    const d = res.data;
    return {
      city,
      temperature: Math.round(d.main.temp),
      feelsLike: Math.round(d.main.feels_like),
      humidity: d.main.humidity,
      windSpeed: Math.round(d.wind.speed),
      rainProbability: d.rain ? 80 : 10,
      description: d.weather[0].description,
      icon: d.weather[0].icon,
      sprayRecommendation: d.rain ? 'بارش متوقع ہے، سپرے نہ کریں' : 'موسم سپرے کے لیے مناسب ہے',
    };
  } catch {
    return {
      city,
      temperature: 28,
      feelsLike: 30,
      humidity: 65,
      windSpeed: 12,
      rainProbability: 20,
      description: 'Partly Cloudy',
      icon: '02d',
      sprayRecommendation: 'موسم سپرے کے لیے مناسب ہے',
    };
  }
}

// Mock Pakistan Mandi prices (in production: use PBS or PARC API)
export const PAKISTAN_CROPS = [
  { id: '1', name: 'Wheat', nameUrdu: 'گندم', price: 3800, unit: 'per 40kg', change: 50, changePercent: 1.3, market: 'Lahore Mandi', location: 'Lahore', updatedAt: new Date().toISOString() },
  { id: '2', name: 'Rice (Basmati)', nameUrdu: 'باسمتی چاول', price: 7500, unit: 'per 40kg', change: -100, changePercent: -1.3, market: 'Gujranwala Mandi', location: 'Gujranwala', updatedAt: new Date().toISOString() },
  { id: '3', name: 'Cotton', nameUrdu: 'کپاس', price: 8200, unit: 'per 40kg', change: 200, changePercent: 2.5, market: 'Multan Mandi', location: 'Multan', updatedAt: new Date().toISOString() },
  { id: '4', name: 'Sugarcane', nameUrdu: 'گنا', price: 350, unit: 'per 40kg', change: 0, changePercent: 0, market: 'Faisalabad Mandi', location: 'Faisalabad', updatedAt: new Date().toISOString() },
  { id: '5', name: 'Corn/Maize', nameUrdu: 'مکئی', price: 2800, unit: 'per 40kg', change: 150, changePercent: 5.6, market: 'Sahiwal Mandi', location: 'Sahiwal', updatedAt: new Date().toISOString() },
  { id: '6', name: 'Tomato', nameUrdu: 'ٹماٹر', price: 1200, unit: 'per 40kg', change: -200, changePercent: -14.3, market: 'Karachi Sabzi Mandi', location: 'Karachi', updatedAt: new Date().toISOString() },
  { id: '7', name: 'Onion', nameUrdu: 'پیاز', price: 900, unit: 'per 40kg', change: 100, changePercent: 12.5, market: 'Quetta Mandi', location: 'Quetta', updatedAt: new Date().toISOString() },
  { id: '8', name: 'Potato', nameUrdu: 'آلو', price: 1100, unit: 'per 40kg', change: 50, changePercent: 4.8, market: 'Peshawar Mandi', location: 'Peshawar', updatedAt: new Date().toISOString() },
  { id: '9', name: 'Mustard', nameUrdu: 'سرسوں', price: 6200, unit: 'per 40kg', change: 300, changePercent: 5.1, market: 'Rawalpindi Mandi', location: 'Rawalpindi', updatedAt: new Date().toISOString() },
  { id: '10', name: 'Mango', nameUrdu: 'آم', price: 4500, unit: 'per 40kg', change: -500, changePercent: -10, market: 'Multan Mandi', location: 'Multan', updatedAt: new Date().toISOString() },
];

// Mock global prices
export const GLOBAL_CROPS = [
  { id: 'g1', name: 'Wheat', nameUrdu: 'گندم', price: 218, unit: 'USD/ton', change: 2.5, changePercent: 1.1, market: 'Chicago Board of Trade', location: 'Global', updatedAt: new Date().toISOString() },
  { id: 'g2', name: 'Rice', nameUrdu: 'چاول', price: 445, unit: 'USD/ton', change: -5, changePercent: -1.1, market: 'FAO Index', location: 'Global', updatedAt: new Date().toISOString() },
  { id: 'g3', name: 'Corn', nameUrdu: 'مکئی', price: 185, unit: 'USD/ton', change: 3, changePercent: 1.6, market: 'CBOT', location: 'Global', updatedAt: new Date().toISOString() },
  { id: 'g4', name: 'Cotton', nameUrdu: 'کپاس', price: 0.82, unit: 'USD/lb', change: 0.01, changePercent: 1.2, market: 'ICE Futures', location: 'Global', updatedAt: new Date().toISOString() },
  { id: 'g5', name: 'Sugar', nameUrdu: 'چینی', price: 0.19, unit: 'USD/lb', change: -0.005, changePercent: -2.6, market: 'ICE No.11', location: 'Global', updatedAt: new Date().toISOString() },
  { id: 'g6', name: 'Soybeans', nameUrdu: 'سویا بین', price: 375, unit: 'USD/ton', change: 8, changePercent: 2.2, market: 'CBOT', location: 'Global', updatedAt: new Date().toISOString() },
];

export const PAKISTAN_PROVINCES = {
  'Punjab': ['Lahore', 'Faisalabad', 'Rawalpindi', 'Gujranwala', 'Multan', 'Sahiwal', 'Sargodha', 'Sialkot', 'Bahawalpur'],
  'Sindh': ['Karachi', 'Hyderabad', 'Sukkur', 'Larkana', 'Nawabshah'],
  'KPK': ['Peshawar', 'Mardan', 'Abbottabad', 'Swat', 'Kohat'],
  'Balochistan': ['Quetta', 'Turbat', 'Khuzdar', 'Hub'],
  'Gilgit-Baltistan': ['Gilgit', 'Skardu'],
  'AJK': ['Muzaffarabad', 'Mirpur'],
};

export const AGRICULTURE_NEWS: import('../types').NewsItem[] = [
  {
    id: '1',
    title: 'Government Announces New Subsidy for Wheat Farmers',
    titleUrdu: 'حکومت نے گندم کسانوں کے لیے نئی سبسڈی کا اعلان کیا',
    summary: 'The Ministry of National Food Security has announced a subsidy of PKR 500 per bag of urea fertilizer for registered farmers.',
    summaryUrdu: 'وزارت قومی غذائی تحفظ نے رجسٹرڈ کسانوں کے لیے یوریا کھاد کے ہر بیگ پر 500 روپے سبسڈی کا اعلان کیا ہے۔',
    source: 'Ministry of National Food Security & Research',
    category: 'subsidy',
    publishedAt: new Date(Date.now() - 86400000).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400',
  },
  {
    id: '2',
    title: 'New Drip Irrigation Scheme for Balochistan Farmers',
    titleUrdu: 'بلوچستان کے کسانوں کے لیے نئی ڈرپ آبپاشی اسکیم',
    summary: 'Government of Balochistan launches a PKR 2 billion drip irrigation scheme to help farmers save water.',
    summaryUrdu: 'بلوچستان حکومت نے کسانوں کو پانی بچانے میں مدد کے لیے 2 ارب روپے کی ڈرپ آبپاشی اسکیم شروع کی۔',
    source: 'Balochistan Agriculture Department',
    category: 'scheme',
    publishedAt: new Date(Date.now() - 172800000).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400',
  },
  {
    id: '3',
    title: 'Pakistan Wheat Production Forecast Revised Upward',
    titleUrdu: 'پاکستان میں گندم کی پیداوار کی پیش گوئی بڑھا دی گئی',
    summary: 'FAO revises Pakistan wheat production forecast to 27 million tonnes for 2025-26 season.',
    summaryUrdu: 'FAO نے 2025-26 سیزن کے لیے پاکستان کی گندم پیداوار کی پیش گوئی 27 ملین ٹن تک بڑھا دی۔',
    source: 'FAO Pakistan',
    category: 'general',
    publishedAt: new Date(Date.now() - 259200000).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400',
  },
  {
    id: '4',
    title: 'Water Policy Reform to Benefit Irrigation Farmers',
    titleUrdu: 'آبی پالیسی اصلاحات آبپاشی کسانوں کو فائدہ دیں گی',
    summary: 'New water policy includes priority water rights for agriculture during drought periods.',
    summaryUrdu: 'نئی آبی پالیسی میں قحط کے دوران زراعت کے لیے ترجیحی پانی کے حقوق شامل ہیں۔',
    source: 'Indus River System Authority',
    category: 'water',
    publishedAt: new Date(Date.now() - 345600000).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400',
  },
  {
    id: '5',
    title: 'PM Agriculture Package: Low-Interest Loans for Farmers',
    titleUrdu: 'وزیراعظم زراعت پیکج: کسانوں کے لیے کم سود قرضے',
    summary: 'Prime Minister announces PKR 100 billion agriculture support package with 7% subsidized loans.',
    summaryUrdu: 'وزیراعظم نے 7 فیصد سبسڈائزڈ قرضوں کے ساتھ 100 ارب روپے کا زرعی معاونت پیکج کا اعلان کیا۔',
    source: 'PM Office Pakistan',
    category: 'policy',
    publishedAt: new Date(Date.now() - 432000000).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1569880153113-76e33fc52d5f?w=400',
  },
];

export const ECO_TIPS = [
  {
    id: '1',
    title: 'Drip Irrigation',
    titleUrdu: 'ڈرپ آبپاشی',
    description: 'Save up to 60% water compared to flood irrigation. Install drip lines for vegetables and orchards.',
    descriptionUrdu: 'سیلاب آبپاشی کے مقابلے میں 60% تک پانی بچائیں۔ سبزیوں اور باغات کے لیے ڈرپ لائنیں لگائیں۔',
    icon: '💧',
    category: 'water',
  },
  {
    id: '2',
    title: 'Organic Fertilizers',
    titleUrdu: 'نامیاتی کھادیں',
    description: 'Use compost and farmyard manure to improve soil health and reduce chemical dependency.',
    descriptionUrdu: 'مٹی کی صحت بہتر بنانے اور کیمیائی انحصار کم کرنے کے لیے کمپوسٹ اور گوبر استعمال کریں۔',
    icon: '🌿',
    category: 'soil',
  },
  {
    id: '3',
    title: 'Crop Rotation',
    titleUrdu: 'فصل کی تبدیلی',
    description: 'Rotate crops to maintain soil nutrients and reduce pest and disease pressure naturally.',
    descriptionUrdu: 'قدرتی طور پر مٹی کے غذائی اجزاء کو برقرار رکھنے اور کیڑوں کے دباؤ کو کم کرنے کے لیے فصلیں بدلیں۔',
    icon: '🔄',
    category: 'soil',
  },
  {
    id: '4',
    title: 'Integrated Pest Management',
    titleUrdu: 'مربوط کیڑا انتظام',
    description: 'Use biological pest control methods before resorting to chemical pesticides.',
    descriptionUrdu: 'کیمیائی کیڑے مار دواؤں سے پہلے حیاتیاتی کیڑوں پر قابو پانے کے طریقے استعمال کریں۔',
    icon: '🐛',
    category: 'pest',
  },
  {
    id: '5',
    title: 'Solar Pumps',
    titleUrdu: 'شمسی پمپ',
    description: 'Replace diesel pumps with solar-powered pumps to reduce costs and carbon footprint.',
    descriptionUrdu: 'ڈیزل پمپوں کو شمسی توانائی سے چلنے والے پمپوں سے تبدیل کریں۔',
    icon: '☀️',
    category: 'energy',
  },
  {
    id: '6',
    title: 'Mulching',
    titleUrdu: 'ملچنگ',
    description: 'Cover soil with organic mulch to retain moisture, suppress weeds, and improve soil quality.',
    descriptionUrdu: 'نمی برقرار رکھنے اور جڑی بوٹیوں کو دبانے کے لیے مٹی کو نامیاتی ملچ سے ڈھانپیں۔',
    icon: '🍂',
    category: 'soil',
  },
];
