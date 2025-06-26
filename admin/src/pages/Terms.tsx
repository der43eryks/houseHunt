import React from 'react';
import { Link } from 'react-router-dom';

const Terms: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
    <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-blue-700 mb-4 text-center">Terms & Conditions</h2>
      <div className="text-gray-700 space-y-4 mb-8 text-sm">
        <p>
          <strong>Welcome to HouseHunt Admin!</strong> By registering and using this platform, you agree to the following terms and conditions. Please read them carefully.
        </p>
        <ol className="list-decimal list-inside space-y-2">
          <li>
            <strong>Account Responsibility:</strong> You are responsible for maintaining the confidentiality of your admin account and password.
          </li>
          <li>
            <strong>Data Accuracy:</strong> You agree to provide accurate and up-to-date information when creating or managing listings.
          </li>
          <li>
            <strong>Prohibited Use:</strong> You will not use the platform for any unlawful or fraudulent activities.
          </li>
          <li>
            <strong>Content Ownership:</strong> All content you upload must be owned by you or you must have permission to use it.
          </li>
          <li>
            <strong>Platform Changes:</strong> HouseHunt reserves the right to update these terms and the platform at any time.
          </li>
        </ol>
        <p>
          For the full legal text, please contact support or refer to the official documentation.
        </p>
      </div>
      <div className="text-center">
        <Link to="/register" className="text-blue-600 hover:underline font-medium">&larr; Back to Register</Link>
      </div>
    </div>
  </div>
);

export default Terms;