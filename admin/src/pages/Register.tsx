import React, { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { adminAPI } from '../services/api';
import { debounce } from '../utils/debounce';

interface ValidationErrors {
  id?: string;
  username?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

interface PasswordStrength {
  score: number;
  feedback: string[];
}

const Register: React.FC = () => {
  const [id, setId] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agree, setAgree] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({ score: 0, feedback: [] });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState<boolean | null>(null);
  const navigate = useNavigate();

  // Validation functions
  const validateId = (id: string): string | null => {
    if (!id.trim()) {
      return 'ID is required';
    }
    
    // Check if it's exactly 8 digits
    const idRegex = /^\d{8}$/;
    if (!idRegex.test(id.trim())) {
      return 'ID must be exactly 8 digits';
    }
    
    // Check if it doesn't start with 00
    if (id.trim().startsWith('00')) {
      return 'ID cannot start with 00';
    }
    
    return null;
  };

  const validateUsername = (username: string): string | null => {
    if (!username.trim()) {
      return 'Full name is required';
    }
    
    if (username.trim().length < 2) {
      return 'Full name must be at least 2 characters long';
    }
    
    if (username.trim().length > 50) {
      return 'Full name must be less than 50 characters';
    }
    
    // Allow letters, numbers, spaces, and underscores
    const usernameRegex = /^[a-zA-Z0-9_\s]+$/;
    if (!usernameRegex.test(username.trim())) {
      return 'Full name can only contain letters, numbers, spaces, and underscores';
    }
    
    return null;
  };

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

  const validatePhone = (phone: string): string | null => {
    if (!phone.trim()) {
      return 'Phone is required';
    }
    
    const phoneRegex = /^\+254\d{9}$/;
    if (!phoneRegex.test(phone)) {
      return 'Phone number must be in Kenyan format: +254XXXXXXXXX';
    }
    
    return null;
  };

  const validatePassword = (password: string): string | null => {
    if (!password.trim()) {
      return 'Password is required';
    }
    
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    
    if (password.length > 16) {
      return 'Password must be less than 16 characters long';
    }
    
    return null;
  };

  const validateConfirmPassword = (confirmPassword: string, password: string): string | null => {
    if (!confirmPassword.trim()) {
      return 'Please confirm your password';
    }
    
    if (confirmPassword !== password) {
      return 'Passwords do not match';
    }
    
    return null;
  };

  const checkPasswordStrength = (password: string): PasswordStrength => {
    const feedback: string[] = [];
    let score = 0;
    
    // Length check
    if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push('At least 8 characters');
    }
    
    // Uppercase check
    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('One uppercase letter');
    }
    
    // Lowercase check
    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('One lowercase letter');
    }
    
    // Number check
    if (/\d/.test(password)) {
      score += 1;
    } else {
      feedback.push('One number');
    }
    
    // Special character check
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      score += 1;
    } else {
      feedback.push('One special character');
    }
    
    return { score, feedback };
  };

  // Debounced validation functions
  const debouncedValidateId = useCallback(
    debounce((value: string) => {
      const error = validateId(value);
      setErrors(prev => ({ ...prev, id: error || undefined }));
    }, 300),
    []
  );

  const debouncedValidateUsername = useCallback(
    debounce((value: string) => {
      const error = validateUsername(value);
      setErrors(prev => ({ ...prev, username: error || undefined }));
    }, 300),
    []
  );

  const debouncedValidateEmail = useCallback(
    debounce((value: string) => {
      const error = validateEmail(value);
      setErrors(prev => ({ ...prev, email: error || undefined }));
    }, 300),
    []
  );

  const debouncedValidatePhone = useCallback(
    debounce((value: string) => {
      const error = validatePhone(value);
      setErrors(prev => ({ ...prev, phone: error || undefined }));
    }, 300),
    []
  );

  const debouncedValidatePassword = useCallback(
    debounce((value: string) => {
      const error = validatePassword(value);
      setErrors(prev => ({ ...prev, password: error || undefined }));
      setPasswordStrength(checkPasswordStrength(value));
    }, 300),
    []
  );

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    
    // Validate ID
    const idError = validateId(id);
    if (idError) {
      newErrors.id = idError;
    }
    
    // Validate username
    const usernameError = validateUsername(username);
    if (usernameError) {
      newErrors.username = usernameError;
    }
    
    // Validate email
    const emailError = validateEmail(email);
    if (emailError) {
      newErrors.email = emailError;
    }
    
    // Validate phone
    const phoneError = validatePhone(phone);
    if (phoneError) {
      newErrors.phone = phoneError;
    }
    
    // Validate password
    const passwordError = validatePassword(password);
    if (passwordError) {
      newErrors.password = passwordError;
    }
    
    // Validate confirm password
    const confirmPasswordError = validateConfirmPassword(confirmPassword, password);
    if (confirmPasswordError) {
      newErrors.confirmPassword = confirmPasswordError;
    }
    
    // Check terms agreement
    if (!agree) {
      newErrors.general = 'Please agree to the terms and conditions';
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
      const response = await adminAPI.register({
        id: id.trim(),
        username: username.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password: password
      });

      if (response.success) {
        // Navigate to verify page with email
        navigate('/verify', { state: { email: email.trim() } });
      } else {
        setErrors({ general: response.message || 'Registration failed' });
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ general: 'Registration failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Only allow digits
    if (value.length <= 8) { // Limit to 8 digits
      setId(value);
      debouncedValidateId(value);
    }
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(value);
    debouncedValidateUsername(value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    debouncedValidateEmail(value);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhone(value);
    debouncedValidatePhone(value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    debouncedValidatePassword(value);
    
    // Check password match in real-time
    if (confirmPassword) {
      setPasswordsMatch(value === confirmPassword);
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);
    
    // Check password match in real-time
    if (password) {
      setPasswordsMatch(value === password);
    }
    
    // Clear error when user starts typing
    if (errors.confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: undefined }));
    }
  };

  const handleAgreeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAgree(e.target.checked);
    if (errors.general) {
      setErrors(prev => ({ ...prev, general: undefined }));
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength.score <= 2) return 'text-red-600';
    if (passwordStrength.score <= 3) return 'text-yellow-600';
    if (passwordStrength.score <= 4) return 'text-blue-600';
    return 'text-green-600';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength.score <= 2) return 'Weak';
    if (passwordStrength.score <= 3) return 'Fair';
    if (passwordStrength.score <= 4) return 'Good';
    return 'Strong';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-lg p-8 flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold text-blue-700">Create Account</h2>
          <p className="text-gray-500 text-sm">Fill your information below to register as an admin.</p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">ID Number</label>
            <input
              type="text"
              value={id}
              onChange={handleIdChange}
              placeholder="12345678"
              autoComplete="off"
              maxLength={8}
              className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:outline-none bg-gray-50 text-gray-900 transition-colors duration-200 ${
                errors.id 
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                  : 'border-gray-200 focus:ring-blue-500 focus:border-blue-500'
              }`}
              required
            />
            {errors.id && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <span className="mr-1">⚠</span>
                {errors.id}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              value={username}
              onChange={handleUsernameChange}
              placeholder="Ex. John Doe"
              autoComplete="name"
              className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:outline-none bg-gray-50 text-gray-900 transition-colors duration-200 ${
                errors.username 
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                  : 'border-gray-200 focus:ring-blue-500 focus:border-blue-500'
              }`}
              required
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <span className="mr-1">⚠</span>
                {errors.username}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="example@gmail.com"
              autoComplete="email"
              className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:outline-none bg-gray-50 text-gray-900 transition-colors duration-200 ${
                errors.email 
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                  : 'border-gray-200 focus:ring-blue-500 focus:border-blue-500'
              }`}
              required
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <span className="mr-1">⚠</span>
                {errors.email}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              value={phone}
              onChange={handlePhoneChange}
              placeholder="+254712345678"
              autoComplete="tel"
              className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:outline-none bg-gray-50 text-gray-900 transition-colors duration-200 ${
                errors.phone 
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                  : 'border-gray-200 focus:ring-blue-500 focus:border-blue-500'
              }`}
              required
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <span className="mr-1">⚠</span>
                {errors.phone}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={handlePasswordChange}
                placeholder="********"
                autoComplete="new-password"
                className={`w-full px-4 py-3 pr-12 rounded-xl border focus:ring-2 focus:outline-none bg-gray-50 text-gray-900 transition-colors duration-200 ${
                  errors.password 
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-200 focus:ring-blue-500 focus:border-blue-500'
                }`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {password && (
              <div className="mt-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Password strength:</span>
                  <span className={`font-medium ${getPasswordStrengthColor()}`}>
                    {getPasswordStrengthText()}
                  </span>
                </div>
                <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      passwordStrength.score <= 2 ? 'bg-red-500' :
                      passwordStrength.score <= 3 ? 'bg-yellow-500' :
                      passwordStrength.score <= 4 ? 'bg-blue-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                  />
                </div>
                {passwordStrength.feedback.length > 0 && (
                  <div className="mt-2 text-xs text-gray-600">
                    <p className="font-medium mb-1">Requirements:</p>
                    <ul className="space-y-1">
                      {passwordStrength.feedback.map((item, index) => (
                        <li key={index} className="flex items-center">
                          <span className="mr-1">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
            {errors.password && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <span className="mr-1">⚠</span>
                {errors.password}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Confirm Password</label>
            <div className="relative">
            <input
                type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              placeholder="********"
              autoComplete="new-password"
                className={`w-full px-4 py-3 pr-12 rounded-xl border focus:ring-2 focus:outline-none bg-gray-50 text-gray-900 transition-colors duration-200 ${
                errors.confirmPassword 
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                    : confirmPassword && passwordsMatch === false
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                    : confirmPassword && passwordsMatch === true
                    ? 'border-green-300 focus:ring-green-500 focus:border-green-500'
                  : 'border-gray-200 focus:ring-blue-500 focus:border-blue-500'
              }`}
              required
            />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {confirmPassword && passwordsMatch !== null && (
              <p className={`mt-1 text-sm flex items-center ${
                passwordsMatch ? 'text-green-600' : 'text-red-600'
              }`}>
                <span className="mr-1">{passwordsMatch ? '✓' : '⚠'}</span>
                {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
              </p>
            )}
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <span className="mr-1">⚠</span>
                {errors.confirmPassword}
              </p>
            )}
          </div>
          <div className="flex items-center mb-2">
            <input
              id="terms"
              type="checkbox"
              checked={agree}
              onChange={handleAgreeChange}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              required
            />
            <label htmlFor="terms" className="ml-2 block text-xs text-gray-600">
              Agree with <Link to="/terms" className="text-blue-700 hover:underline">Terms &amp; Condition</Link>
            </label>
          </div>
          {errors.general && (
            <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg border border-red-200">
              {errors.general}
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!agree || isLoading || (confirmPassword && passwordsMatch === false)}
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        <div className="text-center mt-4 text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/" className="text-blue-700 font-semibold hover:underline">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default Register; 