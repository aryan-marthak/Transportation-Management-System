import React from 'react';
import { Plus, Trash2, Car } from 'lucide-react';
import useVehicleStore from '../../store/useVehicleStore';

const VehicleManage = ({ vehicles, handleDeleteVehicle, showAddVehicle, setShowAddVehicle, vehicleForm, setVehicleForm, handleAddVehicle }) => {
  const toggleVehicleOutOfService = useVehicleStore.toggleVehicleOutOfService;
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Vehicle Management</h2>
        <button
          onClick={() => setShowAddVehicle(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Vehicle</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-4">
        {vehicles.map(vehicle => (
          <div key={vehicle._id} className="bg-white rounded-lg shadow-md p-3 sm:p-6 border border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 sm:mb-4 gap-2 sm:gap-0">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-800">{vehicle.vehicleNo}</h3>
                <p className="text-xs sm:text-sm text-gray-600">{vehicle.vehicleName}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-3 sm:px-5 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-semibold ${vehicle.outOfService ? 'bg-orange-100 text-orange-800' :
                    vehicle.status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                  {vehicle.outOfService ? 'Out of Service' : vehicle.status}
                </span>
                <button
                  onClick={() => handleDeleteVehicle(vehicle._id)}
                  className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                  title="Delete vehicle"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-6">
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Capacity</p>
                <p className="font-medium">{vehicle.capacity} seats</p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Color</p>
                <p className="font-medium">{vehicle.vehicleColor}</p>
              </div>
            </div>
            <div className="col-span-3 flex items-center mt-2 sm:mt-4">
              <input
                type="checkbox"
                id={`outOfService-${vehicle._id}`}
                checked={vehicle.outOfService}
                onChange={async (e) => {
                  const outOfService = e.target.checked;
                  await toggleVehicleOutOfService(vehicle._id, outOfService);
                }}
                className="mr-2"
              />
              <label htmlFor={`outOfService-${vehicle._id}`} className="text-xs sm:text-sm font-medium text-gray-700 select-none">
                Temporary Out of Service
              </label>
            </div>
          </div>
        ))}
      </div>

      {showAddVehicle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add New Vehicle</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Vehicle Number"
                value={vehicleForm.vehicleNo}
                onChange={(e) => setVehicleForm({ ...vehicleForm, vehicleNo: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Vehicle Name"
                value={vehicleForm.vehicleName}
                onChange={(e) => setVehicleForm({ ...vehicleForm, vehicleName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Capacity"
                value={vehicleForm.capacity}
                onChange={(e) => setVehicleForm({ ...vehicleForm, capacity: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type='text'
                placeholder='Vehicle Color'
                value={vehicleForm.vehicleColor}
                onChange={(e) => setVehicleForm({ ...vehicleForm, vehicleColor: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleAddVehicle}
                className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Add Vehicle
              </button>
              <button
                onClick={() => setShowAddVehicle(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleManage;
