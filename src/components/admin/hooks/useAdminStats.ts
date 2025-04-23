import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import type { AdminStats } from '../../../types/admin';

export const useAdminStats = () => {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalPredictions: 0,
    activeUsers: 0,
    averageAccuracy: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const [usersData, predictionsData] = await Promise.all([
        supabase.from('user_roles').select('count'),
        supabase.from('predictions').select('prediction_result'),
      ]);

      if (!usersData.error && !predictionsData.error) {
        const totalUsers = parseInt(usersData.count as unknown as string);
        const predictions = predictionsData.data || [];
        
        setStats({
          totalUsers,
          totalPredictions: predictions.length,
          activeUsers: totalUsers, // This could be refined based on last activity
          averageAccuracy: predictions.reduce((acc, curr) => acc + (curr.prediction_result ? 1 : 0), 0) / predictions.length * 100,
        });
      }
    };

    fetchStats();
  }, []);

  return stats;
};