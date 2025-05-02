import mongoose from 'mongoose';

const maintenanceSchema = new mongoose.Schema({
    assetID: {
        type: String,
        required: true,
    },
    assetName: {
        type: String,
        required: true,
    },
    companyID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company', // Reference to the Company model
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    startTime: {
        type: String, // Store in HH:mm format
        required: true,
    },
    endDate: {
        type: Date, // New field for maintenance end date
        required: false, // Not mandatory
    },
    endTime: {
        type: String, // New field for maintenance end time
        required: false, // Not mandatory
    },
    description: {
        type: String,
        required: false, // Optional field
        maxlength: 500, // Restrict to 500 characters
    },
}, {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt`
});

export default mongoose.model('Maintenance', maintenanceSchema);
