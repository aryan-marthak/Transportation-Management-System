import mongoose from "mongoose";

const tripRequestSchema = new mongoose.Schema({
    purpose: {
        type: String,
        required: true,
        enum: ['Official', 'Personal'],
        trim: true
    },
    designation: {
        type: String,
        required: true,
        enum: ['Unit Head', 'Functional Head', 'Department Head', 'Sectional Head', 'Management', 'Staff', 'Worker'],
        trim: true
    },
    vehicleClass: {
        type: String,
        required: true,
        enum: ['Economy', 'Business', 'Executive', 'Luxury'],
        trim: true
    },
    destination: {
        type: String,
        required: true,
        trim: true
    },
    pickupPoint: {
        type: String,
        required: true,
        trim: true,
    },
    startDate: {
        type: Date,
        required: true
    },
    startTime: {
        type: String,
        required: true,
        trim: true
    },
    endDate: {
        type: Date,
        required: true
    },
    numberOfPassengers: {
        type: Number,
        required: true,
        min: 1,
        max: 20
    },
    remarks: {
        type: String,
        trim: true,
        default: ''
    }
}, {
    timestamps: true
});

export default mongoose.model('tripRequest', tripRequestSchema); 