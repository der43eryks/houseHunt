import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthInput from '../components/AuthInput';
import { adminAPI } from '../services/api';

interface ValidationErrors {
  email?: string;
  password?: string;
  general?: string;
}

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const navigate = useNavigate();
  const location = useLocation();
  const [showVerificationSuccess, setShowVerificationSuccess] = useState(false);

  React.useEffect(() => {
    if (location.state?.verified) {
      setShowVerificationSuccess(true);
    }
  }, [location.state]);

  // Validation functions
  const validateEmail = (email: string): string | null => {
    if (!email.trim()) {
      return 'Email is required';
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    
    return null;
  };

  const validatePassword = (password: string): string | null => {
    if (!password.trim()) {
      return 'Password is required';
    }
    
    if (password.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    
    return null;
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    
    // Validate email
    const emailError = validateEmail(email);
    if (emailError) {
      newErrors.email = emailError;
    }
    
    // Validate password
    const passwordError = validatePassword(password);
    if (passwordError) {
      newErrors.password = passwordError;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Early return if validation fails
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setErrors({});
    
    try {
      const res = await adminAPI.login({ email, password });
      
      if (res.success && res.data?.admin) {
        navigate('/dashboard');
      } else {
        setErrors({ general: res.error || 'Login failed. Please check your credentials.' });
      }
    } catch (err: any) {
      setErrors({ general: err?.error || 'Login failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    // Clear email error when user starts typing
    if (errors.email) {
      setErrors(prev => ({ ...prev, email: undefined }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    // Clear password error when user starts typing
    if (errors.password) {
      setErrors(prev => ({ ...prev, password: undefined }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-blue-700">Sign In</h2>
          <p className="text-gray-500 mt-2">Hi! Welcome back, you've been missed</p>
        </div>
        {showVerificationSuccess && (
          <div className="text-green-700 text-sm text-center bg-green-50 p-3 rounded-lg border border-green-200 mb-4">
            Verification successful! You can now log in.
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <AuthInput
              label="Email"
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="example@gmail.com"
              autoComplete="email"
              required
              error={errors.email}
            />
          </div>
          <div>
            <AuthInput
              label="Password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="********"
              autoComplete="current-password"
              required
              error={errors.password}
            />
          </div>
          {errors.general && (
            <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg border border-red-200">
              {errors.general}
            </div>
          )}
          <div className="flex justify-end -mt-2 mb-4">
            <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">Forgot Password?</Link>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        <div className="text-center mt-8 text-sm">
          <span className="text-gray-600">Don't have an account? </span>
          <Link to="/register" className="font-semibold text-blue-600 hover:underline">Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login; 