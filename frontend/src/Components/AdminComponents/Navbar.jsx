import React, { useState } from 'react';
import { FileText, History, Car, Users } from 'lucide-react';

const Navbar = ({ activeTab, setActiveTab }) => (
  <div className="flex flex-col md:flex-row space-y-1 md:space-y-0 md:space-x-1 bg-white border-b border-gray-200 p-2">
    <button
      onClick={() => setActiveTab('active-requests')}
      className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
        activeTab === 'active-requests'
          ? 'bg-blue-500 text-white shadow-sm'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      <FileText className="h-4 w-4" />
      <span>Active Requests</span>
    </button>
    <button
      onClick={() => setActiveTab('past-requests')}
      className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
        activeTab === 'past-requests'
          ? 'bg-blue-500 text-white shadow-sm'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      <History className="h-4 w-4" />
      <span>Past Requests</span>
    </button>
    <button
      onClick={() => setActiveTab('vehicles')}
      className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
        activeTab === 'vehicles'
          ? 'bg-blue-500 text-white shadow-sm'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      <Car className="h-4 w-4" />
      <span>Vehicles</span>
    </button>
    <button
      onClick={() => setActiveTab('drivers')}
      className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
        activeTab === 'drivers'
          ? 'bg-blue-500 text-white shadow-sm'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      <Users className="h-4 w-4" />
      <span>Drivers</span>
    </button>
  </div>
);

export default Navbar;