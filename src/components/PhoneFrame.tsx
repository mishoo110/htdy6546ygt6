import React from 'react';

interface PhoneFrameProps {
  children: React.ReactNode;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({ children }) => {
  return (
    <div className="relative mx-auto flex flex-col items-center w-full min-h-screen bg-white">
      {/* Exact clean mobile viewport container - pure white, no status bar, no bottom bar */}
      <div className="relative w-full max-w-[420px] bg-white min-h-screen sm:min-h-[820px] flex flex-col sm:shadow-md sm:border sm:border-slate-100 overflow-hidden">
        {/* Content Viewport */}
        <div className="relative flex-1 flex flex-col overflow-y-auto overflow-x-hidden bg-white select-none">
          {children}
        </div>
      </div>
    </div>
  );
};
