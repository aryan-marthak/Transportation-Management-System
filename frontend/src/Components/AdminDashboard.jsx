import React, { useState, useEffect } from 'react';
import useAuthStore from '../store/useAuthStore';
import useDriverStore from '../store/useDriverStore';
import useVehicleStore from '../store/useVehicleStore';
import useTripRequestStore from '../store/useTripRequestStore';
import { useNavigate } from 'react-router-dom';
import Header from './AdminComponents/Header.jsx';
import Navbar from './AdminComponents/Navbar.jsx';
import ActiveRequest from './AdminComponents/ActiveRequest.jsx';
import PastRequest from './AdminComponents/PastRequest.jsx';
import VehicleManage from './AdminComponents/VehicleManage.jsx';
import DriverManage from './AdminComponents/DriverManage.jsx';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [activeTab, setActiveTab] = useState('active-requests');
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [showAddDriver, setShowAddDriver] = useState(false);
  const [vehicleForm, setVehicleForm] = useState({
    vehicleNo: '',
    vehicleName: '',
    capacity: '',
    vehicleColor: ''
  });
  const [driverForm, setDriverForm] = useState({
    driverName: '',
    age: '',
    phoneNo: '',
    licenseNo: ''
  });
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [assignmentData, setAssignmentData] = useState({
    vehicleId: '',
    driverId: '',
    remarks: ''
  });
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectRemark, setRejectRemark] = useState('');
  const [rejectingRequestId, setRejectingRequestId] = useState(null);
  const [assignOutside, setAssignOutside] = useState(false);
  const [outsideData, setOutsideData] = useState({
    vehicleNo: '',
    vehicleName: '',
    driverName: '',
    phoneNo: ''
  });

  // Utility for status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Helper for date formatting
  const formatDateLong = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  // Fetching and CRUD logic (same as before)
  const handleLogout = async () => {
    await logout();
    navigate('/login')
  };

  const { drivers, fetchDrivers, addDriver, deleteDriver, loading: driversLoading, error: driversError } = useDriverStore();
  const { vehicles, fetchVehicles, addVehicle, deleteVehicle, loading: vehiclesLoading, error: vehiclesError } = useVehicleStore();
  const { tripRequests, fetchTripRequests, approveTripRequest, rejectTripRequest, completeTripRequest, loading: tripRequestsLoading, error: tripRequestsError } = useTripRequestStore();

  useEffect(() => {
    // Initial fetch on mount
    fetchDrivers();
    fetchVehicles();
    fetchTripRequests();
    // WebSocket listeners will handle real-time updates
  }, []);

  // CRUD handlers for vehicles and drivers
  const handleAddVehicle = async () => {
    if (vehicleForm.vehicleNo && vehicleForm.vehicleName && vehicleForm.capacity && vehicleForm.vehicleColor) {
      await addVehicle({
        vehicleNo: vehicleForm.vehicleNo,
        vehicleName: vehicleForm.vehicleName,
        capacity: parseInt(vehicleForm.capacity),
        vehicleColor: vehicleForm.vehicleColor
      });
      setVehicleForm({
        vehicleNo: '',
        vehicleName: '',
        capacity: '',
        vehicleColor: ''
      });
      setShowAddVehicle(false);
    }
  };

  const handleAddDriver = async () => {
    if (driverForm.driverName && driverForm.age && driverForm.phoneNo && driverForm.licenseNo) {
      await addDriver({
        driverName: driverForm.driverName,
        age: parseInt(driverForm.age),
        phoneNo: driverForm.phoneNo,
        licenseNo: driverForm.licenseNo,
        status: 'available'
      });
      setDriverForm({
        driverName: '',
        age: '',
        phoneNo: '',
        licenseNo: ''
      });
      setShowAddDriver(false);
    }
  };

  const handleDeleteDriver = async (driverId) => {
    if (window.confirm('Are you sure you want to delete this driver?')) {
      await deleteDriver(driverId);
    }
  };

  const handleDeleteVehicle = async (vehicleId) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      await deleteVehicle(vehicleId);
    }
  };

  // Assignment and rejection logic
  const handleApprove = async (requestId, vehicleId, driverId, remarks) => {
    if (assignOutside) {
      await approveTripRequest(requestId, {
        isOutside: true,
        outsideVehicle: {
          vehicleNo: outsideData.vehicleNo,
          vehicleName: outsideData.vehicleName
        },
        outsideDriver: {
          driverName: outsideData.driverName,
          phoneNo: outsideData.phoneNo
        },
        remarks
      });
    } else {
      await approveTripRequest(requestId, {
        vehicleId,
        driverId,
        remarks
      });
    }
    setSelectedRequest(null);
    setAssignmentData({ vehicleId: '', driverId: '', remarks: '' });
    setAssignOutside(false);
    setOutsideData({ vehicleNo: '', vehicleName: '', driverName: '', phoneNo: '' });
  };

  const handleReject = async (requestId, reason) => {
    setRejectingRequestId(requestId);
    setRejectRemark('');
    setShowRejectModal(true);
  };

  const submitReject = async () => {
    if (!rejectingRequestId) return;
    await rejectTripRequest(rejectingRequestId, rejectRemark);
    setShowRejectModal(false);
    setRejectRemark('');
    setRejectingRequestId(null);
  };

  const handleCompleteTrip = async (requestId) => {
    await completeTripRequest(requestId);
  };

  // Helpers for assignment modal
  const getAvailableVehicles = () => {
    return vehicles.filter(vehicle =>
      vehicle.status === 'Available' &&
      !vehicle.outOfService
    );
  };
  const getAvailableDrivers = () => {
    return drivers.filter(driver => driver.status === 'available' && !driver.temporarilyUnavailable);
  };

  // Split requests
  const activeRequests = tripRequests.filter(req => req.status === 'Pending').filter(req => req.status == 'Pending').sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const pastRequests = tripRequests
    .filter(req => req.status !== 'Pending')
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} handleLogout={handleLogout} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        <div className="tab-content">
          {activeTab === 'active-requests' && (
            <ActiveRequest
              activeRequests={activeRequests}
              getStatusColor={getStatusColor}
              setSelectedRequest={setSelectedRequest}
              formatDateLong={formatDateLong}
              handleReject={handleReject}
              loading={tripRequestsLoading}
              error={tripRequestsError}
            />
          )}
          {activeTab === 'past-requests' && (
            <PastRequest
              pastRequests={pastRequests}
              getStatusColor={getStatusColor}
              formatDateLong={formatDateLong}
              handleCompleteTrip={handleCompleteTrip}
              loading={tripRequestsLoading}
              error={tripRequestsError}
            />
          )}
          {activeTab === 'vehicles' && (
            <VehicleManage
              vehicles={vehicles}
              handleDeleteVehicle={handleDeleteVehicle}
              showAddVehicle={showAddVehicle}
              setShowAddVehicle={setShowAddVehicle}
              vehicleForm={vehicleForm}
              setVehicleForm={setVehicleForm}
              handleAddVehicle={handleAddVehicle}
              loading={vehiclesLoading}
              error={vehiclesError}
            />
          )}
          {activeTab === 'drivers' && (
            <DriverManage
              drivers={drivers}
              handleDeleteDriver={handleDeleteDriver}
              showAddDriver={showAddDriver}
              setShowAddDriver={setShowAddDriver}
              driverForm={driverForm}
              setDriverForm={setDriverForm}
              handleAddDriver={handleAddDriver}
              loading={driversLoading}
              error={driversError}
            />
          )}
        </div>
      </div>
      {/* Assignment Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Approve & Assign Vehicle</h3>
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Request Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Employee:</span>
                  <span className="ml-2 font-medium">{selectedRequest.createdBy?.name || 'Employee'}</span>
                </div>
                <div>
                  <span className="text-gray-600">Employee ID:</span>
                  <span className="ml-2 font-medium">{selectedRequest.createdBy?.employeeId}</span>
                </div>
                <div>
                  <span className="text-gray-600">Designation:</span>
                  <span className="ml-2 font-medium">{selectedRequest.designation}</span>
                </div>
                <div>
                  <span className="text-gray-600">Purpose:</span>
                  <span className="ml-2 font-medium">{selectedRequest.purpose}</span>
                </div>
                <div>
                  <span className="text-gray-600">Pickup Point:</span>
                  <span className="ml-2 font-medium">{selectedRequest.pickupPoint}</span>
                </div>
                <div>
                  <span className="text-gray-600">Destination:</span>
                  <span className="ml-2 font-medium">{selectedRequest.destination}</span>
                </div>
                <div>
                  <span className="text-gray-600">Start Date:</span>
                  <span className="ml-2 font-medium">{formatDateLong(selectedRequest.startDate)}</span>
                </div>
                <div>
                  <span className="text-gray-600">Start Time:</span>
                  <span className="ml-2 font-medium">{selectedRequest.startTime}</span>
                </div>
                <div>
                  <span className="text-gray-600">End Date:</span>
                  <span className="ml-2 font-medium">{formatDateLong(selectedRequest.endDate)}</span>
                </div>
                <div>
                  <span className="text-gray-600">No. of Passengers:</span>
                  <span className="ml-2 font-medium">{selectedRequest.numberOfPassengers}</span>
                </div>
                <div>
                  <span className="text-gray-600">Employee Phone No.:</span>
                  <span className="ml-2 font-medium">{selectedRequest.createdBy?.phoneNo || 'None'}</span>
                </div>
                <div>
                  <span className="text-gray-600">Employee Remark:</span>
                  <span className="ml-2 font-medium">{selectedRequest.remarks || 'None'}</span>
                </div>
              </div>
            </div>
            {/* Outside Car Option */}
            {!assignOutside && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                <p className="text-yellow-800 text-sm mb-2">You can assign an outside car if needed (e.g., if available vehicles do not meet requirements).</p>
                <button
                  onClick={() => setAssignOutside(true)}
                  className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                >
                  Assign Outside Car
                </button>
              </div>
            )}
            {/* Assignment Form */}
            {!assignOutside && (
              <div className="space-y-4">
                {/* Vehicle Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Vehicle
                  </label>
                  <select
                    value={assignmentData.vehicleId}
                    onChange={(e) => setAssignmentData({ ...assignmentData, vehicleId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a vehicle</option>
                    {getAvailableVehicles().map(vehicle => (
                      <option key={vehicle._id} value={vehicle._id}>
                        {vehicle.vehicleNo} - {vehicle.vehicleName} ({vehicle.capacity} seats)
                      </option>
                    ))}
                  </select>
                </div>
                {/* Driver Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Driver
                  </label>
                  <select
                    value={assignmentData.driverId}
                    onChange={(e) => setAssignmentData({ ...assignmentData, driverId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a driver</option>
                    {getAvailableDrivers().map(driver => (
                      <option key={driver._id} value={driver._id}>
                        {driver.driverName} - {driver.phoneNo}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Remarks */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Remarks (Optional)
                  </label>
                  <textarea
                    value={assignmentData.remarks}
                    onChange={(e) => setAssignmentData({ ...assignmentData, remarks: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Any additional notes or instructions..."
                  />
                </div>
              </div>
            )}
            {/* Outside Car Assignment Form */}
            {assignOutside && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Outside Vehicle Number</label>
                  <input
                    type="text"
                    value={outsideData.vehicleNo}
                    onChange={e => setOutsideData({ ...outsideData, vehicleNo: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="Enter outside vehicle number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Outside Vehicle Name</label>
                  <input
                    type="text"
                    value={outsideData.vehicleName}
                    onChange={e => setOutsideData({ ...outsideData, vehicleName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="Enter outside vehicle name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Outside Driver Name</label>
                  <input
                    type="text"
                    value={outsideData.driverName}
                    onChange={e => setOutsideData({ ...outsideData, driverName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="Enter outside driver name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Outside Driver Phone</label>
                  <input
                    type="text"
                    value={outsideData.phoneNo}
                    onChange={e => setOutsideData({ ...outsideData, phoneNo: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="Enter outside driver phone"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Remarks (Optional)</label>
                  <textarea
                    value={assignmentData.remarks}
                    onChange={(e) => setAssignmentData({ ...assignmentData, remarks: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="Any additional notes or instructions..."
                  />
                </div>
                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={() => handleApprove(selectedRequest._id)}
                    disabled={!(outsideData.vehicleNo && outsideData.vehicleName && outsideData.driverName && outsideData.phoneNo)}
                    className={`flex-1 py-2 rounded-md transition-colors ${!(outsideData.vehicleNo && outsideData.vehicleName && outsideData.driverName && outsideData.phoneNo)
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-yellow-600 text-white hover:bg-yellow-700'
                      }`}
                  >
                    Approve & Assign Outside Car
                  </button>
                  <button
                    onClick={() => { setAssignOutside(false); setOutsideData({ vehicleNo: '', vehicleName: '', driverName: '', phoneNo: '' }); }}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            {/* Default Approve/Assign Buttons */}
            {!assignOutside && (
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => handleApprove(
                    selectedRequest._id,
                    assignmentData.vehicleId,
                    assignmentData.driverId,
                    assignmentData.remarks
                  )}
                  disabled={!assignmentData.vehicleId || !assignmentData.driverId}
                  className={`flex-1 py-2 rounded-md transition-colors ${!assignmentData.vehicleId || !assignmentData.driverId
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                >
                  Approve & Assign
                </button>
                <button
                  onClick={() => {
                    setSelectedRequest(null);
                    setAssignmentData({ vehicleId: '', driverId: '', remarks: '' });
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Reject Request</h3>
            <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Rejection</label>
            <textarea
              value={rejectRemark}
              onChange={e => setRejectRemark(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Please provide a reason for rejection..."
            />
            <div className="flex space-x-3 mt-6">
              <button
                onClick={submitReject}
                disabled={!rejectRemark.trim()}
                className={`flex-1 py-2 rounded-md transition-colors ${!rejectRemark.trim() ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-red-600 text-white hover:bg-red-700'}`}
              >
                Reject
              </button>
              <button
                onClick={() => { setShowRejectModal(false); setRejectRemark(''); setRejectingRequestId(null); }}
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

export default AdminDashboard;