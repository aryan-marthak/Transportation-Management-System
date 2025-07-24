import React from 'react';
import { ArrowRight, Eye } from 'lucide-react';

const ActiveRequest = ({
  activeRequests,
  onViewDetails,
  getStatusColor,
  getStatusIcon,
  formatDate
}) => (
  <div className="space-y-4">
    <div className="flex items-center space-x-2 mb-4">
      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
      <h3 className="text-lg font-semibold text-gray-800">Active Requests</h3>
      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
        {activeRequests.length}
      </span>
    </div>
    {activeRequests.map((request) => (
      <div
        key={request._id}
        className="bg-white rounded-lg shadow-md border-l-4 border-l-blue-500 p-3 sm:p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
          {/* Trip Route */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-1 sm:space-y-0 sm:space-x-3 text-base sm:text-lg font-medium text-gray-800">
              <span className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs sm:text-base">{request.pickupPoint}</span>
              </span>
              <ArrowRight className="h-4 w-4 text-gray-400" />
              <span className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-xs sm:text-base">{request.destination}</span>
              </span>
              <span className="text-gray-500 text-xs sm:text-sm">({request.purpose})</span>
            </div>
            <div className="text-xs sm:text-sm text-gray-600 mt-1 flex items-center space-x-2">
              <span>{formatDate(request.startDate)}</span>
              <span>•</span>
              <span>{request.startTime}</span>
            </div>
            {/* Outside Vehicle/Driver Info */}
            {/* {request.vehicleDetails?.isOutside && (
              <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                <span className="inline-block px-2 py-1 bg-yellow-200 text-yellow-800 rounded text-xs font-semibold mb-1">Outside Car Assigned</span>
                <div className="text-xs sm:text-sm text-yellow-900 font-medium">
                  <div>Vehicle: {request.vehicleDetails?.outsideVehicle?.vehicleNo || ''} - {request.vehicleDetails?.outsideVehicle?.vehicleName || ''}</div>
                  <div>Driver: {request.vehicleDetails?.outsideDriver?.driverName || ''} ({request.vehicleDetails?.outsideDriver?.phoneNo || ''})</div>
                </div>
              </div>
            )} */}
          </div>
          {/* Status and Actions */}
          <div className="flex flex-row sm:flex-col items-end sm:items-end space-x-2 sm:space-x-0 sm:space-y-2 mt-2 sm:mt-0">
            <div className="flex items-center space-x-2">
              {getStatusIcon(request.status)}
              <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>{request.status}</span>
            </div>
            <button
              onClick={() => onViewDetails(request)}
              className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-xs sm:text-sm font-medium hover:bg-blue-50 px-2 py-1 rounded transition-colors"
            >
              <Eye className="h-4 w-4" />
              <span>View Details</span>
            </button>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default ActiveRequest;
