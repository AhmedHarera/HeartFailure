import React from 'react';
import { Heart, Github, Twitter, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

const FooterLink: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => (
  <li>
    <Link to={to} className="hover:text-blue-600 transition-colors">
      {children}
    </Link>
  </li>
);

const SocialIcon: React.FC<{ href: string; icon: React.ReactNode }> = ({ href, icon }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer" 
    className="text-gray-600 hover:text-gray-900 transition-colors"
  >
    {icon}
  </a>
);

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-6 h-6 text-red-500" />
              <span className="text-xl font-bold text-gray-900">HeartGuard AI</span>
            </div>
            <p className="text-gray-600 max-w-md">
              Empowering healthcare professionals and individuals with AI-driven heart disease prediction technology.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-600">
              <FooterLink to="/">Home</FooterLink>
              <FooterLink to="/about">About</FooterLink>
              <FooterLink to="/predict">Prediction</FooterLink>
              <FooterLink to="/contact">Contact</FooterLink>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Connect</h3>
            <div className="flex space-x-4">
              <SocialIcon 
                href="https://github.com" 
                icon={<Github className="w-5 h-5" />} 
              />
              <SocialIcon 
                href="https://twitter.com" 
                icon={<Twitter className="w-5 h-5" />} 
              />
              <SocialIcon 
                href="https://linkedin.com" 
                icon={<Linkedin className="w-5 h-5" />} 
              />
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t text-center text-gray-600">
          <p>© {new Date().getFullYear()} HeartGuard AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;