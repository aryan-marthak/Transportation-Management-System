import React from 'react';
import abg_logo from '../../../public/final.png';
import { LogOut } from 'lucide-react';

const Header = ({ user, handleLogout }) => (
  <nav className="relative overflow-hidden shadow-lg border-b-4 border-green-500">
    {/* Triangular Pattern Background */}
    <div className="absolute inset-0 opacity-95">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1200 80"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full"
      >
        <polygon points="0,0 300,0 250,80 0,80" fill="#FFA726" />
        <polygon points="250,80 300,0 500,0 450,80" fill="#E53E3E" />
        <polygon points="450,80 500,0 700,0 650,80" fill="#FF7043" />
        <polygon points="650,80 700,0 900,0 850,80" fill="#C53030" />
        <polygon points="850,80 900,0 1200,0 1200,80" fill="#B91C1C" />
      </svg>
    </div>

    {/* Content Layer */}
    <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-center h-auto md:h-16 py-2 md:py-0 gap-3 md:gap-0">
        
        {/* Logo and Title Section - now a positioning context */}
        <div className="w-full md:w-auto flex items-center justify-start relative">
          <img
            src={abg_logo}
            alt="ABG Logo"
            // THE KEY FIX: Absolute on mobile, reset to relative on desktop
            className="absolute left-0 top-1/2 pt-2  -translate-y-1/2 md:relative md:left-auto md:top-auto md:transform-none h-28 md:h-48 object-contain drop-shadow-md"
          />
          {/* Title needs margin to avoid the logo */}
          <div className="w-full md:w-auto text-center md:text-left pl-24 md:ml-0">
            <span
              style={{ WebkitTextStroke: '0.2px black', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}
              className="text-lg sm:text-xl font-bold text-white tracking-wide"
            >
              TRANSPORT MANAGEMENT
            </span>
          </div>
        </div>

        {/* User Info and Logout Section */}
        <div className="flex items-center space-x-4">
          <div className="bg-white bg-opacity-20 rounded-lg px-3 py-1 backdrop-blur-sm">
            <span className="text-white text-sm sm:text-base font-medium drop-shadow">
              Welcome, {user?.name || 'User'}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 bg-opacity-80 rounded-lg text-white hover:bg-red-700 transition-all duration-200 shadow-md hover:shadow-lg text-sm sm:text-base font-medium backdrop-blur-sm"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  </nav>
);

export default Header;