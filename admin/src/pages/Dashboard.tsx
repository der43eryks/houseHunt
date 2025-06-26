import React from 'react';
import { useLocation } from 'react-router-dom';
import AdminLayout from '../components/dashboard/AdminLayout';
import DashboardContent from '../components/dashboard/DashboardContent';
import ListingsView from '../components/dashboard/ListingsView';
import AddListingView from '../components/dashboard/AddListingView';
import ProfileView from '../components/dashboard/ProfileView';
import SettingsView from '../components/dashboard/SettingsView';

const Dashboard: React.FC = () => {
  const location = useLocation();
  
  const getCurrentView = () => {
    const path = location.pathname;
    
    switch (path) {
      case '/dashboard/listings':
        return <ListingsView />;
      case '/dashboard/add-listing':
        return <AddListingView />;
      case '/dashboard/profile':
        return <ProfileView />;
      case '/dashboard/settings':
        return <SettingsView />;
      default:
        return <DashboardContent />;
    }
  };

  const getTitle = () => {
    const path = location.pathname;
    
    switch (path) {
      case '/dashboard/listings':
        return 'Listings';
      case '/dashboard/add-listing':
        return 'Add Listing';
      case '/dashboard/profile':
        return 'Profile';
      case '/dashboard/settings':
        return 'Settings';
      default:
        return 'Dashboard';
    }
  };

  return (
    <AdminLayout title={getTitle()}>
      {getCurrentView()}
    </AdminLayout>
  );
};

export default Dashboard; 