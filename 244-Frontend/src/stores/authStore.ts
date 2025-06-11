import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  
  setUser: (user) => set({ user, loading: false }),
  
  signUp: async (email: string, password: string) => {
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (signUpError) throw signUpError;

    if (authData.user) {
      // Create profile record using service role client
      const { error: profileError } = await supabase.auth.getUser().then(async ({ data: { user } }) => {
        if (!user) throw new Error('No user found');
        
        return supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email
          })
          .single();
      });

      if (profileError) {
        console.error('Error creating profile:', profileError);
      }

      // Create user role
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: authData.user.id,
          role: 'user',
          is_banned: false
        });

      if (roleError) {
        console.error('Error creating user role:', roleError);
      }

      set({ user: authData.user, loading: false });
    }
  },
  
  signIn: async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  },
  
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      // Always clear the user state, even if there's an error
      set({ user: null, loading: false });
    }
  },
}));