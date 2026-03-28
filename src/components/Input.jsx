import React from 'react';

const Input = React.forwardRef(({ label, error, className = "", ...props }, ref) => {
  return (
    <div className="form-control w-full">
      {label && (
        <label className="label pb-1">
          <span className="label-text font-medium text-drtext/80 drop-shadow-sm">{label}</span>
        </label>
      )}
      <input 
        ref={ref}
        className={`input glass-input w-full ${error ? "border-red-500/50" : ""} ${className}`} 
        {...props} 
      />
      {error && (
        <label className="label">
          <span className="label-text-alt text-red-400">{error}</span>
        </label>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
