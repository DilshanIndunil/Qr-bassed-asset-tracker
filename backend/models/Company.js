import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
    name: { type: String, required: true },
    industry: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    hotline: { type: String, required: true },
    address: { type: String, required: true },
    description: { type: String, required: true },
    administrator: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Administrator' }], // Reference to Administrator
    factoryWorkers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FactoryWorker' }],
    assets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Asset' }], // Reference to Asset
    maintenance: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Maintenance' }] // Reference to Maintenance
}, { timestamps: true });

const Company = mongoose.model('Company', companySchema);

export default Company;
