import React from 'react';
import type { PredictionStats } from '../../types/admin';
import { supabase } from '../../lib/supabase';

const PredictionChart: React.FC = () => {
  const [stats, setStats] = React.useState<PredictionStats[]>([]);

  React.useEffect(() => {
    const fetchStats = async () => {
      const { data, error } = await supabase
        .from('predictions')
        .select('prediction_date, prediction_result')
        .gte('prediction_date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .order('prediction_date');

      if (!error && data) {
        const dailyStats = data.reduce((acc: Record<string, PredictionStats>, curr) => {
          const date = new Date(curr.prediction_date).toLocaleDateString();
          if (!acc[date]) {
            acc[date] = { date, count: 0, accuracy: 0 };
          }
          acc[date].count++;
          acc[date].accuracy = (acc[date].accuracy * (acc[date].count - 1) + (curr.prediction_result ? 1 : 0)) / acc[date].count;
          return acc;
        }, {});

        setStats(Object.values(dailyStats));
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="h-64">
      <div className="grid grid-cols-7 gap-2 h-full">
        {stats.map((stat) => (
          <div key={stat.date} className="flex flex-col justify-end">
            <div 
              className="bg-blue-500 rounded-t"
              style={{ height: `${(stat.count / Math.max(...stats.map(s => s.count))) * 100}%` }}
            />
            <div className="text-xs text-gray-600 mt-1 transform -rotate-45 origin-top-left">
              {stat.date}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PredictionChart;