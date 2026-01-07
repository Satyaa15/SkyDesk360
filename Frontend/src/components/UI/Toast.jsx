import React from 'react';

const Toast = ({ message }) => {
  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 glass px-8 py-4 z-[100] border-[#00f2fe]/40 animate-in slide-in-from-bottom-10">
      <div className="flex items-center gap-4">
        <div className="w-2 h-2 rounded-full bg-[#00f2fe] animate-pulse"></div>
        <span className="text-sm font-bold tracking-wide">{message}! Complete booking on the right.</span>
      </div>
    </div>
  );
};

export default Toast;