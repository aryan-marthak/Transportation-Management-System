import React from 'react';
import { ArrowRight, Eye } from 'lucide-react';

const PastRequest = ({
  pastRequests,
  onViewDetails,
  getStatusColor,
  getStatusIcon,
  formatDate
}) => (
  <div className="space-y-4 mt-8">
    <div className="flex items-center space-x-2 mb-4">
      <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
      <h3 className="text-lg font-semibold text-gray-600">Past Requests</h3>
      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium">
        {pastRequests.length}
      </span>
    </div>
    {[...pastRequests]
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .map((request) => (
        <div key={request._id} className="bg-gray-50 rounded-lg shadow-sm border p-3 sm:p-6 opacity-60 hover:opacity-80 transition-all duration-300">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
            {/* Trip Route */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-1 sm:space-y-0 sm:space-x-3 text-base sm:text-lg font-medium text-gray-600">
                <span className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <span className="text-xs sm:text-base">{request.pickupPoint}</span>
                </span>
                <ArrowRight className="h-4 w-4 text-gray-400" />
                <span className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <span className="text-xs sm:text-base">{request.destination}</span>
                </span>
                <span className="text-gray-500 text-xs sm:text-sm">({request.purpose})</span>
              </div>
              <div className="text-xs sm:text-sm text-gray-500 mt-1 flex items-center space-x-2">
                <span>{formatDate(request.startDate)}</span>
                <span>•</span>
                <span>{request.startTime}</span>
                {request.endDate && (
                  <>
                    <span>•</span>
                    <span>Ended: {formatDate(request.endDate)}</span>
                  </>
                )}
              </div>
            </div>
            {/* Status and Actions */}
            <div className="flex flex-row sm:flex-col items-end sm:items-end space-x-2 sm:space-x-0 sm:space-y-2 mt-2 sm:mt-0">
              <div className="flex items-center space-x-2">
                {getStatusIcon(request.status)}
                <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)} opacity-80`}>
                  {request.status}
                </span>
              </div>
              <button
                onClick={() => onViewDetails(request)}
                className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 text-xs sm:text-sm font-medium hover:bg-gray-100 px-2 py-1 rounded transition-colors"
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

export default PastRequest;
