import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema({
    vehicleName: {
        type: String,
        required: true,
        trim: true
    },
    capacity: {
        type: Number,
        required: true,
    },
    vehicleNo: {
        type: String,
        unique: true,
        trim: true,
        uppercase: true
    },
    vehicleColor: {
        type: String,
        required: true,
        trim: true,
    },
    vehicleClass: {
        type: String,
        required: true,
        enum: ['Economy', 'Business', 'Executive', 'Luxury'],
        trim: true
    }
}, {
    timestamps: true
});

export default mongoose.model('Vehicle', vehicleSchema); 