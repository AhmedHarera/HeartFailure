import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useDashboardStore } from '../stores/dashboardStore';
import Button from './ui/Button';
import StatsOverview from './stats/StatsOverview';
import RecentPredictions from './predictions/RecentPredictions';
import toast from 'react-hot-toast';

const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const {
    totalUsers,
    totalPredictions,
    accuracyRate,
    livesImpacted,
    recentPredictions,
    loading,
    error,
    fetchStats
  } = useDashboardStore();

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        await fetchStats();
      } catch (err) {
        toast.error('Failed to load dashboard data');
      }
    };

    loadDashboard();
  }, [fetchStats]);

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Please Log In</h2>
          <p className="text-gray-600 mb-4">You need to be logged in to view the dashboard.</p>
          <Link to="/auth">
            <Button>Log In</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <div className="text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => fetchStats()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Welcome back, {user.email?.split('@')[0]}
              </h1>
              <p className="text-blue-100">
                Your personal heart health monitoring dashboard
              </p>
            </div>
            <Link to="/predict" className="mt-4 md:mt-0">
              <Button variant="secondary" className="flex items-center gap-2">
                New Prediction <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <StatsOverview
            totalUsers={totalUsers}
            totalPredictions={totalPredictions}
            accuracyRate={accuracyRate}
            livesImpacted={livesImpacted}
          />
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <RecentPredictions predictions={recentPredictions} />
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link to="/predict" className="block">
                  <Button className="w-full justify-center">
                    Make a New Prediction
                  </Button>
                </Link>
                <Link to="/profile" className="block">
                  <Button variant="secondary" className="w-full justify-center">
                    View Profile
                  </Button>
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Need Help?</h2>
              <p className="text-gray-600 mb-4">
                Learn more about heart failure risk factors and prevention methods.
              </p>
              <Link to="/about" className="block">
                <Button variant="secondary" className="w-full justify-center">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
