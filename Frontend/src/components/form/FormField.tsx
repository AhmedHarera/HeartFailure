import React from 'react';

type FormFieldProps = {
  label: string;
  children: React.ReactNode;
  className?: string;
};

const FormField: React.FC<FormFieldProps> = ({ label, children, className = '' }) => {
  return (
    <div className={`mb-4 ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      {children}
    </div>
  );
};

export default FormField;