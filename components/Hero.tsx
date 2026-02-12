import React from 'react';

const Hero: React.FC = () => {
  return (
    <div className="relative min-h-screen sm:min-h-[60vh] flex items-center justify-center overflow-hidden bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50">
      {/* Decorative Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <pattern id="rajasthani" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="2" fill="#92400e" />
              <path d="M10 2 L18 10 L10 18 L2 10 Z" fill="none" stroke="#92400e" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#rajasthani)" />
        </svg>
      </div>

      <div className="relative z-10 text-center px-4 sm:px-6 animate-fadeIn w-full">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-amber-950 mb-2 sm:mb-4 tracking-tighter leading-tight">
          SHREE JI
        </h1>
        <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-amber-800 font-semibold tracking-widest mb-4 sm:mb-6 leading-relaxed">
          RAJASTHAN CULTURE
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-amber-700 px-2">
          <div className="hidden sm:block w-8 sm:w-12 h-1 bg-gradient-to-r from-transparent to-amber-700"></div>
          <p className="text-base sm:text-lg italic font-light">Heritage Treasures of Rajasthan</p>
          <div className="hidden sm:block w-8 sm:w-12 h-1 bg-gradient-to-l from-transparent to-amber-700"></div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-8 sm:top-10 left-4 sm:left-10 text-4xl sm:text-6xl animate-pulse" aria-hidden="true">✨</div>
      <div className="absolute bottom-8 sm:bottom-10 right-4 sm:right-10 text-4xl sm:text-6xl animate-pulse" aria-hidden="true">✨</div>
    </div>
  );
};

export default Hero;
