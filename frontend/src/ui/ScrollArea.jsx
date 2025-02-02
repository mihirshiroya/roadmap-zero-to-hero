import React from 'react';

const ScrollArea = ({ className = "", children }) => {
  return (
    <div className={`overflow-auto max-h-[600px] ${className}`}>
      {children}
    </div>
  );
};

export default ScrollArea; 