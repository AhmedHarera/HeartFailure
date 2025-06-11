import React from 'react';
import { Heart, Brain, Activity, Shield, ChevronRight, Users, Award, Zap } from 'lucide-react';
import Card from '../components/ui/Card';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16 relative">
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
            <Heart className="w-12 h-12 text-blue-500 animate-pulse" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">About HeartGuard AI</h1>
          <p className="text-xl text-blue-600 font-medium">
            AI-driven insights for a healthier heart
          </p>
        </div>

        {/* Mission Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-200 rounded-3xl transform rotate-3"></div>
            <img
              src="/about.jpg"
              alt="Medical professionals using HeartGuard AI"
              className="relative rounded-3xl shadow-xl w-full h-[400px] object-cover transform transition-transform duration-500 hover:scale-[1.02]"
            />
            <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-2xl shadow-lg">
              <Activity className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center">
                <Brain className="w-7 h-7 text-blue-500 mr-3" />
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                HeartGuard AI is dedicated to revolutionizing heart disease prevention through 
                cutting-edge artificial intelligence. Our mission is to make early detection 
                accessible to everyone, everywhere.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed mt-4">
                By combining medical expertise with advanced machine learning algorithms, 
                we provide accurate predictions that can help save lives through early 
                intervention and prevention.
              </p>
            </div>

            <a 
              href="/predict" 
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 shadow-md"
            >
              Try HeartGuard AI
              <ChevronRight className="ml-2 w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Technology Section */}
        <div className="mb-20">
          <Card className="transform hover:scale-[1.01] transition-transform duration-300">
            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 p-4 rounded-2xl">
                <Zap className="w-8 h-8 text-blue-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">The Technology Behind Our Predictions</h2>
                <p className="text-lg text-gray-600 mb-6">
                  Our AI model is trained on extensive medical data and validated by healthcare 
                  professionals. It takes into account multiple factors including:
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    {
                      title: 'Patient Data',
                      items: ['Demographics', 'Medical history', 'Lifestyle factors']
                    },
                    {
                      title: 'Clinical Measurements',
                      items: ['Vital signs', 'ECG readings', 'Blood work results']
                    }
                  ].map((category, idx) => (
                    <div key={idx} className="bg-gray-50 p-6 rounded-xl">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">{category.title}</h3>
                      <ul className="space-y-3">
                        {category.items.map((item, i) => (
                          <li key={i} className="flex items-center text-gray-600">
                            <Shield className="w-5 h-5 text-blue-500 mr-2" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Impact Section */}
        <div className="text-center mb-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 flex items-center justify-center">
            <Award className="w-8 h-8 text-blue-500 mr-3" />
            Our Impact
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { number: '95%', label: 'Prediction Accuracy', icon: Brain },
              { number: '10k+', label: 'Predictions Made', icon: Activity },
              { number: '50+', label: 'Healthcare Partners', icon: Users }
            ].map((stat, idx) => (
              <div 
                key={idx}
                className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:scale-105"
              >
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  {React.createElement(stat.icon, { className: "w-8 h-8 text-blue-600" })}
                </div>
                <div className="text-4xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <p className="text-gray-600 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Wave Pattern */}
        <div className="relative h-32">
          <svg
            className="absolute bottom-0 w-full h-full"
            preserveAspectRatio="none"
            viewBox="0 0 1440 320"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="#EFF6FF"
              fillOpacity="1"
              d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default About;