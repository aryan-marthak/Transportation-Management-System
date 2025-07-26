import express from "express";
import tripRequest from "../models/trip.request.model.js"
import secureRoute from "../middleware/secureRoute.js";
import driverModel from "../models/driver.model.js";
import vehicleModel from "../models/vehicle.model.js";
import { sendMail } from '../utils/mailer.js';
import { sendSMS } from '../utils/twiliosms.js';

const router = express.Router();

// POST REQUEST FOR CREATING NEW TRIP

router.post('/', secureRoute, async (req, res) => {
    try {
        const { purpose, designation, destination, pickupPoint, startDate, startTime, endDate, numberOfPassengers, remarks } = req.body;

        const newTripRequest = new tripRequest({
            purpose,
            designation,
            destination,
            pickupPoint,
            startDate: new Date(startDate),
            startTime,
            endDate: new Date(endDate),
            numberOfPassengers: parseInt(numberOfPassengers),
            remarks: remarks || '',
            createdBy: req.user._id
        });

        const savedTripRequest = await newTripRequest.save();
        res.status(201).json(savedTripRequest);
        // Send email to transport head in the background
        sendMail(
            'nilesh.marthak@adityabirla.com',
            'New Trip Request Created',
            `A new trip request has been created by ${req.user.name} (${req.user.email}).\n\nDestination: ${destination}\nPurpose: ${purpose}\nDepartment: ${req.user.department}\nPickup Point: ${pickupPoint}\nStart: ${startDate} ${startTime}\nEnd: ${endDate}\nNumber of Passengers: ${numberOfPassengers}\nRemarks: ${remarks || 'None'}\n\nPlease review the request in the system.`
        ).catch(mailError => {
            console.error('Failed to send trip request notification to transport head:', mailError);
        });
    } catch (error) {
        res.status(500).json({ message: 'Error creating trip request', error: error.message });
    }
});

// GET REQUEST FOR GETTING ALL THE TRIPS

router.get('/', secureRoute, async (req, res) => {
    try {
        let trips;
        if (req.user.role === 'admin') {
            trips = await tripRequest.find({}).populate('createdBy');
        } else {
            trips = await tripRequest.find({ createdBy: req.user._id }).populate('createdBy');
        }
        res.status(200).json(trips);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching trips', error: error.message });
    }
});

// APPROVE AND ASSIGN VEHICLE/DRIVER TO TRIP REQUEST
router.post('/:id/approve', secureRoute, async (req, res) => {
  try {
    const { vehicleId, driverId, remarks, isOutside, outsideVehicle, outsideDriver } = req.body;
    const tripRequestId = req.params.id;

    let vehicleDetails = {};
    if (isOutside) {
      vehicleDetails = {
        isOutside: true,
        outsideVehicle: outsideVehicle || {},
        outsideDriver: outsideDriver || {},
      };
    } else {
      // Find driver and vehicle
      const driver = await driverModel.findById(driverId);
      const vehicle = await vehicleModel.findById(vehicleId);
      if (!driver || !vehicle) {
        return res.status(404).json({ message: 'Driver or Vehicle not found' });
      }
      // Correctly update vehicle and driver status
      await vehicleModel.findByIdAndUpdate(vehicleId, { status: 'Assigned' });
      await driverModel.findByIdAndUpdate(driverId, { status: 'assigned' });
      vehicleDetails = {
        driverName: driver.driverName,
        vehicleId: vehicle._id,
        driverId: driver._id,
        licenseNo: driver.licenseNo,
        phoneNo: driver.phoneNo,
        vehicleNo: vehicle.vehicleNo,
        vehicleName: vehicle.vehicleName,
        vehicleColor: vehicle.vehicleColor
      };
    }
    // Update trip request
    const updatedTrip = await tripRequest.findByIdAndUpdate(
      tripRequestId,
      {
        status: 'Approved',
        remarks: remarks || '',
        vehicleDetails
      },
      { new: true }
    ).populate('createdBy');

    res.status(200).json(updatedTrip);

    // Send email to the user who created the trip request in the background
    if (updatedTrip && updatedTrip.createdBy && updatedTrip.createdBy.email) {
      let vehicleInfo = '';
      let driverInfo = '';
      if (isOutside) {
        vehicleInfo = outsideVehicle ? `${outsideVehicle.vehicleName || ''} (${outsideVehicle.vehicleNo || ''})` : 'Outside Vehicle';
        driverInfo = outsideDriver ? `${outsideDriver.driverName || ''} (${outsideDriver.phoneNo || ''})` : 'Outside Driver';
      } else {
        vehicleInfo = vehicleDetails.vehicleName + ' (' + vehicleDetails.vehicleNo + ')';
        driverInfo = vehicleDetails.driverName + ' (' + vehicleDetails.phoneNo + ')';
      }
      sendMail(
        updatedTrip.createdBy.email,
        'Your trip request has been approved!',
        `Hello ${updatedTrip.createdBy.name},\n\nYour trip request to ${updatedTrip.destination} has been approved.\n\nVehicle: ${vehicleInfo}\nDriver: ${driverInfo}\n\nRemarks: ${remarks || 'None'}\n\nThank you.`
      ).catch(mailError => {
        console.error('Failed to send approval email:', mailError);
      });
      // Send SMS if phone number is available
      if (updatedTrip.createdBy.phoneNo) {
        const smsMsg = `Your trip request to ${updatedTrip.destination} has been APPROVED.\nVehicle: ${vehicleInfo}\nDriver: ${driverInfo}\nRemarks: ${remarks || 'None'}`;
        sendSMS(`+91 ${updatedTrip.createdBy.phoneNo}`, smsMsg);
        console.log("sms sent")
      }
    }
  } catch (error) {
    res.status(500).json({ message: 'Error approving trip request', error: error.message });
  }
});

// REJECT TRIP REQUEST
router.post('/:id/reject', secureRoute, async (req, res) => {
  try {
    const { remarks } = req.body;
    const tripRequestId = req.params.id;

    // Update trip request status to Rejected and save remarks
    const updatedTrip = await tripRequest.findByIdAndUpdate(
      tripRequestId,
      {
        status: 'Rejected',
        remarks: remarks || ''
      },
      { new: true }
    ).populate('createdBy');

    res.status(200).json(updatedTrip);

    // Send email to the user who created the trip request in the background
    if (updatedTrip && updatedTrip.createdBy && updatedTrip.createdBy.email) {
      sendMail(
        updatedTrip.createdBy.email,
        'Your trip request has been rejected',
        `Hello ${updatedTrip.createdBy.name},\n\nWe regret to inform you that your trip request to ${updatedTrip.destination} has been rejected.\n\nRemarks: ${remarks || 'None'}\n\nIf you have any questions, please contact the admin.`
      ).catch(mailError => {
        console.error('Failed to send rejection email:', mailError);
      });
      // Send SMS if phone number is available
      if (updatedTrip.createdBy.phoneNo) {
        const smsMsg = `Your trip request to ${updatedTrip.destination} has been REJECTED.\nRemarks: ${remarks || 'None'}`;
        sendSMS(`+91 ${updatedTrip.createdBy.phoneNo}`, smsMsg);
      }
    }
  } catch (error) {
    res.status(500).json({ message: 'Error rejecting trip request', error: error.message });
  }
});

// COMPLETE TRIP REQUEST MANUALLY
router.post('/:id/complete', secureRoute, async (req, res) => {
  try {
    const tripRequestId = req.params.id;
    const trip = await tripRequest.findById(tripRequestId);
    if (!trip) {
      return res.status(404).json({ message: 'Trip request not found' });
    }
    // Mark trip as completed
    trip.status = 'Completed';
    await trip.save();

    // Set driver and vehicle back to available using IDs if present
    if (trip.vehicleDetails?.driverId) {
      await driverModel.findByIdAndUpdate(trip.vehicleDetails.driverId, { status: 'available' });
    }
    if (trip.vehicleDetails?.vehicleId) {
      await vehicleModel.findByIdAndUpdate(trip.vehicleDetails.vehicleId, { status: 'Available' });
    }
    res.status(200).json({ message: 'Trip marked as completed', trip });
  } catch (error) {
    res.status(500).json({ message: 'Error completing trip request', error: error.message });
  }
});

export default router;

