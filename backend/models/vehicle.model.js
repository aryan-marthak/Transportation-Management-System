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
    status: {
        type: String,
        required: true,
        enum: ['Assigned', 'Available'],
        default: 'Available'
    },
    outOfService: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

export default mongoose.model('Vehicle', vehicleSchema); 