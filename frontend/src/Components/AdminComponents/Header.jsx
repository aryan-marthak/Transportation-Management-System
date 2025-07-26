import React from 'react';
import abg_logo from '../../assets/final.png';
import { CarFront, LogOut } from 'lucide-react';

const Header = ({ user, handleLogout }) => (
  <nav className="relative overflow-hidden shadow-lg border-b-4 border-green-500">
    {/* Triangular Pattern Background */}
    <div className="absolute inset-0 opacity-95">
      <svg width="100%" height="100%" viewBox="0 0 1200 80" preserveAspectRatio="none" className="w-full h-full">
        {/* Triangle 1 - Light orange (logo area) */}
        <polygon 
          points="0,0 300,0 250,80 0,80" 
          fill="#FFA726"
          className="triangle-1"
        />
        {/* Triangle 2 - Medium red */}
        <polygon 
          points="250,80 300,0 500,0 450,80" 
          fill="#E53E3E"
          className="triangle-2"
        />
        {/* Triangle 3 - Orange */}
        <polygon 
          points="450,80 500,0 700,0 650,80" 
          fill="#FF7043"
          className="triangle-3"
        />
        {/* Triangle 4 - Deep red */}
        <polygon 
          points="650,80 700,0 900,0 850,80" 
          fill="#C53030"
          className="triangle-4"
        />
        {/* Triangle 5 - Dark red */}
        <polygon 
          points="850,80 900,0 1200,0 1200,80" 
          fill="#B91C1C"
          className="triangle-5"
        />
      </svg>
    </div>

    {/* Content Layer */}
    <div className="relative z-10 w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-center h-auto md:h-16 py-2 md:py-0 gap-2 md:gap-0">
        <div className="flex items-center justify-center md:justify-start">
          <div className="flex items-center py-1">
            {/* Logo - now on lighter background */}
            <img 
              src={abg_logo} 
              alt="ABG Logo" 
              className="h-48 pt-[6px]  bg-transparent object-contain drop-shadow-md" 
            />
            <div>
              <span style={{ WebkitTextStroke: '0.2px black', textShadow: '2px 2px 4px rgba(0,0,0,0.5)',}} className="text-lg sm:text-xl font-bold text-white tracking-wide">
                TRANSPORT MANAGEMENT
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4">
          <div className="bg-white bg-opacity-20 rounded-lg px-3 py-1 backdrop-blur-sm">
            <span className="text-white text-sm sm:text-base font-medium drop-shadow">
              Welcome, {user?.name || 'User'}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-red-600 bg-opacity-80 rounded-lg text-white hover:bg-red-700 hover:bg-opacity-90 transition-all duration-200 shadow-md hover:shadow-lg text-sm sm:text-base font-medium backdrop-blur-sm"
          >
            <LogOut className="h-4 w-4" />
            <span className='pb-[2px]'>Logout</span>
          </button>
        </div>
      </div>
    </div>

    <style jsx>{`
      .triangle-1 { filter: drop-shadow(2px 0px 4px rgba(0,0,0,0.1)); }
      .triangle-2 { filter: drop-shadow(2px 0px 4px rgba(0,0,0,0.1)); }
      .triangle-3 { filter: drop-shadow(2px 0px 4px rgba(0,0,0,0.1)); }
      .triangle-4 { filter: drop-shadow(2px 0px 4px rgba(0,0,0,0.1)); }
      .triangle-5 { filter: drop-shadow(2px 0px 4px rgba(0,0,0,0.1)); }
    `}</style>
  </nav>
);

export default Header;