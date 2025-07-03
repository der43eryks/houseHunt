import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { adminAPI } from '../services/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { AdminRegisterSchema, AdminRegisterInput } from '../../../shared/types/validationSchemas';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, watch, setError, formState: { errors, isSubmitting } } = useForm<AdminRegisterInput>({
    resolver: zodResolver(AdminRegisterSchema),
    mode: 'onChange',
    defaultValues: { id: '', username: '', email: '', phone: '', password: '', confirmPassword: '', agree: false },
  });

  // Password strength logic
  const password = watch('password');
  const confirmPassword = watch('confirmPassword');
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const checkPasswordStrength = (password: string) => {
    const feedback: string[] = [];
    let score = 0;
    if (password.length >= 8) score += 1; else feedback.push('At least 8 characters');
    if (/[A-Z]/.test(password)) score += 1; else feedback.push('One uppercase letter');
    if (/[a-z]/.test(password)) score += 1; else feedback.push('One lowercase letter');
    if (/\d/.test(password)) score += 1; else feedback.push('One number');
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1; else feedback.push('One special character');
    return { score, feedback };
  };
  const passwordStrength = checkPasswordStrength(password || '');

  const onSubmit = async (data: AdminRegisterInput) => {
    try {
      const { confirmPassword, agree, ...payload } = data;
      const response = await adminAPI.register(payload);
      if (response.success) {
        navigate('/verify', { state: { email: data.email, registered: true } });
      } else {
        setError('root', { message: response.error || response.message || 'Registration failed' });
      }
    } catch (error: any) {
      setError('root', { message: error?.error || error?.message || 'Registration failed. Please try again.' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-lg p-8 flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold text-blue-700">Create Account</h2>
          <p className="text-gray-500 text-sm">Fill your information below to register as an admin.</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <label htmlFor="id" className="block text-sm text-gray-700 mb-1">ID Number</label>
            <input
              type="text"
              id="id"
              maxLength={8}
              autoComplete="off"
              {...register('id')}
              className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:outline-none bg-gray-50 text-gray-900 transition-colors duration-200 ${errors.id ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-200 focus:ring-blue-500 focus:border-blue-500'}`}
              required
            />
            {errors.id && <p className="mt-1 text-sm text-red-600 flex items-center"><span className="mr-1">⚠</span>{errors.id.message}</p>}
          </div>
          <div>
            <label htmlFor="username" className="block text-sm text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              id="username"
              autoComplete="name"
              {...register('username')}
              className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:outline-none bg-gray-50 text-gray-900 transition-colors duration-200 ${errors.username ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-200 focus:ring-blue-500 focus:border-blue-500'}`}
              required
            />
            {errors.username && <p className="mt-1 text-sm text-red-600 flex items-center"><span className="mr-1">⚠</span>{errors.username.message}</p>}
          </div>
          <div>
            <label htmlFor="email" className="block text-sm text-gray-700 mb-1">Email</label>
            <input
              type="email"
              id="email"
              autoComplete="email"
              {...register('email')}
              className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:outline-none bg-gray-50 text-gray-900 transition-colors duration-200 ${errors.email ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-200 focus:ring-blue-500 focus:border-blue-500'}`}
              required
            />
            {errors.email && <p className="mt-1 text-sm text-red-600 flex items-center"><span className="mr-1">⚠</span>{errors.email.message}</p>}
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              id="phone"
              autoComplete="tel"
              placeholder="+254712345678"
              {...register('phone')}
              className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:outline-none bg-gray-50 text-gray-900 transition-colors duration-200 ${errors.phone ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-200 focus:ring-blue-500 focus:border-blue-500'}`}
              required
            />
            {errors.phone && <p className="mt-1 text-sm text-red-600 flex items-center"><span className="mr-1">⚠</span>{errors.phone.message}</p>}
          </div>
          <div>
            <label htmlFor="password" className="block text-sm text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="new-password"
                {...register('password')}
                className={`w-full px-4 py-3 pr-12 rounded-xl border focus:ring-2 focus:outline-none bg-gray-50 text-gray-900 transition-colors duration-200 ${errors.password ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-200 focus:ring-blue-500 focus:border-blue-500'}`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                aria-label="Toggle password visibility"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" /></svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                )}
              </button>
            </div>
            {password && (
              <div className="mt-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Password strength:</span>
                  <span className={`font-medium ${passwordStrength.score <= 2 ? 'text-red-600' : passwordStrength.score <= 3 ? 'text-yellow-600' : passwordStrength.score <= 4 ? 'text-blue-600' : 'text-green-600'}`}>{passwordStrength.score <= 2 ? 'Weak' : passwordStrength.score <= 3 ? 'Fair' : passwordStrength.score <= 4 ? 'Good' : 'Strong'}</span>
                </div>
                <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                  <div className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.score <= 2 ? 'bg-red-500' : passwordStrength.score <= 3 ? 'bg-yellow-500' : passwordStrength.score <= 4 ? 'bg-blue-500' : 'bg-green-500'}`} style={{ width: `${(passwordStrength.score / 5) * 100}%` }} />
                </div>
                {passwordStrength.feedback.length > 0 && (
                  <div className="mt-2 text-xs text-gray-600">
                    <p className="font-medium mb-1">Requirements:</p>
                    <ul className="space-y-1">
                      {passwordStrength.feedback.map((item, index) => (
                        <li key={index} className="flex items-center"><span className="mr-1">•</span>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
            {errors.password && <p className="mt-1 text-sm text-red-600 flex items-center"><span className="mr-1">⚠</span>{errors.password.message}</p>}
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm text-gray-700 mb-1">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                autoComplete="new-password"
                {...register('confirmPassword')}
                className={`w-full px-4 py-3 pr-12 rounded-xl border focus:ring-2 focus:outline-none bg-gray-50 text-gray-900 transition-colors duration-200 ${errors.confirmPassword ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : confirmPassword && password && confirmPassword === password ? 'border-green-300 focus:ring-green-500 focus:border-green-500' : 'border-gray-200 focus:ring-blue-500 focus:border-blue-500'}`}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                aria-label="Toggle confirm password visibility"
              >
                {showConfirmPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" /></svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                )}
              </button>
            </div>
            {confirmPassword && password && (
              <p className={`mt-1 text-sm flex items-center ${confirmPassword === password ? 'text-green-600' : 'text-red-600'}`}>
                <span className="mr-1">{confirmPassword === password ? '✓' : '⚠'}</span>
                {confirmPassword === password ? 'Passwords match' : 'Passwords do not match'}
              </p>
            )}
            {errors.confirmPassword && <p className="mt-1 text-sm text-red-600 flex items-center"><span className="mr-1">⚠</span>{errors.confirmPassword.message}</p>}
          </div>
          <div className="flex items-center mb-2">
            <input
              id="terms"
              type="checkbox"
              {...register('agree')}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="terms" className="ml-2 text-sm text-gray-700 select-none cursor-pointer">
              I agree to the <a href="/terms" className="text-blue-600 hover:underline">Terms & Conditions</a>
            </label>
          </div>
          {errors.agree && <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg border border-red-200">{errors.agree.message}</div>}
          {errors.root && <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg border border-red-200">{errors.root.message}</div>}
          <button
            type="submit"
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating Account...' : 'Sign Up'}
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