import express from 'express';
import Driver from '../models/driver.model.js';
import adminRoute from '../middleware/adminRoute.js';

const router = express.Router();

// GET all drivers - Public (needed for UI to display available drivers)
router.get('/', async (req, res) => {
  try {
    const drivers = await Driver.find({});
    res.status(200).json(drivers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching drivers', error: error.message });
  }
});

// POST create new driver - Admin only
router.post('/', adminRoute, async (req, res) => {
  try {
    const { driverName, age, phoneNo, licenseNo, status } = req.body;

    const newDriver = new Driver({
      driverName,
      age,
      phoneNo,
      licenseNo,
      status: status || 'available'
    });

    const savedDriver = await newDriver.save();
    res.status(201).json(savedDriver);
  } catch (error) {
    res.status(500).json({ message: 'Error creating driver', error: error.message });
  }
});

// DELETE driver by ID - Admin only
router.delete('/:id', adminRoute, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedDriver = await Driver.findByIdAndDelete(id);

    if (!deletedDriver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    res.status(200).json({ message: 'Driver deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting driver', error: error.message });
  }
});

// PATCH toggle temporarilyUnavailable status - Admin only
router.patch('/:id/toggleUnavailable', adminRoute, async (req, res) => {
  try {
    const { id } = req.params;
    const { temporarilyUnavailable } = req.body;
    const updatedDriver = await Driver.findByIdAndUpdate(
      id,
      { temporarilyUnavailable },
      { new: true }
    );
    if (!updatedDriver) {
      return res.status(404).json({ message: 'Driver not found' });
    }
    res.status(200).json(updatedDriver);
  } catch (error) {
    res.status(500).json({ message: 'Error updating driver status', error: error.message });
  }
});

export default router;
