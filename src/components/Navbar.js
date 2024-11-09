import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-olympic-blue shadow-md fixed top-0 w-full z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link 
            to="/" 
            className="text-white text-xl font-semibold no-underline"
          >
            LODLYMPICS
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="lg:hidden text-white focus:outline-none"
            type="button"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Desktop menu */}
          <div className="hidden lg:flex space-x-8">
            <Link
              to="/"
              className={`text-white no-underline hover:text-gray-200 transition-colors ${
                location.pathname === '/' ? 'border-b-2 border-white' : ''
              }`}
            >
              Home
            </Link>
            <Link
              to="/documentation"
              className={`text-white no-underline hover:text-gray-200 transition-colors ${
                location.pathname === '/documentation' ? 'border-b-2 border-white' : ''
              }`}
            >
              Documentation
            </Link>
            <Link
              to="/credits"
              className={`text-white no-underline hover:text-gray-200 transition-colors ${
                location.pathname === '/credits' ? 'border-b-2 border-white' : ''
              }`}
            >
              Credits
            </Link>
          </div>
        </div>

        {/* Mobile menu, show/hide based on menu state */}
        <div
          className={`lg:hidden ${
            isOpen ? 'block' : 'hidden'
          } pb-4`}
        >
          <div className="flex flex-col space-y-2">
            <Link
              to="/"
              className={`text-white no-underline hover:text-gray-200 transition-colors py-2 ${
                location.pathname === '/' ? 'border-l-4 border-white pl-2' : 'pl-3'
              }`}
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/documentation"
              className={`text-white no-underline hover:text-gray-200 transition-colors py-2 ${
                location.pathname === '/documentation' ? 'border-l-4 border-white pl-2' : 'pl-3'
              }`}
              onClick={() => setIsOpen(false)}
            >
              Documentation
            </Link>
            <Link
              to="/credits"
              className={`text-white no-underline hover:text-gray-200 transition-colors py-2 ${
                location.pathname === '/credits' ? 'border-l-4 border-white pl-2' : 'pl-3'
              }`}
              onClick={() => setIsOpen(false)}
            >
              Credits
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;