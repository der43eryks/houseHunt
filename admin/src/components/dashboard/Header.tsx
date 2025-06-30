import React, { useState } from 'react';
import { Search, Bell, User, LogOut, Lock, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const Header: React.FC<{ title: string }> = ({ title }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { theme } = useTheme();

  // Get client URL from environment or default to localhost:5173
  const clientUrl = import.meta.env.VITE_CLIENT_URL || 'http://localhost:5173';

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-3 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white truncate">{title}</h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 hidden sm:block">Manage your property listings and inquiries</p>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-4 lg:space-x-6">
          {/* Back to Site Button - Hidden on very small screens */}
          <a 
            href={clientUrl}
            target="_blank" 
            rel="noopener noreferrer"
            className="hidden sm:flex items-center space-x-2 px-2 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-xs sm:text-sm font-medium"
          >
            <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden md:inline">Back to Site</span>
          </a>
          
          {/* Search Bar - Responsive */}
          <div className="relative flex-1 sm:flex-none">
            <div className="relative w-full sm:w-64 lg:w-80">
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-8 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
              <Search className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          
          {/* Notification Bell - Hidden on very small screens */}
          <button className="hidden sm:block relative p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200">
            <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          {/* User Profile Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setDropdownOpen(!isDropdownOpen)} 
              className="flex items-center space-x-2 sm:space-x-3 p-1 sm:p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none"
            >
              <img
                src="https://i.pravatar.cc/40?u=admin"
                alt="Admin User"
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full ring-2 ring-gray-200 dark:ring-gray-600"
              />
              <div className="text-left hidden sm:block">
                <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">Admin User</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Administrator</p>
              </div>
            </button>
            
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 sm:mt-3 w-48 sm:w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-20">
                <div className="px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-100 dark:border-gray-700">
                  <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">Signed in as</p>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">admin@enigmatic.com</p>
                </div>
                <a href="#profile" className="flex items-center px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                  <User className="w-3 h-3 sm:w-4 sm:h-4 mr-2 sm:mr-3" /> Profile Settings
                </a>
                <a href="#change-password" className="flex items-center px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                  <Lock className="w-3 h-3 sm:w-4 sm:h-4 mr-2 sm:mr-3" /> Change Password
                </a>
                <div className="border-t border-gray-100 dark:border-gray-700 mt-2">
                  <a href="#logout" className="flex items-center px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200">
                    <LogOut className="w-3 h-3 sm:w-4 sm:h-4 mr-2 sm:mr-3" /> Sign Out
                  </a>
                </div>
              </div>
            )}
          </div>
          
          {/* Logout Button - Compact on mobile */}
          <button
            onClick={handleLogout}
            className="px-2 sm:px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition text-xs sm:text-sm"
          >
            <span className="hidden sm:inline">Logout</span>
            <LogOut className="w-4 h-4 sm:hidden" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header; 