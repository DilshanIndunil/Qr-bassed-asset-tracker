import mongoose from 'mongoose';

const AssetSchema = new mongoose.Schema({
    assetID: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    brand: { type: String, required: true },
    purchaseDate: { type: Date, required: true, default: Date.now },
    status: { type: String, required: true },
    companyID: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    companyName: { type: String, required: true },
    type: { type: String },
    user: { type: String },
    condition: { type: String },
    location: { type: String },
    maintenanceDue: { type: Date },
    assetTag: { type: String },
    qrCode: { type: String },
    maintenance: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Maintenance' }],
    image: { type: String },  // Add the image field to store the uploaded image URL
});

const Asset = mongoose.model('Asset', AssetSchema);
export default Asset;
