import React from 'react';
import { CarFront, LogOut } from 'lucide-react';

const Header = ({ user, handleLogout }) => (
  <nav className="bg-gradient-to-r from-red-600 via-orange-500 to-red-500 shadow-lg border-b-4 border-green-500">
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-center h-auto md:h-16 py-2 md:py-0 gap-2 md:gap-0">
        <div className="flex items-center justify-center md:justify-start">
          <div className="flex items-center bg-white bg-opacity-20 rounded-lg px-3 py-1 backdrop-blur-sm">
            <CarFront className="h-7 w-7 sm:h-8 sm:w-8 text-white mr-2 sm:mr-3" />
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-bold text-white tracking-wide">ADITYA BIRLA</span>
              <span className="text-xs sm:text-sm text-white opacity-90 -mt-1">Transport Management</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4">
          <div className="bg-white bg-opacity-20 rounded-lg px-3 py-1 backdrop-blur-sm">
            <span className="text-white text-sm sm:text-base font-medium">Welcome, {user?.name || 'User'}</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-green-600 rounded-lg text-white hover:bg-green-700 transition-all duration-200 shadow-md hover:shadow-lg text-sm sm:text-base font-medium"
          >
            <LogOut className="h-4 w-4" />
            <span className='pb-[2px]'>Logout</span>
          </button>
        </div>
      </div>
    </div>
  </nav>
);

export default Header;
