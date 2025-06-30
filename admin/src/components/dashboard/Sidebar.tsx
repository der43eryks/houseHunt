import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, List, PlusCircle, User, Settings, LogOut, Menu, X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const Sidebar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme } = useTheme();

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Listings', icon: List, path: '/dashboard/listings' },
    { name: 'Add Listing', icon: PlusCircle, path: '/dashboard/add-listing' },
  ];

  const bottomNavItems = [
    { name: 'Profile', icon: User, path: '/dashboard/profile' },
    { name: 'Settings', icon: Settings, path: '/dashboard/settings' },
  ];

  const handleSignOut = () => {
    // Add sign out logic here
    // localStorage.removeItem('adminToken');
    window.location.href = '/';
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="lg:hidden fixed top-3 left-3 z-50 p-2 bg-blue-600 text-white rounded-lg shadow-lg"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40 w-64 sm:w-72 bg-white dark:bg-gray-800 shadow-xl text-gray-800 dark:text-gray-200 flex flex-col border-r border-gray-200 dark:border-gray-700
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo Section */}
        <div className="p-6 sm:p-8 text-xl sm:text-2xl font-bold text-center border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-blue-600 font-bold text-xs sm:text-sm">H</span>
            </div>
            <span className="truncate">HouseHunt</span>
          </div>
          <p className="text-xs sm:text-sm font-normal mt-1 text-blue-100">Admin Panel</p>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 p-4 sm:p-6">
          <div className="space-y-1 sm:space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl transition-colors duration-200 text-sm sm:text-base ${
                    isActive
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-r-2 border-blue-600'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                  }`
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <item.icon size={18} className="sm:w-5 sm:h-5" />
                <span className="font-medium truncate">{item.name}</span>
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Bottom Navigation */}
        <div className="p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700 space-y-1 sm:space-y-2">
          {bottomNavItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl transition-colors duration-200 text-sm sm:text-base ${
                  isActive
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-r-2 border-blue-600'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                }`
              }
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <item.icon size={18} className="sm:w-5 sm:h-5" />
              <span className="font-medium truncate">{item.name}</span>
            </NavLink>
          ))}
          
          {/* Sign Out Button */}
          <button
            onClick={handleSignOut}
            className="w-full flex items-center space-x-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl transition-colors duration-200 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-300 text-sm sm:text-base"
          >
            <LogOut size={18} className="sm:w-5 sm:h-5" />
            <span className="font-medium truncate">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar; 