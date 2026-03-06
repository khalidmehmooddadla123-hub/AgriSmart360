import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  session: import('@supabase/supabase-js').Session | null;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUpWithEmail: (email: string, password: string, name: string) => Promise<{ error: Error | null }>;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  signInWithPhone: (phone: string) => Promise<{ error: Error | null }>;
  verifyOTP: (phone: string, otp: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<import('@supabase/supabase-js').Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchUserProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      if (!error && data) {
        setUser(data as User);
      } else {
        // Use basic data from auth session
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser) {
          setUser({
            id: authUser.id,
            email: authUser.email,
            name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'User',
            role: 'farmer',
          });
        }
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
    } finally {
      setLoading(false);
    }
  }

  async function signInWithEmail(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error as Error | null };
  }

  async function signUpWithEmail(email: string, password: string, name: string) {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });
    return { error: error as Error | null };
  }

  async function signInWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
    return { error: error as Error | null };
  }

  async function signInWithPhone(phone: string) {
    const { error } = await supabase.auth.signInWithOtp({ phone });
    return { error: error as Error | null };
  }

  async function verifyOTP(phone: string, token: string) {
    const { error } = await supabase.auth.verifyOtp({ phone, token, type: 'sms' });
    return { error: error as Error | null };
  }

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  }

  async function updateProfile(data: Partial<User>) {
    if (!user) return { error: new Error('Not authenticated') };
    const { error } = await supabase.from('profiles').upsert({ ...data, id: user.id });
    if (!error) setUser({ ...user, ...data });
    return { error: error as Error | null };
  }

  return (
    <AuthContext.Provider value={{
      user, session, loading,
      signInWithEmail, signUpWithEmail, signInWithGoogle,
      signInWithPhone, verifyOTP, signOut, updateProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
