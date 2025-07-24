import React from 'react';

const NewRequest = ({ showForm, setShowForm, formData, setFormData, handleSubmit, loading }) => {
  if (!showForm) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-xs sm:max-w-md max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header - Fixed */}
        <div className="p-3 sm:p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl">
          <h3 className="text-base sm:text-xl font-bold text-gray-800">New Vehicle Request</h3>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">Fill in the details below to request a vehicle</p>
        </div>
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6">
          <div className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Pickup Location</label>
              <input
                type="text"
                value={formData.pickupPoint}
                onChange={(e) => setFormData({ ...formData, pickupPoint: e.target.value })}
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-xs sm:text-base"
                placeholder="Where should we pick you up?"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Destination</label>
              <input
                type="text"
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-xs sm:text-base"
                placeholder="Where do you need to go?"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Start Date</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-xs sm:text-base"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Start Time</label>
                <input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-xs sm:text-base"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">End Date <span className='text-red-600'>*not necessary</span></label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-xs sm:text-base"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Purpose</label>
              <select
                value={formData.purpose}
                onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-xs sm:text-base"
              >
                <option value="">Select purpose</option>
                <option value="Official">Official</option>
                <option value="Personal">Personal</option>
              </select>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Designation</label>
              <select
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-xs sm:text-base"
              >
                <option value="">Select your Designation</option>
                <option value="Unit Head">Unit Head</option>
                <option value="Functional Head">Functional Head</option>
                <option value="Department Head">Department Head</option>
                <option value="Sectional Head">Sectional Head</option>
                <option value="Management">Management</option>
                <option value="Staff">Staff</option>
                <option value="Worker">Worker</option>
              </select>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Number of Passengers</label>
              <input
                type="number"
                min="1"
                max="20"
                value={formData.numberOfPassengers}
                onChange={(e) => setFormData({ ...formData, numberOfPassengers: e.target.value })}
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-xs sm:text-base"
                placeholder="How many passengers?"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Remarks</label>
              <textarea
                value={formData.remarks}
                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-xs sm:text-base"
                rows="3"
                placeholder="Any additional information..."
              />
            </div>
          </div>
        </div>
        {/* Footer - Fixed */}
        <div className="p-3 sm:p-6 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100 rounded-b-xl">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button
              onClick={handleSubmit}
              disabled={loading || !(formData.pickupPoint && formData.destination && formData.startDate && formData.startTime && formData.purpose && formData.designation && formData.numberOfPassengers)}
              className={`w-full sm:flex-1 py-2 rounded-md font-medium transition-all ${
                loading
                  ? 'bg-blue-300 text-white cursor-not-allowed'
                  : !(formData.pickupPoint && formData.destination && formData.startDate && formData.startTime && formData.purpose && formData.designation && formData.numberOfPassengers)
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700 transform hover:scale-105'
              } text-xs sm:text-base`}
            >
              {loading ? (
                <span>Submitting...</span>
              ) : (
                'Submit Request'
              )}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="w-full sm:flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400 transition-colors text-xs sm:text-base"
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewRequest;
