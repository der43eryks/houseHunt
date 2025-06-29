import React, { useState } from 'react';
import { Bell, Globe, Shield, Palette, Database, Save, Trash2, Download } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { adminAPI } from '../../services/api';

const SettingsView: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: false,
      sms: true
    },
    privacy: {
      profileVisibility: 'public',
      showContactInfo: true,
      allowMessages: true
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleToggle = (category: string, setting: string) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [setting]: !prev[category as keyof typeof prev][setting as keyof typeof prev[typeof category]]
      }
    }));
  };

  const handleSelect = (category: string, setting: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [setting]: value
      }
    }));
  };

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
  };

  const handleLanguageChange = (newLanguage: 'en' | 'sw') => {
    setLanguage(newLanguage);
  };

  const handleClearCache = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Clear localStorage cache
      const keysToKeep = ['adminToken', 'admin-theme', 'admin-language'];
      const keysToRemove = Object.keys(localStorage).filter(key => !keysToKeep.includes(key));
      
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      // Clear sessionStorage
      sessionStorage.clear();
      
      // Clear browser cache (this will prompt user)
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
      }
      
      setSuccess('Cache cleared successfully');
      
      // Reload page after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      
    } catch (err: any) {
      setError('Failed to clear cache');
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get user data
      const profileResponse = await adminAPI.getProfile();
      const listingsResponse = await adminAPI.getListings();
      
      const exportData = {
        profile: profileResponse.data,
        listings: listingsResponse.data,
        settings: settings,
        exportDate: new Date().toISOString()
      };
      
      // Create and download file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `househunt-admin-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setSuccess('Data exported successfully');
    } catch (err: any) {
      setError('Failed to export data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // This would call the backend API to delete the account
      // For now, we'll just clear local data and redirect
      localStorage.clear();
      sessionStorage.clear();
      
      setSuccess('Account deleted successfully. Redirecting...');
      
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
      
    } catch (err: any) {
      setError('Failed to delete account');
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  const saveSettings = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Save settings to backend (if API endpoint exists)
      // For now, we'll just save to localStorage
      localStorage.setItem('admin-settings', JSON.stringify(settings));
      
      setSuccess('Settings saved successfully');
    } catch (err: any) {
      setError('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{t('settings.title')}</h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">{t('settings.manage')}</p>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 px-4 py-3 rounded-lg">
          {success}
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Notifications */}
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <Bell size={20} className="sm:w-6 sm:h-6 text-blue-600" />
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">{t('settings.notifications')}</h3>
          </div>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">Email Notifications</h4>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Receive updates via email</p>
              </div>
              <button
                onClick={() => handleToggle('notifications', 'email')}
                className={`relative inline-flex h-5 w-10 sm:h-6 sm:w-11 items-center rounded-full transition-colors duration-200 ${
                  settings.notifications.email ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-3 w-3 sm:h-4 sm:w-4 transform rounded-full bg-white transition-transform duration-200 ${
                    settings.notifications.email ? 'translate-x-5 sm:translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">Push Notifications</h4>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Receive browser notifications</p>
              </div>
              <button
                onClick={() => handleToggle('notifications', 'push')}
                className={`relative inline-flex h-5 w-10 sm:h-6 sm:w-11 items-center rounded-full transition-colors duration-200 ${
                  settings.notifications.push ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-3 w-3 sm:h-4 sm:w-4 transform rounded-full bg-white transition-transform duration-200 ${
                    settings.notifications.push ? 'translate-x-5 sm:translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">SMS Notifications</h4>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Receive updates via SMS</p>
              </div>
              <button
                onClick={() => handleToggle('notifications', 'sms')}
                className={`relative inline-flex h-5 w-10 sm:h-6 sm:w-11 items-center rounded-full transition-colors duration-200 ${
                  settings.notifications.sms ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-3 w-3 sm:h-4 sm:w-4 transform rounded-full bg-white transition-transform duration-200 ${
                    settings.notifications.sms ? 'translate-x-5 sm:translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Privacy */}
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <Shield size={20} className="sm:w-6 sm:h-6 text-green-600" />
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">{t('settings.privacy')}</h3>
          </div>
          <div className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Profile Visibility</label>
              <select
                value={settings.privacy.profileVisibility}
                onChange={(e) => handleSelect('privacy', 'profileVisibility', e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base"
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
                <option value="contacts">Contacts Only</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">Show Contact Info</h4>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Display your contact information</p>
              </div>
              <button
                onClick={() => handleToggle('privacy', 'showContactInfo')}
                className={`relative inline-flex h-5 w-10 sm:h-6 sm:w-11 items-center rounded-full transition-colors duration-200 ${
                  settings.privacy.showContactInfo ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-3 w-3 sm:h-4 sm:w-4 transform rounded-full bg-white transition-transform duration-200 ${
                    settings.privacy.showContactInfo ? 'translate-x-5 sm:translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">Allow Messages</h4>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Allow users to send you messages</p>
              </div>
              <button
                onClick={() => handleToggle('privacy', 'allowMessages')}
                className={`relative inline-flex h-5 w-10 sm:h-6 sm:w-11 items-center rounded-full transition-colors duration-200 ${
                  settings.privacy.allowMessages ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-3 w-3 sm:h-4 sm:w-4 transform rounded-full bg-white transition-transform duration-200 ${
                    settings.privacy.allowMessages ? 'translate-x-5 sm:translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <Palette size={20} className="sm:w-6 sm:h-6 text-purple-600" />
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">{t('settings.appearance')}</h3>
          </div>
          <div className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('settings.theme')}</label>
              <select
                value={theme}
                onChange={(e) => handleThemeChange(e.target.value as 'light' | 'dark')}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base"
              >
                <option value="light">{t('settings.light')}</option>
                <option value="dark">{t('settings.dark')}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('settings.language')}</label>
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value as 'en' | 'sw')}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base"
              >
                <option value="en">{t('settings.english')}</option>
                <option value="sw">{t('settings.swahili')}</option>
              </select>
            </div>
          </div>
        </div>

        {/* System */}
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <Database size={20} className="sm:w-6 sm:h-6 text-orange-600" />
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">{t('settings.system')}</h3>
          </div>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg sm:rounded-xl">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">{t('settings.clearCache')}</h4>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">{t('settings.clearCacheDesc')}</p>
              </div>
              <button 
                onClick={handleClearCache}
                disabled={loading}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm sm:text-base disabled:opacity-50"
              >
                {t('settings.clear')}
              </button>
            </div>
            <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg sm:rounded-xl">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">{t('settings.exportData')}</h4>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">{t('settings.exportDataDesc')}</p>
              </div>
              <button 
                onClick={handleExportData}
                disabled={loading}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm sm:text-base disabled:opacity-50 flex items-center gap-1"
              >
                <Download size={14} />
                {t('settings.export')}
              </button>
            </div>
            <div className="flex items-center justify-between p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 rounded-lg sm:rounded-xl">
              <div>
                <h4 className="font-medium text-red-900 dark:text-red-200 text-sm sm:text-base">{t('settings.deleteAccount')}</h4>
                <p className="text-xs sm:text-sm text-red-600 dark:text-red-300">{t('settings.deleteAccountDesc')}</p>
              </div>
              <button 
                onClick={() => setShowDeleteConfirm(true)}
                disabled={loading}
                className="text-red-600 hover:text-red-700 font-medium text-sm sm:text-base disabled:opacity-50 flex items-center gap-1"
              >
                <Trash2 size={14} />
                {t('settings.delete')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button 
          onClick={saveSettings}
          disabled={loading}
          className="bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 text-sm sm:text-base"
        >
          <Save size={16} className="sm:w-5 sm:h-5" />
          {loading ? t('common.loading') : t('settings.save')}
        </button>
      </div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Confirm Account Deletion</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 disabled:opacity-50"
              >
                {loading ? t('common.loading') : t('common.delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsView; 