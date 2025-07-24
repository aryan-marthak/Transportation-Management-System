import React, { useState } from 'react';
import { History, User, Users, Car, MapPin, Calendar, Search } from 'lucide-react';
import ExcelJS from 'exceljs';

const PastRequest = ({ pastRequests, getStatusColor, formatDateLong, handleCompleteTrip }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportStartDate, setReportStartDate] = useState('');
  const [reportEndDate, setReportEndDate] = useState('');
  const [error, setError] = useState('');

  const filteredRequests = pastRequests.filter(request => {
    const term = searchTerm.toLowerCase();
    // Gather all searchable fields as strings
    const fields = [
      request.createdBy?.name,
      request.createdBy?.employeeId,
      request.designation,
      request.purpose,
      request.destination,
      request.pickupPoint,
      request.startDate,
      request.startTime,
      request.endDate,
      request.numberOfPassengers,
      request.remarks,
      request.status,
      request.vehicleDetails?.vehicleNo,
      request.vehicleDetails?.vehicleName,
      request.vehicleDetails?.vehicleColor,
      request.vehicleDetails?.driverName,
      request.vehicleDetails?.phoneNo,
      request.vehicleDetails?.licenseNo,
      request.vehicleDetails?.outsideVehicle?.vehicleNo,
      request.vehicleDetails?.outsideVehicle?.vehicleName,
      request.vehicleDetails?.outsideDriver?.driverName,
      request.vehicleDetails?.outsideDriver?.phoneNo
    ];
    return fields.some(f => (f ? String(f).toLowerCase().includes(term) : false));
  });

  const handleGenerateReport = async () => {
    setError('');
    if (!reportStartDate || !reportEndDate) {
      setError('Please select both start and end dates.');
      return;
    }
    if (new Date(reportStartDate) > new Date(reportEndDate)) {
      setError('Start date cannot be after end date.');
      setReportStartDate('');
      setReportEndDate('');
      return;
    }

    const filteredForReport = pastRequests.filter(req => {
      const start = new Date(req.startDate);
      const end = new Date(req.endDate);
      const filterStart = new Date(reportStartDate);
      const filterEnd = new Date(reportEndDate);
      return start <= filterEnd && end >= filterStart;
    });

    if (filteredForReport.length === 0) {
      setError('No data found for the selected date range.');
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet1 = workbook.addWorksheet('Past Trips Report');
    const worksheet2 = workbook.addWorksheet('Drivers Report');
    const worksheet3 = workbook.addWorksheet('Vehicle Report');
    const worksheet4 = workbook.addWorksheet('Outside Cars');

    worksheet1.columns = [
      { header: 'Trip ID', key: 'tripId', width: 35 },
      { header: 'Employee ID', key: 'employeeId', width: 15 },
      { header: 'Employee Name', key: 'employeeName', width: 25 },
      { header: 'Designation', key: 'designation', width: 20 },
      { header: 'Pickup Point', key: 'pickupPoint', width: 20 },
      { header: 'Destination', key: 'destination', width: 20 },
      { header: 'Start Date', key: 'startDate', width: 15 },
      { header: 'Start Time', key: 'startTime', width: 15 },
      { header: 'End Date', key: 'endDate', width: 15 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Vehicle Name', key: 'vehicleName', width: 20 },
      { header: 'Driver Name', key: 'driverName', width: 20 },
      { header: 'Number of Passengers', key: 'numberOfPassengers', width: 10 },
      { header: 'Remarks', key: 'remarks', width: 30 },
    ];

    worksheet2.columns = [
      { header: 'Driver Id', key: 'driverId', width: 35 },
      { header: 'Driver Name', key: 'driverName', width: 25 },
      { header: 'License No.', key: 'licenseNo', width: 25 },
      { header: 'Phone No.', key: 'phoneNo', width: 15 },
      { header: 'Total Trips', key: 'totalTrips', width: 15 },
    ];

    worksheet3.columns = [
      { header: 'Vehicle Id', key: 'vehicleId', width: 35 },
      { header: 'Vehicle No.', key: 'vehicleNo', width: 25 },
      { header: 'Vehicle Name', key: 'vehicleName', width: 25 },
      { header: 'Total Trips', key: 'totalTrips', width: 15 },
    ];

    worksheet4.columns = [
      { header: 'Trip ID', key: 'tripId', width: 35 },
      { header: 'Employee ID', key: 'employeeId', width: 15 },
      { header: 'Employee Name', key: 'employeeName', width: 25 },
      { header: 'Pickup Point', key: 'pickupPoint', width: 20 },
      { header: 'Designation', key: 'designation', width: 20 },
      { header: 'Destination', key: 'destination', width: 20 },
      { header: 'Start Date', key: 'startDate', width: 15 },
      { header: 'Start Time', key: 'startTime', width: 15 },
      { header: 'End Date', key: 'endDate', width: 15 },
      { header: 'Outside Vehicle No.', key: 'vehicleNo', width: 20 },
      { header: 'Outside Vehicle Name', key: 'vehicleName', width: 20 },
      { header: 'Outside Driver Name', key: 'driverName', width: 20 },
      { header: 'Outside Driver Phone', key: 'phoneNo', width: 20 },
      { header: 'Remarks', key: 'remarks', width: 30 },
    ];

    const headerStyle = {
      font: { bold: true, color: { argb: 'FFFFFF' }, size: 12 },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: '4472C4' } },
      alignment: { horizontal: 'center', vertical: 'middle' },
      border: {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      }
    };

    [worksheet1, worksheet2, worksheet3, worksheet4].forEach(ws => {
      ws.getRow(1).eachCell((cell) => {
        cell.style = headerStyle;
      });
      ws.getRow(1).height = 25;
    });

    const driverTripCounts = {};
    const vehicleTripCounts = {};

    filteredForReport.forEach(req => {
      const dId = req.vehicleDetails?.driverId?.toString() || '';
      const vId = req.vehicleDetails?.vehicleId?.toString() || '';
      if (dId) driverTripCounts[dId] = (driverTripCounts[dId] || 0) + 1;
      if (vId) vehicleTripCounts[vId] = (vehicleTripCounts[vId] || 0) + 1;
    });

    filteredForReport.forEach((req, i) => {
      const row = worksheet1.addRow({
        tripId: req._id,
        employeeName: req.createdBy?.name || '',
        employeeId: req.createdBy?.employeeId || '',
        designation: req.designation || '',
        vehicleName: req.vehicleDetails?.vehicleName || 'None',
        driverName: req.vehicleDetails?.driverName || 'None',
        pickupPoint: req.pickupPoint || '',
        destination: req.destination || '',
        startDate: formatDateLong(req.startDate),
        startTime: req.startTime || '',
        endDate: formatDateLong(req.endDate),
        numberOfPassengers: req.numberOfPassengers || '',
        status: req.status || '',
        remarks: req.remarks || 'None',
      });

      const baseStyle = {
        fill: {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: i % 2 === 0 ? 'F8F9FA' : 'FFFFFF' }
        },
        border: {
          top: { style: 'thin', color: { argb: 'E0E0E0' } },
          left: { style: 'thin', color: { argb: 'E0E0E0' } },
          bottom: { style: 'thin', color: { argb: 'E0E0E0' } },
          right: { style: 'thin', color: { argb: 'E0E0E0' } }
        },
        alignment: { vertical: 'middle', wrapText: true }
      };

      row.eachCell(cell => cell.style = { ...cell.style, ...baseStyle });

      const statusCell = row.getCell(10);
      const s = req.status?.toLowerCase() || '';
      const statusStyles = {
        completed: '28A745',
        rejected: 'DC3545',
        pending: 'FFC107',
        'in progress': '17A2B8',
        approved: '6C757D'
      };
      if (statusStyles[s]) {
        statusCell.style = {
          ...statusCell.style,
          font: { bold: true, color: { argb: 'FFFFFF' } },
          fill: {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: statusStyles[s] }
          },
          alignment: { horizontal: 'center', vertical: 'middle' }
        };
      }
      row.height = 20;
    });

    Object.entries(driverTripCounts).forEach(([dId, count], i) => {
      const req = filteredForReport.find(r => r.vehicleDetails?.driverId?.toString() === dId);
      if (!req) return;
      const row = worksheet2.addRow({
        driverId: dId,
        driverName: req.vehicleDetails.driverName,
        licenseNo: req.vehicleDetails.licenseNo,
        phoneNo: req.vehicleDetails.phoneNo,
        totalTrips: count,
      });
      const baseStyle = {
        fill: {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: i % 2 === 0 ? 'F8F9FA' : 'FFFFFF' }
        },
        border: {
          top: { style: 'thin', color: { argb: 'E0E0E0' } },
          left: { style: 'thin', color: { argb: 'E0E0E0' } },
          bottom: { style: 'thin', color: { argb: 'E0E0E0' } },
          right: { style: 'thin', color: { argb: 'E0E0E0' } }
        },
        alignment: { vertical: 'middle' }
      };
      row.eachCell(cell => cell.style = { ...cell.style, ...baseStyle });
      if (count > 5) {
        const trips = row.getCell(5);
        trips.style = {
          ...trips.style,
          font: { bold: true, color: { argb: 'FFFFFF' } },
          fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: '28A745' } },
          alignment: { horizontal: 'center', vertical: 'middle' }
        };
      }
      row.height = 20;
    });

    Object.entries(vehicleTripCounts).forEach(([vId, count], i) => {
      const req = filteredForReport.find(r => r.vehicleDetails?.vehicleId?.toString() === vId);
      if (!req) return;
      const row = worksheet3.addRow({
        vehicleId: vId,
        vehicleNo: req.vehicleDetails.vehicleNo,
        vehicleName: req.vehicleDetails.vehicleName,
        totalTrips: count,
      });
      const baseStyle = {
        fill: {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: i % 2 === 0 ? 'F8F9FA' : 'FFFFFF' }
        },
        border: {
          top: { style: 'thin', color: { argb: 'E0E0E0' } },
          left: { style: 'thin', color: { argb: 'E0E0E0' } },
          bottom: { style: 'thin', color: { argb: 'E0E0E0' } },
          right: { style: 'thin', color: { argb: 'E0E0E0' } }
        },
        alignment: { vertical: 'middle' }
      };
      row.eachCell(cell => cell.style = { ...cell.style, ...baseStyle });
      if (count > 8) {
        const trips = row.getCell(5);
        trips.style = {
          ...trips.style,
          font: { bold: true, color: { argb: 'FFFFFF' } },
          fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: '6F42C1' } },
          alignment: { horizontal: 'center', vertical: 'middle' }
        };
      }
      row.height = 20;
    });

    // Add rows for outside cars
    const outsideTrips = filteredForReport.filter(req => req.vehicleDetails && req.vehicleDetails.isOutside);
    // DEBUG: Uncomment to check what is being picked up
    // console.log('Outside trips for Excel:', outsideTrips);
    outsideTrips.forEach((req, i) => {
      const row = worksheet4.addRow({
        tripId: req._id,
        employeeId: req.createdBy?.employeeId || '',
        employeeName: req.createdBy?.name || '',
        designation: req.designation || '',
        pickupPoint: req.pickupPoint || '',
        destination: req.destination || '',
        startDate: formatDateLong(req.startDate),
        startTime: req.startTime || '',
        endDate: formatDateLong(req.endDate),
        vehicleNo: req.vehicleDetails?.outsideVehicle?.vehicleNo || '',
        vehicleName: req.vehicleDetails?.outsideVehicle?.vehicleName || '',
        driverName: req.vehicleDetails?.outsideDriver?.driverName || '',
        phoneNo: req.vehicleDetails?.outsideDriver?.phoneNo || '',
        remarks: req.remarks || 'None',
      });
      const baseStyle = {
        fill: {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: i % 2 === 0 ? 'F8F9FA' : 'FFFFFF' }
        },
        border: {
          top: { style: 'thin', color: { argb: 'E0E0E0' } },
          left: { style: 'thin', color: { argb: 'E0E0E0' } },
          bottom: { style: 'thin', color: { argb: 'E0E0E0' } },
          right: { style: 'thin', color: { argb: 'E0E0E0' } }
        },
        alignment: { vertical: 'middle', wrapText: true }
      };
      row.eachCell(cell => cell.style = { ...cell.style, ...baseStyle });
      row.height = 20;
    });

    worksheet1.autoFilter = { from: 'A1', to: `O${worksheet1.rowCount}` };
    worksheet2.autoFilter = { from: 'A1', to: `E${worksheet2.rowCount}` };
    worksheet3.autoFilter = { from: 'A1', to: `E${worksheet3.rowCount}` };
    worksheet4.autoFilter = { from: 'A1', to: `K${worksheet4.rowCount}` };

    worksheet1.views = [{ state: 'frozen', ySplit: 1 }];
    worksheet2.views = [{ state: 'frozen', ySplit: 1 }];
    worksheet3.views = [{ state: 'frozen', ySplit: 1 }];
    worksheet4.views = [{ state: 'frozen', ySplit: 1 }];

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    const safeStart = reportStartDate.replace(/-/g, '');
    const safeEnd = reportEndDate.replace(/-/g, '');
    anchor.download = `Trip_Reports_${safeStart}_to_${safeEnd}.xlsx`;
    anchor.href = url;
    anchor.click();
    window.URL.revokeObjectURL(url);

    setShowReportModal(false);
    setReportStartDate('');
    setReportEndDate('');
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Past Handled Requests</h2>
      <div className="flex justify-between items-center mb-2">
        <div className="relative bg-gray-100 rounded-full w-[85%]">
          <input
            type="text"
            placeholder="Search past requests..."
            className="rounded-full px-4 py-2 border border-gray-300 w-full bg-gray-100 focus:outline-none"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
        </div>
        <button
          onClick={() => setShowReportModal(true)}
          className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition"
        >
          Generate Report
        </button>
      </div>

      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Generate Report</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  value={reportStartDate}
                  onChange={e => setReportStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  id="endDate"
                  value={reportEndDate}
                  onChange={e => setReportEndDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  onClick={() => setShowReportModal(false)}
                  className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleGenerateReport}
                  className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
                >
                  Generate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {filteredRequests.length === 0 ? (
        <div className="text-center py-12">
          <History className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500">No past requests found</p>
        </div>
      ) : (
        [...filteredRequests]
          .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
          .map(request => (
            <div key={request._id} className="bg-white rounded-xl shadow-sm border border-gray-300 overflow-hidden hover:shadow-md transition-shadow h-fit">
              {/* Card Header */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
                  <div className="flex items-start space-x-2 sm:space-x-4">
                    <div className="bg-white p-2 sm:p-3 rounded-full shadow-sm">
                      <User className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm sm:text-base font-semibold text-gray-900 truncate">
                        {request.createdBy?.name || 'Employee'} <span className="text-gray-600 font-normal">({request.designation})</span>
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs font-bold text-gray-700">
                          {request.createdBy?.employeeId}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className='flex flex-col sm:flex-row gap-2 sm:gap-4'>
                    {request.status === "Approved" && (
                      <button onClick={() => handleCompleteTrip(request._id)}
                        className='w-full sm:w-auto bg-green-600 text-white px-4 sm:px-5 py-1 rounded-full hover:bg-green-700 transition'>
                        Complete this Trip
                      </button>
                    )}
                    <span className={`inline-flex items-center px-3 sm:px-5 py-2 sm:py-3 rounded-full text-xs sm:text-md font-semibold border border-gray-400 ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-3 sm:p-6">
                {/* Trip Details */}
                <div className="space-y-3 sm:space-y-4">
                  {/* Purpose */}
                  <div className="flex items-start space-x-2 sm:space-x-3">
                    <div className="bg-blue-100 p-1.5 sm:p-2 rounded-lg">
                      <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-gray-500">Purpose</p>
                      <p className="text-sm font-semibold text-gray-900">{request.purpose}</p>
                    </div>
                  </div>

                  {/* Pickup and Destination */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4">
                    <div className="flex items-start space-x-2 sm:space-x-3">
                      <div className="bg-green-100 p-1.5 sm:p-2 rounded-lg">
                        <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-gray-500">Pickup Point</p>
                        <p className="text-sm font-semibold text-gray-900 truncate">{request.pickupPoint}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2 sm:space-x-3">
                      <div className="bg-red-100 p-1.5 sm:p-2 rounded-lg">
                        <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-gray-500">Destination</p>
                        <p className="text-sm font-semibold text-gray-900 truncate">{request.destination}</p>
                      </div>
                    </div>
                  </div>

                  {/* Pickup Date & Time and End Date */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4">
                    <div className="flex items-start space-x-2 sm:space-x-3">
                      <div className="bg-purple-100 p-1.5 sm:p-2 rounded-lg">
                        <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-gray-500">Pickup Date & Time</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {formatDateLong(request.startDate)} at {request.startTime}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2 sm:space-x-3">
                      <div className="bg-orange-100 p-1.5 sm:p-2 rounded-lg">
                        <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-gray-500">End Date</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {formatDateLong(request.endDate)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Passengers and Vehicle */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4">
                    <div className="flex items-start space-x-2 sm:space-x-3">
                      <div className="bg-cyan-100 p-1.5 sm:p-2 rounded-lg">
                        <Users className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-gray-500">No. of Passengers</p>
                        <p className="text-sm font-semibold text-gray-900">{request.numberOfPassengers}</p>
                      </div>
                    </div>
                    {request.vehicleDetails?.isOutside ? (
                      <div className="flex items-start space-x-2 sm:space-x-3">
                        <div className="bg-yellow-100 p-1.5 sm:p-2 rounded-lg">
                          <Car className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-gray-500">Assigned Outside Vehicle</p>
                          <p className="text-sm font-semibold text-yellow-900">
                            {request.vehicleDetails?.outsideVehicle?.vehicleNo || ''} - {request.vehicleDetails?.outsideVehicle?.vehicleName || ''}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start space-x-2 sm:space-x-3">
                        <div className="bg-teal-100 p-1.5 sm:p-2 rounded-lg">
                          <Car className="h-4 w-4 sm:h-5 sm:w-5 text-teal-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-gray-500">Assigned Vehicle</p>
                          <p className="text-sm font-semibold text-gray-900">
                            {request.vehicleDetails ? `${request.vehicleDetails.vehicleNo} - ${request.vehicleDetails.vehicleName}` : 'Not assigned'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Assigned Vehicle/Driver */}
                  {request.vehicleDetails && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4 mt-2 sm:mt-4">
                      {request.vehicleDetails.isOutside ? (
                        <>
                          <div>
                            <p className="text-xs font-medium text-gray-500">Assigned Outside Vehicle</p>
                            <p className="text-sm font-semibold text-yellow-900">
                              {request.vehicleDetails?.outsideVehicle?.vehicleNo || ''} - {request.vehicleDetails?.outsideVehicle?.vehicleName || ''}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-500">Assigned Outside Driver</p>
                            <p className="text-sm font-semibold text-yellow-900">
                              {request.vehicleDetails?.outsideDriver?.driverName || ''} ({request.vehicleDetails?.outsideDriver?.phoneNo || ''})
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <p className="text-xs font-medium text-gray-500">Assigned Vehicle</p>
                            <p className="text-sm font-semibold text-gray-900">
                              {request.vehicleDetails ? `${request.vehicleDetails.vehicleNo} - ${request.vehicleDetails.vehicleName}` : 'Not assigned'}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-500">Assigned Driver</p>
                            <p className="text-sm font-semibold text-gray-900">
                              {request.vehicleDetails ? `${request.vehicleDetails.driverName} (${request.vehicleDetails.phoneNo})` : 'Not assigned'}
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {/* Remarks */}
                  <div className="mt-2 sm:mt-4">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Remarks</label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{request.remarks || 'No remarks provided'}</p>
                  </div>
                </div>
              </div>
            </div>
          ))
      )}
    </div>
  );
};

export default PastRequest;
