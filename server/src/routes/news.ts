import { Router } from 'express';

const router = Router();

// Agriculture news – updated dynamically with relative dates
function getNews() {
  const now = Date.now();
  return [
    {
      id: '1',
      title: 'Government Announces New Subsidy for Wheat Farmers',
      titleUrdu: 'حکومت نے گندم کسانوں کے لیے نئی سبسڈی کا اعلان کیا',
      summary: 'The Ministry of National Food Security has announced a subsidy of PKR 500 per bag of urea fertilizer for registered farmers.',
      summaryUrdu: 'وزارت قومی غذائی تحفظ نے رجسٹرڈ کسانوں کے لیے یوریا کھاد کے ہر بیگ پر 500 روپے سبسڈی کا اعلان کیا ہے۔',
      source: 'Ministry of National Food Security & Research',
      category: 'subsidy',
      publishedAt: new Date(now - 86400000).toISOString(),
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
      publishedAt: new Date(now - 172800000).toISOString(),
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
      publishedAt: new Date(now - 259200000).toISOString(),
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
      publishedAt: new Date(now - 345600000).toISOString(),
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
      publishedAt: new Date(now - 432000000).toISOString(),
      imageUrl: 'https://images.unsplash.com/photo-1569880153113-76e33fc52d5f?w=400',
    },
  ];
}

/**
 * GET /api/news
 * Returns agriculture news.
 */
router.get('/', (_req, res) => {
  res.json(getNews());
});

/**
 * GET /api/news/eco-tips
 * Returns eco-friendly farming tips.
 */
router.get('/eco-tips', (_req, res) => {
  res.json([
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
  ]);
});

export default router;
