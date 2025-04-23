import React, { useState } from 'react';
import { Heart, Menu, X, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuthStore();
  
  const isActive = (path: string) => {
    return location.pathname === path ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600';
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-red-500" />
            <span className="text-xl font-bold text-gray-900">HeartGuard AI</span>
          </div>
          
          <button
            onClick={toggleMenu}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            {isMenuOpen ? (
              <X className="block h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="block h-6 w-6" aria-hidden="true" />
            )}
          </button>

          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className={`${isActive('/')} transition-colors duration-200`}>
              Home
            </Link>
            <Link to="/predict" className={`${isActive('/predict')} transition-colors duration-200`}>
              Prediction
            </Link>
            <Link to="/predict-ecg" className={`${isActive('/predict-ecg')} transition-colors duration-200`}>
              ECG Analysis
            </Link>
            <Link to="/about" className={`${isActive('/about')} transition-colors duration-200`}>
              About
            </Link>
            <Link to="/contact" className={`${isActive('/contact')} transition-colors duration-200`}>
              Contact
            </Link>
            {user ? (
              <Link 
                to="/profile" 
                className={`${isActive('/profile')} transition-colors duration-200 flex items-center gap-1`}
              >
                <User className="w-4 h-4" />
                Profile
              </Link>
            ) : (
              <Link 
                to="/auth" 
                className={`${isActive('/auth')} transition-colors duration-200`}
              >
                Sign In
              </Link>
            )}
          </nav>
        </div>
      </div>

      <div
        className={`${
          isMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
        } absolute top-16 inset-x-0 transition-all transform duration-300 ease-in-out md:hidden bg-white shadow-lg z-50`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link
            to="/"
            className={`block px-3 py-2 rounded-md ${isActive('/')} hover:bg-gray-50`}
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/predict"
            className={`block px-3 py-2 rounded-md ${isActive('/predict')} hover:bg-gray-50`}
            onClick={() => setIsMenuOpen(false)}
          >
            Prediction
          </Link>
          <Link
            to="/predict-ecg"
            className={`block px-3 py-2 rounded-md ${isActive('/predict-ecg')} hover:bg-gray-50`}
            onClick={() => setIsMenuOpen(false)}
          >
            ECG Analysis
          </Link>
          <Link
            to="/about"
            className={`block px-3 py-2 rounded-md ${isActive('/about')} hover:bg-gray-50`}
            onClick={() => setIsMenuOpen(false)}
          >
            About
          </Link>
          <Link
            to="/contact"
            className={`block px-3 py-2 rounded-md ${isActive('/contact')} hover:bg-gray-50`}
            onClick={() => setIsMenuOpen(false)}
          >
            Contact
          </Link>
          {user ? (
            <Link
              to="/profile"
              className={`block px-3 py-2 rounded-md ${isActive('/profile')} hover:bg-gray-50`}
              onClick={() => setIsMenuOpen(false)}
            >
              Profile
            </Link>
          ) : (
            <Link
              to="/auth"
              className={`block px-3 py-2 rounded-md ${isActive('/auth')} hover:bg-gray-50`}
              onClick={() => setIsMenuOpen(false)}
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;