import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'sw';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

// Translation keys
const translations = {
  en: {
    // Profile
    'profile.settings': 'Profile Settings',
    'profile.manage': 'Manage your account information and preferences',
    'profile.edit': 'Edit Profile',
    'profile.cancel': 'Cancel',
    'profile.save': 'Save Changes',
    'profile.saving': 'Saving...',
    'profile.username': 'Username',
    'profile.email': 'Email Address',
    'profile.phone': 'Phone Number',
    'profile.role': 'Role',
    'profile.notProvided': 'Not provided',
    
    // Settings
    'settings.title': 'Settings',
    'settings.manage': 'Manage your application preferences',
    'settings.notifications': 'Notifications',
    'settings.privacy': 'Privacy',
    'settings.appearance': 'Appearance',
    'settings.system': 'System',
    'settings.save': 'Save Settings',
    'settings.theme': 'Theme',
    'settings.language': 'Language',
    'settings.light': 'Light',
    'settings.dark': 'Dark',
    'settings.english': 'English',
    'settings.swahili': 'Swahili',
    'settings.clearCache': 'Clear Cache',
    'settings.clearCacheDesc': 'Clear application cache',
    'settings.clear': 'Clear',
    'settings.deleteAccount': 'Delete Account',
    'settings.deleteAccountDesc': 'Permanently delete your account',
    'settings.delete': 'Delete',
    'settings.changePassword': 'Change Password',
    'settings.currentPassword': 'Current Password',
    'settings.newPassword': 'New Password',
    'settings.confirmPassword': 'Confirm New Password',
    'settings.updatePassword': 'Update Password',
    'settings.updating': 'Updating...',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.confirm': 'Confirm',
    'common.delete': 'Delete',
    'common.save': 'Save',
    'settings.exportData': 'Export Data',
    'settings.exportDataDesc': 'Download your data',
    'settings.export': 'Export',
  },
  sw: {
    // Profile
    'profile.settings': 'Mipangilio ya Wasifu',
    'profile.manage': 'Dhibiti maelezo ya akaunti yako na mapendeleo',
    'profile.edit': 'Hariri Wasifu',
    'profile.cancel': 'Ghairi',
    'profile.save': 'Hifadhi Mabadiliko',
    'profile.saving': 'Inahifadhi...',
    'profile.username': 'Jina la Mtumiaji',
    'profile.email': 'Barua Pepe',
    'profile.phone': 'Nambari ya Simu',
    'profile.role': 'Jukumu',
    'profile.notProvided': 'Haijatolewa',
    
    // Settings
    'settings.title': 'Mipangilio',
    'settings.manage': 'Dhibiti mapendeleo ya programu',
    'settings.notifications': 'Arifa',
    'settings.privacy': 'Faragha',
    'settings.appearance': 'Muonekano',
    'settings.system': 'Mfumo',
    'settings.save': 'Hifadhi Mipangilio',
    'settings.theme': 'Muundo',
    'settings.language': 'Lugha',
    'settings.light': 'Mwanga',
    'settings.dark': 'Giza',
    'settings.english': 'Kiingereza',
    'settings.swahili': 'Kiswahili',
    'settings.clearCache': 'Futa Cache',
    'settings.clearCacheDesc': 'Futa cache ya programu',
    'settings.clear': 'Futa',
    'settings.deleteAccount': 'Futa Akaunti',
    'settings.deleteAccountDesc': 'Futa akaunti yako kwa kudumu',
    'settings.delete': 'Futa',
    'settings.changePassword': 'Badilisha Neno la Siri',
    'settings.currentPassword': 'Neno la Siri la Sasa',
    'settings.newPassword': 'Neno la Siri Jipya',
    'settings.confirmPassword': 'Thibitisha Neno la Siri Jipya',
    'settings.updatePassword': 'Sasisha Neno la Siri',
    'settings.updating': 'Inasasisha...',
    
    // Common
    'common.loading': 'Inapakia...',
    'common.error': 'Hitilafu',
    'common.success': 'Mafanikio',
    'common.cancel': 'Ghairi',
    'common.confirm': 'Thibitisha',
    'common.delete': 'Futa',
    'common.save': 'Hifadhi',
    'settings.exportData': 'Hamisha Data',
    'settings.exportDataDesc': 'Pakua data yako',
    'settings.export': 'Hamisha',
  }
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('admin-language');
    return (savedLanguage as Language) || 'en';
  });

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    localStorage.setItem('admin-language', newLanguage);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  const value = {
    language,
    setLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}; 