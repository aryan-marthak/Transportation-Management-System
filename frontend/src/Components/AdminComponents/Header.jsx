import React from 'react';
import { CarFront, LogOut } from 'lucide-react';

const Header = ({ user, handleLogout }) => (
  <nav className="bg-white shadow-sm border-b border-gray-200">
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-center h-auto md:h-16 py-2 md:py-0 gap-2 md:gap-0">
        <div className="flex items-center justify-center md:justify-start">
          <CarFront className="h-7 w-7 sm:h-8 sm:w-8 text-blue-600 mr-2 sm:mr-3" />
          <span className="text-lg sm:text-xl font-bold text-gray-800">Transport Management</span>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4">
          <span className="text-gray-700 text-sm sm:text-base">Welcome, {user?.name}</span>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors text-sm sm:text-base"
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
