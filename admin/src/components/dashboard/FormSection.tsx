import React from 'react';

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
}

const FormSection: React.FC<FormSectionProps> = ({ title, children }) => (
  <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
    <h3 className="font-bold text-lg mb-4 text-gray-900 border-b border-gray-200 pb-2">{title}</h3>
    {children}
  </div>
);

export default FormSection; 