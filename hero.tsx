import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 relative overflow-hidden">
      {/* Subtle Background Pattern remains for texture as per the "white with rajasthani design" requirement */}
      <div className="absolute top-10 left-10 opacity-5 pointer-events-none">
        <svg width="200" height="200" viewBox="0 0 100 100" className="animate-spin-slow">
          <path d="M50 0 L60 40 L100 50 L60 60 L50 100 L40 60 L0 50 L40 40 Z" fill="#800000" />
        </svg>
      </div>

      <div className="ornate-border max-w-2xl fade-in">
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold text-rose-950 tracking-tight leading-none">
          Shree Ji
          <br />
          <span className="text-rose-800">Rajasthan Culture</span>
        </h1>
      </div>
    </section>
  );
};

export default Hero;