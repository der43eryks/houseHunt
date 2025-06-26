import React from 'react';

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const AuthInput: React.FC<AuthInputProps> = ({ label, error, ...props }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        {...props}
        className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 bg-gray-50 text-gray-800 transition-colors duration-200 ${
          error 
            ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
        }`}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600 flex items-center">
          <span className="mr-1">⚠</span>
          {error}
        </p>
      )}
    </div>
  );
};

export default AuthInput; 