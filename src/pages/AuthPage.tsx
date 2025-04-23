import React from 'react';
import AuthForm from '../components/auth/AuthForm';

const AuthPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <AuthForm />
    </div>
  );
};

export default AuthPage;