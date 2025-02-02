import React from 'react';

const variants = {
  default: "bg-primary text-white hover:bg-primary/90",
  outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
  ghost: "hover:bg-accent hover:text-accent-foreground",
};

const Button = ({ 
  children, 
  variant = "default", 
  className = "", 
  disabled = false,
  ...props 
}) => {
  return (
    <button
      className={`
        inline-flex items-center justify-center
        rounded-md text-sm font-medium
        transition-colors
        focus-visible:outline-none focus-visible:ring-1
        focus-visible:ring-ring
        disabled:pointer-events-none disabled:opacity-50
        px-4 py-2
        ${variants[variant]}
        ${className}
      `}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button; 