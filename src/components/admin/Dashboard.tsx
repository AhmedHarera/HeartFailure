import React from 'react';
import { BarChart, Users, Activity, Brain } from 'lucide-react';
import StatCard from './StatCard';
import UserList from './UserList';
import PredictionChart from './PredictionChart';
import { useAdminStats } from './hooks/useAdminStats';

const Dashboard: React.FC = () => {
  const stats = useAdminStats();

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<Users className="w-6 h-6" />}
          color="blue"
        />
        <StatCard
          title="Total Predictions"
          value={stats.totalPredictions}
          icon={<Activity className="w-6 h-6" />}
          color="green"
        />
        <StatCard
          title="Active Users"
          value={stats.activeUsers}
          icon={<Brain className="w-6 h-6" />}
          color="purple"
        />
        <StatCard
          title="Avg. Accuracy"
          value={`${stats.averageAccuracy.toFixed(1)}%`}
          icon={<BarChart className="w-6 h-6" />}
          color="yellow"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Recent Users</h2>
          <UserList />
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Prediction Trends</h2>
          <PredictionChart />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;