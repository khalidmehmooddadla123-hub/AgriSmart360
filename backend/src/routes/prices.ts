import { Router } from 'express';

const router = Router();

// Base Pakistan Mandi prices
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

// Global commodity prices
const BASE_GLOBAL_CROPS = [
  { id: 'g1', name: 'Wheat', nameUrdu: 'گندم', basePrice: 218, unit: 'USD/ton', market: 'Chicago Board of Trade', location: 'Global', volatility: 0.015 },
  { id: 'g2', name: 'Rice', nameUrdu: 'چاول', basePrice: 445, unit: 'USD/ton', market: 'FAO Index', location: 'Global', volatility: 0.012 },
  { id: 'g3', name: 'Corn', nameUrdu: 'مکئی', basePrice: 185, unit: 'USD/ton', market: 'CBOT', location: 'Global', volatility: 0.02 },
  { id: 'g4', name: 'Cotton', nameUrdu: 'کپاس', basePrice: 0.82, unit: 'USD/lb', market: 'ICE Futures', location: 'Global', volatility: 0.018 },
  { id: 'g5', name: 'Sugar', nameUrdu: 'چینی', basePrice: 0.19, unit: 'USD/lb', market: 'ICE No.11', location: 'Global', volatility: 0.025 },
  { id: 'g6', name: 'Soybeans', nameUrdu: 'سویا بین', basePrice: 375, unit: 'USD/ton', market: 'CBOT', location: 'Global', volatility: 0.02 },
];

function getHourlyVariation(seed: number, hourSeed: number): number {
  const x = Math.sin(seed * 127.1 + hourSeed * 311.7) * 43758.5453;
  return (x - Math.floor(x)) * 2 - 1;
}

function computePrices(baseCrops: typeof BASE_PAKISTAN_CROPS, isGlobal = false) {
  const now = new Date();
  const hourSeed = now.getFullYear() * 100000 + (now.getMonth() + 1) * 1000 + now.getDate() * 24 + now.getHours();

  return baseCrops.map((crop, idx) => {
    const variation = getHourlyVariation(idx + (isGlobal ? 20 : 0), hourSeed);
    const rawChange = crop.basePrice * crop.volatility * variation;
    const isSmall = crop.basePrice < 10;
    const change = isSmall ? parseFloat(rawChange.toFixed(3)) : Math.round(rawChange);
    const price = isSmall
      ? parseFloat((crop.basePrice + rawChange).toFixed(3))
      : crop.basePrice + change;
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

/**
 * GET /api/prices/pakistan
 * Returns Pakistan mandi crop prices with hourly variation.
 */
router.get('/pakistan', (_req, res) => {
  res.json(computePrices(BASE_PAKISTAN_CROPS));
});

/**
 * GET /api/prices/global
 * Returns global commodity prices with hourly variation.
 */
router.get('/global', (_req, res) => {
  res.json(computePrices(BASE_GLOBAL_CROPS, true));
});

/**
 * GET /api/prices/provinces
 * Returns province → city mappings for Pakistan.
 */
router.get('/provinces', (_req, res) => {
  res.json({
    Punjab: ['Lahore', 'Faisalabad', 'Rawalpindi', 'Gujranwala', 'Multan', 'Sahiwal', 'Sargodha', 'Sialkot', 'Bahawalpur'],
    Sindh: ['Karachi', 'Hyderabad', 'Sukkur', 'Larkana', 'Nawabshah'],
    KPK: ['Peshawar', 'Mardan', 'Abbottabad', 'Swat', 'Kohat'],
    Balochistan: ['Quetta', 'Turbat', 'Khuzdar', 'Hub'],
    'Gilgit-Baltistan': ['Gilgit', 'Skardu'],
    AJK: ['Muzaffarabad', 'Mirpur'],
  });
});

export default router;
