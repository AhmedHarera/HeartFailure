import React from 'react';
import { useAuthStore } from '../stores/authStore';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { User, LogOut } from 'lucide-react';
import ProfileForm from '../components/profile/ProfileForm';
import PredictionHistory from '../components/profile/PredictionHistory';

const ProfilePage: React.FC = () => {
  const { user, signOut } = useAuthStore();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-3xl mx-auto space-y-6">
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <User className="w-6 h-6" />
              Profile
            </h1>
            <Button
              variant="secondary"
              onClick={handleSignOut}
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Account Information</h2>
            <div className="space-y-2">
              <p className="text-gray-600">Email: {user?.email}</p>
              <p className="text-gray-600">
                Member since: {new Date(user?.created_at || '').toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
            <ProfileForm />
          </div>
        </Card>

        <Card>
          <PredictionHistory />
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;