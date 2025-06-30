import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const CODE_LENGTH = 4;

const Verify: React.FC = () => {
  const [code, setCode] = useState(Array(CODE_LENGTH).fill(''));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || 'example@gmail.com'; // Get email from navigation state

  const handleChange = (idx: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newCode = [...code];
    newCode[idx] = value;
    setCode(newCode);
    // Move to next input if filled
    if (value && idx < CODE_LENGTH - 1) {
      const next = document.getElementById(`code-${idx + 1}`);
      if (next) (next as HTMLInputElement).focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if all digits are filled
    const verificationCode = code.join('');
    if (verificationCode.length !== CODE_LENGTH) {
      setError('Please enter the complete verification code');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, accept any 4-digit code
      // In a real application, this would call the backend verification API
      if (verificationCode.length === CODE_LENGTH && /^\d{4}$/.test(verificationCode)) {
        // Success - redirect to login page
        navigate('/', { state: { verified: true, email } });
      } else {
        setError('Invalid verification code. Please try again.');
      }
    } catch (error) {
      setError('Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real application, this would call the backend to resend the code
      alert(`Verification code resent to ${email}`);
    } catch (error) {
      setError('Failed to resend code. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  const isCodeComplete = code.every(digit => digit !== '');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl p-8 flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold text-gray-900">Verify Code</h2>
          <p className="text-gray-500 text-sm">
            Please enter the code we just sent to email<br />
            <span className="text-purple-700 font-semibold">{email}</span>
          </p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex justify-between gap-2 mb-2">
            {code.map((digit, idx) => (
              <input
                key={idx}
                id={`code-${idx}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={e => handleChange(idx, e.target.value)}
                className="w-12 h-12 text-center text-2xl border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50 text-gray-900"
                disabled={isLoading}
              />
            ))}
          </div>
          {error && (
            <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg border border-red-200">
              {error}
            </div>
          )}
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-500">Didn't receive OTP?</span>
            <button 
              type="button" 
              onClick={handleResendCode}
              disabled={isResending}
              className="text-xs text-purple-700 font-semibold hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isResending ? 'Sending...' : 'Resend code'}
            </button>
          </div>
          <button
            type="submit"
            disabled={!isCodeComplete || isLoading}
            className="w-full bg-purple-700 hover:bg-purple-800 disabled:bg-purple-400 text-white font-semibold py-3 rounded-xl transition disabled:cursor-not-allowed"
          >
            {isLoading ? 'Verifying...' : 'Verify'}
          </button>
        </form>
        <div className="text-center mt-4 text-sm text-gray-600">
          <Link to="/" className="text-purple-700 font-semibold hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Verify; 