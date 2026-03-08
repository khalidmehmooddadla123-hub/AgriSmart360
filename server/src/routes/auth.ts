import { Router } from 'express';
import { supabase } from '../config/supabase.js';

const router = Router();

/**
 * POST /api/auth/send-otp
 * Send OTP to the given phone number using Supabase phone auth.
 */
router.post('/send-otp', async (req, res) => {
  const { phone } = req.body as { phone?: string };

  if (!phone) {
    res.status(400).json({ error: 'Phone number is required' });
    return;
  }

  // Ensure international format
  const formatted = phone.startsWith('+') ? phone : `+${phone}`;

  try {
    const { error } = await supabase.auth.signInWithOtp({ phone: formatted });

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    res.json({ success: true, message: `OTP sent to ${formatted}` });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

/**
 * POST /api/auth/verify-otp
 * Verify the OTP and return a session.
 */
router.post('/verify-otp', async (req, res) => {
  const { phone, token } = req.body as { phone?: string; token?: string };

  if (!phone || !token) {
    res.status(400).json({ error: 'Phone and OTP token are required' });
    return;
  }

  const formatted = phone.startsWith('+') ? phone : `+${phone}`;

  try {
    const { data, error } = await supabase.auth.verifyOtp({
      phone: formatted,
      token,
      type: 'sms',
    });

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    res.json({
      success: true,
      session: data.session,
      user: data.user,
    });
  } catch (err) {
    res.status(500).json({ error: 'OTP verification failed' });
  }
});

/**
 * POST /api/auth/login
 * Email + password login.
 */
router.post('/login', async (req, res) => {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      res.status(401).json({ error: error.message });
      return;
    }

    res.json({
      success: true,
      session: data.session,
      user: data.user,
    });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

/**
 * POST /api/auth/register
 * Create a new account with email + password.
 */
router.post('/register', async (req, res) => {
  const { email, password, name } = req.body as { email?: string; password?: string; name?: string };

  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name || '' } },
    });

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    res.json({
      success: true,
      session: data.session,
      user: data.user,
    });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

export default router;
