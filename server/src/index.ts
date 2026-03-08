import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth.js';
import pricesRoutes from './routes/prices.js';
import weatherRoutes from './routes/weather.js';
import newsRoutes from './routes/news.js';
import notificationsRoutes from './routes/notifications.js';

const app = express();
const PORT = parseInt(process.env.PORT || '5000', 10);

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/prices', pricesRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/notifications', notificationsRoutes);

// Start
app.listen(PORT, () => {
  console.log(`🌱 AgriSmart 360 API server running on http://localhost:${PORT}`);
});

export default app;
