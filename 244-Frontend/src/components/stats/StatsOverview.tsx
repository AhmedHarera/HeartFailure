import React from 'react';
import { Activity, Users, Brain, Heart } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  color?: 'blue' | 'green' | 'red';
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon, 
  description,
  color = 'blue'
}) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    red: 'bg-red-100 text-red-600'
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
          {description && (
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

const StatsOverview: React.FC<{
  totalUsers: number;
  totalPredictions: number;
  accuracyRate: number;
  livesImpacted: number;
}> = ({ totalUsers, totalPredictions, accuracyRate, livesImpacted }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Users"
        value={totalUsers.toLocaleString()}
        icon={<Users className="w-6 h-6" />}
        description="Active platform users"
        color="blue"
      />
      <StatCard
        title="Predictions Made"
        value={totalPredictions.toLocaleString()}
        icon={<Brain className="w-6 h-6" />}
        description="Total predictions"
        color="green"
      />
      <StatCard
        title="Accuracy Rate"
        value={`${accuracyRate.toFixed(1)}%`}
        icon={<Activity className="w-6 h-6" />}
        description="Model accuracy"
        color="blue"
      />
      <StatCard
        title="Lives Impacted"
        value={livesImpacted.toLocaleString()}
        icon={<Heart className="w-6 h-6" />}
        description="People helped"
        color="red"
      />
    </div>
  );
};

export default StatsOverview;
