import mongoose from 'mongoose';

const factoryWorkerSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        phone: { type: String, required: true },
        email: { type: String, unique: true }, // Email added with uniqueness constraint
        department: { type: String },
        position: { type: String, required: true },
        company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
        companyName: { type: String, required: true }
    },
    { timestamps: true }
);

const FactoryWorker = mongoose.model('FactoryWorker', factoryWorkerSchema);

export default FactoryWorker;
