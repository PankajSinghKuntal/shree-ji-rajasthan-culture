import React, { useState } from 'react';

interface NavbarProps {
  cartCount: number;
  onCartClick: () => void;
  onAdminClick: () => void;
  onAuthClick: () => void;
  currentUser: { fullName: string; email: string } | null;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = (props: NavbarProps) => {
  const { cartCount, onCartClick, onAdminClick, onAuthClick, currentUser, onLogout } = props;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-40 bg-white border-b-4 border-amber-700 shadow-lg" role="navigation" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4">
        <div className="h-16 sm:h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <div className="text-3xl sm:text-4xl" aria-hidden="true">🏛️</div>
            <div className="hidden sm:block">
              <h1 className="text-2xl sm:text-3xl font-bold text-amber-900 tracking-wider">SHREE JI</h1>
              <p className="text-xs text-amber-700 font-semibold">RAJASTHAN CULTURE</p>
            </div>
            <div className="sm:hidden text-left">
              <h1 className="text-lg font-bold text-amber-900 tracking-wider">SHREE JI</h1>
              <p className="text-xs text-amber-700">RAJASTHAN</p>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-3 lg:gap-4">
            {currentUser ? (
              <div className="flex items-center gap-2 lg:gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-amber-900 truncate">👤 {currentUser.fullName}</p>
                  <p className="text-xs text-amber-700 truncate">{currentUser.email}</p>
                </div>
                <button
                  onClick={onLogout}
                  className="px-3 lg:px-4 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-colors text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
                  aria-label="Logout"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={onAuthClick}
                className="px-3 lg:px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                aria-label="Login or Sign Up"
              >
                👤 Login / Sign Up
              </button>
            )}

            <button
              onClick={onAdminClick}
              className="px-3 lg:px-4 py-2 bg-amber-200 text-amber-900 font-bold rounded-lg hover:bg-amber-300 transition-colors text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-900"
              title="Admin Panel"
              aria-label="Open Admin Panel"
            >
              🔧 Admin
            </button>

            <button
              onClick={onCartClick}
              className="relative p-2 lg:p-3 hover:bg-amber-50 rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700"
              aria-label={`Shopping cart with ${cartCount} items`}
            >
              <svg className="w-5 lg:w-6 h-5 lg:h-6 text-amber-900" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 lg:w-6 lg:h-6 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={onCartClick}
              className="relative p-2 hover:bg-amber-50 rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700"
              aria-label={`Shopping cart with ${cartCount} items`}
            >
              <svg className="w-6 h-6 text-amber-900" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={toggleMobileMenu}
              className="p-2 hover:bg-amber-50 rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
            >
              <svg className="w-6 h-6 text-amber-900" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t-2 border-amber-200 py-3 space-y-2">
            {currentUser ? (
              <>
                <div className="px-4 py-3 bg-amber-50 rounded-lg">
                  <p className="text-sm font-bold text-amber-900 truncate">👤 {currentUser.fullName}</p>
                  <p className="text-xs text-amber-700 truncate">{currentUser.email}</p>
                </div>
                <button
                  onClick={() => {
                    onLogout();
                    closeMobileMenu();
                  }}
                  className="w-full px-4 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-colors text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
                  aria-label="Logout"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  onAuthClick();
                  closeMobileMenu();
                }}
                className="w-full px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                aria-label="Login or Sign Up"
              >
                👤 Login / Sign Up
              </button>
            )}

            <button
              onClick={() => {
                onAdminClick();
                closeMobileMenu();
              }}
              className="w-full px-4 py-2 bg-amber-200 text-amber-900 font-bold rounded-lg hover:bg-amber-300 transition-colors text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-900"
              title="Admin Panel"
              aria-label="Open Admin Panel"
            >
              🔧 Admin Panel
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
