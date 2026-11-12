import React from 'react';

function PageLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="flex flex-col items-center gap-4">
        <div className="relative flex items-center justify-center w-16 h-16">
          <div className="absolute inset-0 bg-primary animate-ping rounded-full opacity-75"></div>
          <div className="relative w-12 h-12 bg-primary rounded-full"></div>
        </div>
        <p className="text-white text-sm">Loading...</p>
      </div>
    </div>
  );
}

export default PageLoader;
