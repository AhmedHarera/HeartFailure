import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../stores/authStore';
import type { Prediction } from '../../types';
import Card from '../ui/Card';

const PredictionHistory: React.FC = () => {
  const { user } = useAuthStore();
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadPredictions();
    }
  }, [user]);

  const loadPredictions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('predictions')
        .select('*')
        .eq('user_id', user?.id)
        .order('prediction_date', { ascending: false });

      if (error) throw error;
      setPredictions(data || []);
    } catch (error) {
      console.error('Error loading predictions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading prediction history...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Prediction History</h2>
      {predictions.length === 0 ? (
        <p className="text-gray-600">No predictions yet.</p>
      ) : (
        predictions.map((prediction) => (
          <Card key={prediction.id} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                  prediction.prediction_result
                    ? 'bg-red-100 text-red-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {prediction.prediction_result ? 'High Risk' : 'Low Risk'}
                </span>
                <p className="mt-2 text-sm text-gray-600">
                  {new Date(prediction.prediction_date).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm">BMI: {prediction.bmi}</p>
                <p className="text-sm">Age: {prediction.age_category}</p>
              </div>
            </div>
          </Card>
        ))
      )}
    </div>
  );
};

export default PredictionHistory;