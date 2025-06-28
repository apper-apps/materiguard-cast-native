import { forwardRef } from 'react';
import ApperIcon from '@/components/ApperIcon';

const Input = forwardRef(({ 
  label, 
  error, 
  icon, 
  type = 'text', 
  className = '', 
  ...props 
}, ref) => {
  const inputClasses = `
    w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg
    focus:ring-2 focus:ring-primary focus:border-transparent
    transition-all duration-200 placeholder-gray-500
    ${error ? 'border-red-500 focus:ring-red-500' : ''}
    ${icon ? 'pl-12' : ''}
    ${className}
  `;

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <ApperIcon name={icon} className="w-5 h-5 text-gray-400" />
          </div>
        )}
        
        <input
          ref={ref}
          type={type}
          className={inputClasses}
          {...props}
        />
      </div>
      
      {error && (
        <p className="text-sm text-red-600 flex items-center mt-2">
          <ApperIcon name="AlertCircle" className="w-4 h-4 mr-1" />
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;