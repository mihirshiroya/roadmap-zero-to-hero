import React from 'react';

const Collapse = ({ isOpen, children }) => {
  return (
    <div
      className={`bg-background
        transition-all duration-200 ease-in-out
        ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}
      `}
    >
      {children}
    </div>
  );
};

export default Collapse; 