import { Router } from 'express';
import axios from 'axios';

const router = Router();

const OPENWEATHER_KEY = process.env.OPENWEATHER_API_KEY || '';

const URDU_DAYS: Record<string, string> = {
  Sunday: 'اتوار',
  Monday: 'پیر',
  Tuesday: 'منگل',
  Wednesday: 'بدھ',
  Thursday: 'جمعرات',
  Friday: 'جمعہ',
  Saturday: 'ہفتہ',
};

/**
 * GET /api/weather/current?city=Lahore
 * Returns current weather for a city.
 */
router.get('/current', async (req, res) => {
  const city = (req.query.city as string) || 'Lahore';

  // Fallback data when no API key
  const fallback = {
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

  if (!OPENWEATHER_KEY) {
    res.json(fallback);
    return;
  }

  try {
    const r = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${OPENWEATHER_KEY}&units=metric`
    );
    const d = r.data;
    res.json({
      city,
      temperature: Math.round(d.main.temp),
      feelsLike: Math.round(d.main.feels_like),
      humidity: d.main.humidity,
      windSpeed: Math.round(d.wind.speed),
      rainProbability: d.rain ? 80 : 10,
      description: d.weather[0].description,
      icon: d.weather[0].icon,
      sprayRecommendation: d.rain
        ? 'بارش متوقع ہے، سپرے نہ کریں'
        : 'موسم سپرے کے لیے مناسب ہے',
    });
  } catch {
    res.json(fallback);
  }
});

/**
 * GET /api/weather/forecast?city=Lahore
 * Returns 5-day / 7-day forecast.
 */
router.get('/forecast', async (req, res) => {
  const city = (req.query.city as string) || 'Lahore';

  const mockForecast = Array.from({ length: 5 }, (_, i) => {
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

  if (!OPENWEATHER_KEY) {
    res.json(mockForecast);
    return;
  }

  try {
    const r = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${OPENWEATHER_KEY}&units=metric&cnt=40`
    );
    const list: Array<{
      dt: number;
      main: { temp: number; temp_min: number };
      weather: Array<{ description: string; icon: string }>;
      pop: number;
    }> = r.data.list;

    const byDay = new Map<string, typeof list>();
    for (const item of list) {
      const dateKey = new Date(item.dt * 1000).toLocaleDateString('en-CA');
      if (!byDay.has(dateKey)) byDay.set(dateKey, []);
      byDay.get(dateKey)!.push(item);
    }

    const today = new Date().toLocaleDateString('en-CA');
    const forecastDays: typeof mockForecast = [];
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

    res.json(forecastDays.length > 0 ? forecastDays : mockForecast);
  } catch {
    res.json(mockForecast);
  }
});

/**
 * GET /api/weather/hourly?city=Lahore
 * Returns hourly temperature points.
 */
router.get('/hourly', async (req, res) => {
  const city = (req.query.city as string) || 'Lahore';

  const fallback = [
    { time: '6AM', temp: 22 }, { time: '9AM', temp: 25 }, { time: '12PM', temp: 28 },
    { time: '3PM', temp: 31 }, { time: '6PM', temp: 29 }, { time: '9PM', temp: 24 },
  ];

  if (!OPENWEATHER_KEY) {
    res.json(fallback);
    return;
  }

  try {
    const r = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${OPENWEATHER_KEY}&units=metric&cnt=8`
    );
    const list: Array<{ dt: number; main: { temp: number } }> = r.data.list;
    const points = list.slice(0, 8).map(item => {
      const date = new Date(item.dt * 1000);
      const hours = date.getHours();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const h = hours % 12 || 12;
      return { time: `${h}${ampm}`, temp: Math.round(item.main.temp) };
    });
    res.json(points);
  } catch {
    res.json(fallback);
  }
});

export default router;
