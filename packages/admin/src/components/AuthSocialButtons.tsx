import React from 'react';
import { Globe } from 'lucide-react';

const AppleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16.5 13.9999C16.5 13.3399 16.68 12.7299 17 12.1899C16.43 11.7099 15.75 11.4199 15.02 11.4199C14.15 11.4199 13.43 11.8199 12.91 12.3399C12.4 11.8199 11.63 11.3799 10.79 11.3799C10.02 11.3799 9.29002 11.6999 8.69002 12.2499C9.09002 12.8299 9.30002 13.4899 9.30002 14.2099C9.30002 16.0199 8.24002 17.2499 7.00002 17.2499C6.07002 17.2499 5.25002 16.7399 4.79002 16.0999C5.46002 18.0299 7.01002 19.4999 8.94002 19.4999C9.88002 19.4999 10.77 19.1499 11.49 18.5999C12.2 19.1299 13.13 19.4999 14.02 19.4999C15.93 19.4999 17.51 18.0699 18.15 16.1499C17.22 15.6599 16.5 14.8899 16.5 13.9999Z" />
        <path d="M14.75,10.64C15.22,10.07 15.54,9.36 15.68,8.55C14.83,8.44 14.04,8.87 13.55,9.45C13.06,9.99 12.6,10.66 12.42,11.44C13.29,11.53 14.16,11.2 14.75,10.64Z" />
    </svg>
)

const MicrosoftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 21 21" fill="currentColor">
        <path d="M10,0H0V10H10V0Z" fill="#f25022"/>
        <path d="M21,0H11V10H21V0Z" fill="#7fba00"/>
        <path d="M10,11H0V21H10V11Z" fill="#00a4ef"/>
        <path d="M21,11H11V21H21V11Z" fill="#ffb900"/>
    </svg>
)

const AuthSocialButtons = () => {
    return (
        <div className="flex justify-center items-center gap-4">
            <button className="w-12 h-12 flex items-center justify-center bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
                <AppleIcon />
            </button>
            <button className="w-12 h-12 flex items-center justify-center bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
                <Globe size={20} className="text-gray-700"/>
            </button>
            <button className="w-12 h-12 flex items-center justify-center bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
                <MicrosoftIcon />
      </button>
  </div>
);
};

export default AuthSocialButtons; 