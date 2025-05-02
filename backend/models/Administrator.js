import mongoose from 'mongoose';

const AdministratorSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, default: 'company administrator' },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' }, // Reference to Company
    companyName: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const Administrator = mongoose.model('Administrator', AdministratorSchema);

export default Administrator;