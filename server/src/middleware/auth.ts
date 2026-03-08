import type { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase.js';

// Extend Express Request with auth fields
export interface AuthRequest extends Request {
  userId?: string;
  userEmail?: string;
  userPhone?: string;
}

/**
 * Express middleware that validates the Authorization header.
 * Accepts either a Supabase JWT or the demo-mode token.
 */
export async function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  // Allow demo mode
  if (authHeader === 'Bearer demo-token') {
    req.userId = 'demo-user-1';
    next();
    return;
  }

  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing or invalid authorization header' });
    return;
  }

  const token = authHeader.slice(7);

  try {
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) {
      res.status(401).json({ error: 'Invalid or expired token' });
      return;
    }
    req.userId = data.user.id;
    req.userEmail = data.user.email;
    req.userPhone = data.user.phone;
    next();
  } catch {
    res.status(401).json({ error: 'Authentication failed' });
  }
}
