import React from 'react';
import { Shield, Heart, ArrowRight, Brain } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import Button from '../components/ui/Button';
import Dashboard from '../components/Dashboard';
import ChatBot from '../components/chatbot/ChatBot';

const LandingPage: React.FC = () => (
  <div>
    {/* Hero Section */}
    <section className="relative bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            AI-Powered Heart Failure Prediction
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Early detection for better prevention using advanced machine learning
          </p>
          <Link to="/auth">
            <Button variant="secondary" className="text-lg px-8 py-3">
              Get Started <ArrowRight className="inline-block ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>

    {/* Features Section */}
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Choose Our Platform?
          </h2>
          <p className="text-xl text-gray-600">
            Advanced AI technology combined with medical expertise
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Brain className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">AI-Powered Analysis</h3>
            <p className="text-gray-600">
              State-of-the-art machine learning models for accurate predictions
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
            <p className="text-gray-600">
              Your health data is encrypted and protected
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <Heart className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Early Detection</h3>
            <p className="text-gray-600">
              Identify potential risks before they become serious
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
);

const Home: React.FC = () => {
  const { user } = useAuthStore();

  return (
    <>
      {user ? <Dashboard /> : <LandingPage />}
      <ChatBot />
    </>
  );
};

export default Home;