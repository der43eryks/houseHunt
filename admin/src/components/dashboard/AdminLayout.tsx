import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { useTheme } from '../../context/ThemeContext';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title }) => {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen flex transition-colors duration-200 overflow-x-hidden w-full max-w-full ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-slate-900 to-slate-800' 
        : 'bg-gradient-to-br from-gray-50 to-gray-100'
    }`}>
      <Sidebar />
      <div className="flex-1 flex flex-col pt-16 lg:pt-0 lg:ml-0">
        <Header title={title} />
        <main className="flex-1 container mx-auto px-2 sm:px-4 py-4 overflow-y-auto">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout; 