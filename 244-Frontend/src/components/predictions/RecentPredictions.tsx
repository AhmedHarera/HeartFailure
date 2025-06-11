import React from 'react';
import { Activity } from 'lucide-react';
import type { PredictionRecord } from '../../types';

interface RecentPredictionsProps {
  predictions: PredictionRecord[];
}

const RecentPredictions: React.FC<RecentPredictionsProps> = ({ predictions }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Predictions</h2>
      <div className="space-y-4">
        {predictions.map((prediction) => (
          <div
            key={prediction.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-full ${
                prediction.prediction_result.includes('Low')
                  ? 'bg-green-100 text-green-600'
                  : 'bg-red-100 text-red-600'
              }`}>
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {prediction.prediction_result}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(prediction.created_at).toLocaleString()}
                </p>
              </div>
            </div>
            <div className={`px-3 py-1 text-sm rounded-full ${
              prediction.prediction_result.includes('Low')
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {prediction.prediction_result.includes('Low') ? 'Low Risk' : 'High Risk'}
            </div>
          </div>
        ))}
        {predictions.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No predictions yet</p>
            <p className="text-sm text-gray-400 mt-1">Make your first prediction to see it here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentPredictions;
