import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';

const VerifyPage = () => {
  const [code, setCode] = useState(['', '', '', '']);
  const inputsRef = useRef([]);

  const handleInputChange = (e, index) => {
    const { value } = e.target;
    if (/^[0-9]$/.test(value) || value === '') {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      // Move to next input
      if (value !== '' && index < 3) {
        inputsRef.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    // Move to previous input on backspace
    if (e.key === 'Backspace' && code[index] === '' && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };
  
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 4);
    if (/^[0-9]{4}$/.test(pastedData)) {
      const newCode = pastedData.split('');
      setCode(newCode);
      inputsRef.current[3].focus();
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-4">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold mb-4">Verify Your Account</h1>
        <p className="text-gray-400 mb-8">
          Enter the 4-digit code sent to your email address.
        </p>
        
        <div className="flex justify-center gap-3 mb-8" onPaste={handlePaste}>
          {code.map((digit, index) => (
            <input
              key={index}
              ref={el => inputsRef.current[index] = el}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleInputChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-16 h-16 bg-gray-800 border-2 border-gray-700 rounded-lg text-center text-3xl font-bold focus:outline-none focus:border-blue-500 transition"
            />
          ))}
        </div>

        <button className="w-full bg-blue-600 text-white font-bold py-4 rounded-lg hover:bg-blue-700 transition-colors duration-300 text-lg">
          Verify Email
        </button>

        <div className="mt-6">
          <Link to="/" className="text-gray-500 hover:text-white transition-colors">
            Skip for now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyPage;
