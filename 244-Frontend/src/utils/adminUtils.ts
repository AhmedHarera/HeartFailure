import { supabase } from '../lib/supabase';

export const isAdmin = async (userId: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .single();

  if (error) return false;
  return data?.role === 'admin';
};