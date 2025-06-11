import { supabase } from '../lib/supabase';
import type { FormData, PredictionRecord, UserStats, SystemStats } from '../types';

export const savePrediction = async (
  userId: string,
  predictionData: FormData,
  predictionResult: string
): Promise<PredictionRecord | null> => {
  const { data, error } = await supabase
    .from('predictions')
    .insert({
      user_id: userId,
      prediction_data: predictionData,
      prediction_result: predictionResult,
      created_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) {
    console.error('Error saving prediction:', error);
    return null;
  }

  return data;
};

export const getUserStats = async (userId: string): Promise<UserStats | null> => {
  const { data: predictions, error } = await supabase
    .from('predictions')
    .select('prediction_result, created_at')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching user stats:', error);
    return null;
  }

  return {
    total_predictions: predictions.length,
    high_risk_predictions: predictions.filter(p => p.prediction_result.includes('High')).length,
    low_risk_predictions: predictions.filter(p => p.prediction_result.includes('Low')).length,
    last_prediction_date: predictions.length > 0 ? predictions[predictions.length - 1].created_at : null
  };
};

export const getSystemStats = async (): Promise<SystemStats | null> => {
  const { data: users, error: usersError } = await supabase
    .from('users')
    .select('id');

  const { data: predictions, error: predictionsError } = await supabase
    .from('predictions')
    .select('prediction_result');

  if (usersError || predictionsError) {
    console.error('Error fetching system stats:', usersError || predictionsError);
    return null;
  }

  // Calculate system-wide statistics
  return {
    total_users: users.length,
    total_predictions: predictions.length,
    accuracy_rate: 95.2, // This should be calculated based on your model's actual accuracy
    lives_impacted: predictions.length // You might want to adjust this metric
  };
};

export const getRecentActivity = async (limit: number = 5): Promise<PredictionRecord[]> => {
  const { data, error } = await supabase
    .from('predictions')
    .select(`
      id,
      user_id,
      prediction_data,
      prediction_result,
      created_at,
      users (
        email
      )
    `)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching recent activity:', error);
    return [];
  }

  return data;
};
