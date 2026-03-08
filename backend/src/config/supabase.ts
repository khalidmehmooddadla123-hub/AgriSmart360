import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://ujpmqdmnphkulyftldsv.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || '';

// Server-side Supabase client uses the service-role key so it can
// bypass Row Level Security when needed (e.g. sending notifications).
// Falls back to anon key when service key is not provided.
const supabaseKey =
  supabaseServiceKey ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqcG1xZG1ucGhrdWx5ZnRsZHN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzNjM0NTUsImV4cCI6MjA4NzkzOTQ1NX0.bjX5ZkyzuvWgSdgAiV2ruASstBPqBBhxFVgAQRacd1w';

export const supabase = createClient(supabaseUrl, supabaseKey);
