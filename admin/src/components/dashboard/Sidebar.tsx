import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, List, PlusCircle, User, Settings, LogOut, Menu, X } from 'lucide-react';

const Sidebar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    localStorage.removeItem('adminToken');
    window.location.href = '/';
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded-lg"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40 w-72 bg-white shadow-xl text-gray-800 flex flex-col border-r border-gray-200
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo Section */}
        <div className="p-8 text-2xl font-bold text-center border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-blue-600 font-bold text-sm">H</span>
            </div>
            <span>HouseHunt</span>
          </div>
          <p className="text-sm font-normal mt-1 text-blue-100">Admin Panel</p>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 p-6">
          <div className="space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors duration-200 ${
                    isActive
                      ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-600'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.name}</span>
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Bottom Navigation */}
        <div className="p-6 border-t border-gray-200 space-y-2">
          {bottomNavItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors duration-200 ${
                  isActive
                    ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.name}</span>
            </NavLink>
          ))}
          
          {/* Sign Out Button */}
          <button
            onClick={handleSignOut}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors duration-200 text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <LogOut size={20} />
            <span className="font-medium">Sign Out</span>
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