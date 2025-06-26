import React, { useState } from 'react';
import { Search, Bell, User, LogOut, Lock, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header: React.FC<{ title: string }> = ({ title }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-8 py-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-500 mt-1">Manage your property listings and inquiries</p>
        </div>
        
        <div className="flex items-center space-x-6">
          <a 
            href="http://localhost:3000" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Back to Site</span>
          </a>
          
          <div className="relative">
            <div className="relative w-80">
              <input
                type="text"
                placeholder="Search properties, inquiries..."
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>
          
          <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200">
            <Bell className="w-6 h-6" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setDropdownOpen(!isDropdownOpen)} 
              className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-50 transition-colors duration-200 focus:outline-none"
            >
              <img
                src="https://i.pravatar.cc/40?u=admin"
                alt="Admin User"
                className="w-10 h-10 rounded-full ring-2 ring-gray-200"
              />
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900">Admin User</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            </button>
            
            {isDropdownOpen && (
              <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-20">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">Signed in as</p>
                  <p className="text-sm text-gray-500">admin@enigmatic.com</p>
                </div>
                <a href="#profile" className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                  <User className="w-4 h-4 mr-3" /> Profile Settings
                </a>
                <a href="#change-password" className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                  <Lock className="w-4 h-4 mr-3" /> Change Password
                </a>
                <div className="border-t border-gray-100 mt-2">
                  <a href="#logout" className="flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200">
                    <LogOut className="w-4 h-4 mr-3" /> Sign Out
                  </a>
                </div>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="ml-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header; 