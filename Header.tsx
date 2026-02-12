import React from 'react';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onGoHome: () => void;
  onSearch: (query: string) => void;
  onOpenAuth: (mode: 'login' | 'signup') => void;
  searchQuery: string;
}

const Header: React.FC<HeaderProps> = (props: HeaderProps) => {
  const { cartCount, onOpenCart, onGoHome, onSearch, onOpenAuth, searchQuery } = props;
  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-rose-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between gap-4">
        {/* Logo */}
        <button 
          onClick={onGoHome}
          className="royal-font text-xl md:text-2xl font-bold text-rose-950 tracking-tighter flex-shrink-0"
        >
          Shree Ji <span className="text-rose-700">Rajasthan</span>
        </button>
        
        {/* Search Bar - Hidden on small mobile to avoid clutter, replaced by mobile bar below */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative group">
            <input 
              type="text" 
              placeholder="Search for ornaments, silks, decor..."
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              className="w-full bg-stone-50 border border-rose-100 rounded-full py-2.5 px-12 focus:ring-2 focus:ring-rose-800 outline-none transition-all text-sm placeholder:text-stone-400"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Actions Area: Auth + Cart */}
        <div className="flex items-center space-x-2 md:space-x-4">
          <div className="flex items-center space-x-2 md:space-x-3 border-r border-rose-100 pr-3 md:pr-4">
            <button 
              onClick={() => onOpenAuth('login')}
              className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-rose-950 hover:text-rose-700 transition-colors py-2 px-1"
            >
              Login
            </button>
            <span className="text-rose-200 text-xs">/</span>
            <button 
              onClick={() => onOpenAuth('signup')}
              className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-rose-950 hover:text-rose-700 transition-colors py-2 px-1"
            >
              Sign Up
            </button>
          </div>

          <button 
            onClick={onOpenCart}
            className="relative p-2.5 text-rose-950 hover:text-rose-700 transition-colors bg-rose-50 rounded-full"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-800 text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center ring-2 ring-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile Search - Visible only on mobile */}
      <div className="md:hidden px-4 pb-4">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full bg-stone-50 border border-rose-100 rounded-full py-2 px-10 outline-none text-sm"
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-rose-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;