import { createClient } from '@supabase/supabase-js';

// Supabase anon key is a public key designed for client-side use.
// It is safe to include as a fallback — it only grants anonymous access
// and is further restricted by Row Level Security on the database.
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  'https://ujpmqdmnphkulyftldsv.supabase.co';

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqcG1xZG1ucGhrdWx5ZnRsZHN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzNjM0NTUsImV4cCI6MjA4NzkzOTQ1NX0.bjX5ZkyzuvWgSdgAiV2ruASstBPqBBhxFVgAQRacd1w';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
