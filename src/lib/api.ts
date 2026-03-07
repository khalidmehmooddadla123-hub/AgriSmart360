import axios from 'axios';

// NOTE: VITE_OPENWEATHER_API_KEY is exposed client-side (prefixed with VITE_).
// OpenWeather free tier allows CORS requests from browsers.
// For production with paid plans, proxy via a backend/edge function to protect the key.
const OPENWEATHER_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || '';

export interface ForecastDay {
  day: string;
  dayUrdu: string;
  temp: number;
  tempMin: number;
  rain: number;
  icon: string;
  description: string;
}

export async function fetchWeather(city: string) {
  if (!OPENWEATHER_KEY) {
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

const URDU_DAYS: Record<string, string> = {
  Sunday: 'اتوار',
  Monday: 'پیر',
  Tuesday: 'منگل',
  Wednesday: 'بدھ',
  Thursday: 'جمعرات',
  Friday: 'جمعہ',
  Saturday: 'ہفتہ',
};

// Fetch 5-day forecast (3-hour intervals → aggregated per day)
export async function fetchWeatherForecast(city: string): Promise<ForecastDay[]> {
  const mockForecast: ForecastDay[] = Array.from({ length: 5 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dayName = d.toLocaleDateString('en-US', { weekday: 'long' });
    return {
      day: i === 0 ? 'Today' : dayName,
      dayUrdu: i === 0 ? 'آج' : URDU_DAYS[dayName] || dayName,
      temp: 26 + Math.round(Math.sin(i) * 4),
      tempMin: 18 + Math.round(Math.sin(i) * 3),
      rain: [10, 60, 30, 15, 40][i] || 20,
      icon: ['01d', '10d', '03d', '01d', '04d'][i] || '01d',
      description: ['Clear sky', 'Rain', 'Cloudy', 'Sunny', 'Overcast'][i] || 'Clear',
    };
  });

  if (!OPENWEATHER_KEY) return mockForecast;

  try {
    const res = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${OPENWEATHER_KEY}&units=metric&cnt=40`
    );
    const list: Array<{
      dt: number;
      main: { temp: number; temp_min: number };
      weather: Array<{ description: string; icon: string }>;
      rain?: { '3h': number };
      pop: number;
    }> = res.data.list;

    // Group by calendar day
    const byDay = new Map<string, typeof list>();
    for (const item of list) {
      const dateKey = new Date(item.dt * 1000).toLocaleDateString('en-CA');
      if (!byDay.has(dateKey)) byDay.set(dateKey, []);
      byDay.get(dateKey)!.push(item);
    }

    const today = new Date().toLocaleDateString('en-CA');
    const forecastDays: ForecastDay[] = [];
    for (const [dateKey, items] of byDay) {
      if (forecastDays.length >= 7) break;
      const maxTemp = Math.round(Math.max(...items.map(x => x.main.temp)));
      const minTemp = Math.round(Math.min(...items.map(x => x.main.temp_min)));
      const maxRain = Math.round(Math.max(...items.map(x => x.pop * 100)));
      const midItem = items[Math.floor(items.length / 2)];
      const date = new Date(dateKey + 'T12:00:00');
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
      forecastDays.push({
        day: dateKey === today ? 'Today' : dayName,
        dayUrdu: dateKey === today ? 'آج' : URDU_DAYS[dayName] || dayName,
        temp: maxTemp,
        tempMin: minTemp,
        rain: maxRain,
        icon: midItem.weather[0].icon,
        description: midItem.weather[0].description,
      });
    }
    return forecastDays.length > 0 ? forecastDays : mockForecast;
  } catch {
    return mockForecast;
  }
}

// Hourly temperature from forecast data
export interface HourlyPoint {
  time: string;
  temp: number;
}

export async function fetchHourlyForecast(city: string): Promise<HourlyPoint[]> {
  const fallback = [
    { time: '6AM', temp: 22 }, { time: '9AM', temp: 25 }, { time: '12PM', temp: 28 },
    { time: '3PM', temp: 31 }, { time: '6PM', temp: 29 }, { time: '9PM', temp: 24 },
  ];
  if (!OPENWEATHER_KEY) return fallback;
  try {
    const res = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${OPENWEATHER_KEY}&units=metric&cnt=8`
    );
    const list: Array<{ dt: number; main: { temp: number } }> = res.data.list;
    return list.slice(0, 8).map(item => {
      const date = new Date(item.dt * 1000);
      const hours = date.getHours();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const h = hours % 12 || 12;
      return { time: `${h}${ampm}`, temp: Math.round(item.main.temp) };
    });
  } catch {
    return fallback;
  }
}

// Dynamic Pakistan Mandi prices – base prices updated with realistic hourly variation
const BASE_PAKISTAN_CROPS = [
  { id: '1', name: 'Wheat', nameUrdu: 'گندم', basePrice: 3800, unit: 'per 40kg', market: 'Lahore Mandi', location: 'Lahore', volatility: 0.02 },
  { id: '2', name: 'Rice (Basmati)', nameUrdu: 'باسمتی چاول', basePrice: 7500, unit: 'per 40kg', market: 'Gujranwala Mandi', location: 'Gujranwala', volatility: 0.025 },
  { id: '3', name: 'Cotton', nameUrdu: 'کپاس', basePrice: 8200, unit: 'per 40kg', market: 'Multan Mandi', location: 'Multan', volatility: 0.03 },
  { id: '4', name: 'Sugarcane', nameUrdu: 'گنا', basePrice: 350, unit: 'per 40kg', market: 'Faisalabad Mandi', location: 'Faisalabad', volatility: 0.01 },
  { id: '5', name: 'Corn/Maize', nameUrdu: 'مکئی', basePrice: 2800, unit: 'per 40kg', market: 'Sahiwal Mandi', location: 'Sahiwal', volatility: 0.035 },
  { id: '6', name: 'Tomato', nameUrdu: 'ٹماٹر', basePrice: 1200, unit: 'per 40kg', market: 'Karachi Sabzi Mandi', location: 'Karachi', volatility: 0.08 },
  { id: '7', name: 'Onion', nameUrdu: 'پیاز', basePrice: 900, unit: 'per 40kg', market: 'Quetta Mandi', location: 'Quetta', volatility: 0.07 },
  { id: '8', name: 'Potato', nameUrdu: 'آلو', basePrice: 1100, unit: 'per 40kg', market: 'Peshawar Mandi', location: 'Peshawar', volatility: 0.05 },
  { id: '9', name: 'Mustard', nameUrdu: 'سرسوں', basePrice: 6200, unit: 'per 40kg', market: 'Rawalpindi Mandi', location: 'Rawalpindi', volatility: 0.03 },
  { id: '10', name: 'Mango', nameUrdu: 'آم', basePrice: 4500, unit: 'per 40kg', market: 'Multan Mandi', location: 'Multan', volatility: 0.06 },
];

// Seed-based deterministic variation so it looks consistent within the same hour
function getHourlyVariation(seed: number, hourSeed: number): number {
  const x = Math.sin(seed * 127.1 + hourSeed * 311.7) * 43758.5453;
  return (x - Math.floor(x)) * 2 - 1; // -1 to +1
}

export function getPakistanMarketPrices() {
  const now = new Date();
  const hourSeed = now.getFullYear() * 100000 + (now.getMonth() + 1) * 1000 + now.getDate() * 24 + now.getHours();

  return BASE_PAKISTAN_CROPS.map((crop, idx) => {
    const variation = getHourlyVariation(idx, hourSeed);
    const change = Math.round(crop.basePrice * crop.volatility * variation);
    const price = crop.basePrice + change;
    const changePercent = parseFloat(((change / crop.basePrice) * 100).toFixed(1));
    return {
      id: crop.id,
      name: crop.name,
      nameUrdu: crop.nameUrdu,
      price,
      unit: crop.unit,
      change,
      changePercent,
      market: crop.market,
      location: crop.location,
      updatedAt: now.toISOString(),
    };
  });
}

// Keep PAKISTAN_CROPS as a static export for backward compatibility
export const PAKISTAN_CROPS = getPakistanMarketPrices();

// Global commodity prices – live-like variation
const BASE_GLOBAL_CROPS = [
  { id: 'g1', name: 'Wheat', nameUrdu: 'گندم', basePrice: 218, unit: 'USD/ton', market: 'Chicago Board of Trade', location: 'Global', volatility: 0.015 },
  { id: 'g2', name: 'Rice', nameUrdu: 'چاول', basePrice: 445, unit: 'USD/ton', market: 'FAO Index', location: 'Global', volatility: 0.012 },
  { id: 'g3', name: 'Corn', nameUrdu: 'مکئی', basePrice: 185, unit: 'USD/ton', market: 'CBOT', location: 'Global', volatility: 0.02 },
  { id: 'g4', name: 'Cotton', nameUrdu: 'کپاس', basePrice: 0.82, unit: 'USD/lb', market: 'ICE Futures', location: 'Global', volatility: 0.018 },
  { id: 'g5', name: 'Sugar', nameUrdu: 'چینی', basePrice: 0.19, unit: 'USD/lb', market: 'ICE No.11', location: 'Global', volatility: 0.025 },
  { id: 'g6', name: 'Soybeans', nameUrdu: 'سویا بین', basePrice: 375, unit: 'USD/ton', market: 'CBOT', location: 'Global', volatility: 0.02 },
];

export function getGlobalMarketPrices() {
  const now = new Date();
  const hourSeed = now.getFullYear() * 100000 + (now.getMonth() + 1) * 1000 + now.getDate() * 24 + now.getHours();

  return BASE_GLOBAL_CROPS.map((crop, idx) => {
    const variation = getHourlyVariation(idx + 20, hourSeed);
    const rawChange = crop.basePrice * crop.volatility * variation;
    const isSmall = crop.basePrice < 10;
    const change = isSmall ? parseFloat(rawChange.toFixed(3)) : Math.round(rawChange);
    const price = isSmall
      ? parseFloat((crop.basePrice + rawChange).toFixed(3))
      : crop.basePrice + (change as number);
    const changePercent = parseFloat(((rawChange / crop.basePrice) * 100).toFixed(1));
    return {
      id: crop.id,
      name: crop.name,
      nameUrdu: crop.nameUrdu,
      price,
      unit: crop.unit,
      change,
      changePercent,
      market: crop.market,
      location: crop.location,
      updatedAt: now.toISOString(),
    };
  });
}

export const GLOBAL_CROPS = getGlobalMarketPrices();

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
