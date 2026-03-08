import { Router } from 'express';
import { supabase } from '../config/supabase.js';
import { authMiddleware, type AuthRequest } from '../middleware/auth.js';

const router = Router();

/**
 * GET /api/notifications
 * Get notifications for the authenticated user.
 */
router.get('/', authMiddleware, async (req: AuthRequest, res) => {
  const userId = req.userId || 'unknown';

  // Try loading from Supabase; fall back to demo data
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (!error && data && data.length > 0) {
      res.json(data);
      return;
    }
  } catch {
    // Fall through to demo data
  }

  // Fallback notifications
  const now = Date.now();
  res.json([
    { id: '1', userId, title: 'گندم کی قیمت میں اضافہ', message: 'لاہور منڈی میں گندم کی قیمت 50 روپے فی من بڑھ گئی', type: 'price', read: false, createdAt: new Date(now).toISOString() },
    { id: '2', userId, title: 'موسمی انتباہ', message: 'کل لاہور میں بارش متوقع ہے، سپرے نہ کریں', type: 'weather', read: false, createdAt: new Date(now - 3600000).toISOString() },
    { id: '3', userId, title: 'حکومتی اعلان', message: 'گندم کسانوں کے لیے نئی سبسڈی اسکیم', type: 'govt', read: true, createdAt: new Date(now - 86400000).toISOString() },
  ]);
});

/**
 * POST /api/notifications/send
 * Create a notification and optionally send it via SMS to the user's phone.
 * Body: { userId, title, message, type, phone? }
 */
router.post('/send', authMiddleware, async (req: AuthRequest, res) => {
  const { title, message, type, phone } = req.body as {
    title?: string;
    message?: string;
    type?: string;
    phone?: string;
  };
  const userId = req.userId || 'unknown';

  if (!title || !message) {
    res.status(400).json({ error: 'Title and message are required' });
    return;
  }

  // Store notification in Supabase
  const notification = {
    user_id: userId,
    title,
    message,
    type: type || 'general',
    read: false,
    created_at: new Date().toISOString(),
  };

  try {
    await supabase.from('notifications').insert(notification);
  } catch {
    // Non-critical – notification display still works client-side
  }

  // If a phone number is provided, log the SMS intent.
  // In production, integrate Twilio or another SMS provider here:
  //   await twilioClient.messages.create({ to: phone, from: TWILIO_FROM, body: message });
  if (phone) {
    console.log(`[SMS] Notification to ${phone}: ${title} – ${message}`);
  }

  res.json({ success: true, notification });
});

/**
 * PUT /api/notifications/:id/read
 * Mark a notification as read.
 */
router.put('/:id/read', authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    await supabase.from('notifications').update({ read: true }).eq('id', id);
  } catch {
    // Non-critical
  }

  res.json({ success: true });
});

export default router;
