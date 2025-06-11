import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { supabase } from '../../lib/supabase';
import Button from '../ui/Button';

type TimeRange = 'weekly' | 'monthly';

interface ChartData {
  date: string;
  predictions: number;
  accuracy: number;
}

const PredictionTrends: React.FC = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('weekly');
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChartData();
  }, [timeRange]);

  const fetchChartData = async () => {
    setLoading(true);
    try {
      const daysToFetch = timeRange === 'weekly' ? 7 : 30;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysToFetch);

      const { data: predictions, error } = await supabase
        .from('predictions')
        .select('prediction_date, prediction_result')
        .gte('prediction_date', startDate.toISOString())
        .order('prediction_date');

      if (error) throw error;

      // Create a map of dates to initialize all days in the range
      const dateMap: Record<string, ChartData> = {};
      const currentDate = new Date(startDate);
      
      while (currentDate <= new Date()) {
        const dateStr = currentDate.toISOString().split('T')[0];
        dateMap[dateStr] = {
          date: dateStr,
          predictions: 0,
          accuracy: 0
        };
        currentDate.setDate(currentDate.getDate() + 1);
      }

      // Fill in the actual data
      predictions?.forEach(pred => {
        const dateStr = new Date(pred.prediction_date).toISOString().split('T')[0];
        if (dateMap[dateStr]) {
          dateMap[dateStr].predictions++;
          dateMap[dateStr].accuracy = (
            (dateMap[dateStr].accuracy * (dateMap[dateStr].predictions - 1)) +
            (pred.prediction_result ? 100 : 0)
          ) / dateMap[dateStr].predictions;
        }
      });

      // Convert to array and sort by date
      const chartData = Object.values(dateMap).sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      setData(chartData);
    } catch (error) {
      console.error('Error fetching chart data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading chart data...</div>
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="h-64">
      <div className="flex justify-end gap-2 mb-4">
        <Button
          variant={timeRange === 'weekly' ? 'primary' : 'secondary'}
          onClick={() => setTimeRange('weekly')}
          className="text-sm"
        >
          Weekly
        </Button>
        <Button
          variant={timeRange === 'monthly' ? 'primary' : 'secondary'}
          onClick={() => setTimeRange('monthly')}
          className="text-sm"
        >
          Monthly
        </Button>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
          <XAxis 
            dataKey="date" 
            tickFormatter={formatDate}
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            yAxisId="left" 
            tick={{ fontSize: 12 }}
            label={{ 
              value: 'Predictions', 
              angle: -90, 
              position: 'insideLeft',
              style: { fontSize: 12 }
            }}
          />
          <YAxis 
            yAxisId="right" 
            orientation="right" 
            domain={[0, 100]}
            tick={{ fontSize: 12 }}
            label={{ 
              value: 'Accuracy %', 
              angle: 90, 
              position: 'insideRight',
              style: { fontSize: 12 }
            }}
          />
          <Tooltip
            contentStyle={{ 
              backgroundColor: 'white',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '12px'
            }}
            formatter={(value: number) => [value.toFixed(1), '']}
            labelFormatter={formatDate}
          />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="predictions"
            stroke="#3b82f6"
            name="Predictions"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="accuracy"
            stroke="#10b981"
            name="Accuracy %"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PredictionTrends;