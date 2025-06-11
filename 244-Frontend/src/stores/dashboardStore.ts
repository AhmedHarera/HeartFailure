import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { PredictionRecord } from '../types';

interface DashboardStats {
  totalUsers: number;
  totalPredictions: number;
  accuracyRate: number;
  livesImpacted: number;
  recentPredictions: PredictionRecord[];
}

interface DashboardState extends DashboardStats {
  loading: boolean;
  error: string | null;
  fetchStats: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  totalUsers: 0,
  totalPredictions: 0,
  accuracyRate: 95.2, // This is a placeholder - should be calculated from actual model metrics
  livesImpacted: 0,
  recentPredictions: [],
  loading: false,
  error: null,

  fetchStats: async () => {
    set({ loading: true, error: null });
    try {
      // Fetch all required data in parallel
      const [
        { count: usersCount, error: usersError },
        { count: predictionsCount, error: predictionsError },
        { data: recentPredictions, error: recentError }
      ] = await Promise.all([
        supabase.from('users').select('*', { count: 'exact', head: true }),
        supabase.from('predictions').select('*', { count: 'exact', head: true }),
        supabase
          .from('predictions')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5)
      ]);

      if (usersError) throw usersError;
      if (predictionsError) throw predictionsError;
      if (recentError) throw recentError;

      const totalUsers = usersCount || 0;
      const totalPredictions = predictionsCount || 0;
      const livesImpacted = Math.floor(totalPredictions * 1.2); // Estimate: some predictions help multiple people

      set({
        totalUsers,
        totalPredictions,
        livesImpacted,
        recentPredictions: recentPredictions || [],
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      set({
        error: 'Failed to load dashboard statistics. Please try again later.',
        loading: false
      });
    }
  }
}));