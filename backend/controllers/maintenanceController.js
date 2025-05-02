import mongoose from 'mongoose';
import Maintenance from '../models/Maintenance.js';
import Asset from '../models/Assets.js';
import Company from '../models/Company.js';


// Add a new maintenance record
export const addMaintenanceRecord = async (req, res) => {
    const session = await mongoose.startSession(); // Start a session for transaction
    session.startTransaction();

    try {
        const { assetID, companyID, startDate, startTime, endDate, endTime, description } = req.body;

        // Ensure only Maintenance staff can perform this action
        // if (req.user.role !== 'maintenance-staff') {
        //     return res.status(403).json({ message: 'Access forbidden: Admin role required' });
        // }

        // Input validation
        if (!assetID || !companyID || !startDate || !startTime || !description) {
            return res.status(400).json({ message: 'Start date, start time, description, assetID, and companyID are required' });
        }

        // Ensure asset exists and fetch asset name
        const asset = await Asset.findOne({ assetID });
        if (!asset) {
            return res.status(404).json({ message: 'Asset not found' });
        }

        // Ensure company exists
        const companyExists = await Company.findById(companyID);
        if (!companyExists) {
            return res.status(404).json({ message: 'Company not found' });
        }

        // Step 1: Create and save the new maintenance record
        const newRecord = new Maintenance({
            assetID,
            assetName: asset.name, // Include asset name
            companyID,
            startDate,
            startTime,
            endDate, // Add endDate
            endTime, // Add endTime
            description,
        });

        const savedRecord = await newRecord.save({ session });

        // Step 2: Update the Asset document with the maintenance record
        const updatedAsset = await Asset.findOneAndUpdate(
            { assetID }, // Match the asset by its ID
            { $push: { maintenance: savedRecord._id } }, // Add the maintenance ID to the array
            { new: true, session } // Return the updated document and use the transaction session
        );

        if (!updatedAsset) {
            throw new Error('Failed to update asset with maintenance record');
        }

        // Step 3: Update the Company's maintenance field
        const updatedCompany = await Company.findByIdAndUpdate(
            companyID,
            { $push: { maintenance: savedRecord._id } },
            { new: true, session }
        );

        if (!updatedCompany) {
            throw new Error('Failed to update company with maintenance record');
        }

        // Commit transaction
        await session.commitTransaction();
        session.endSession();

        // Step 4: Return success response
        res.status(201).json({
            message: 'Maintenance record added successfully',
            maintenance: savedRecord,
            updatedAsset,
            updatedCompany,
        });
    } catch (error) {
        // Rollback transaction in case of error
        await session.abortTransaction();
        session.endSession();

        res.status(500).json({
            message: 'Failed to add maintenance record',
            error: error.message,
        });
    }
};

// Get all maintenance records for a specific asset with complete details
export const getMaintenanceRecordsByAsset = async (req, res) => {
    try {
        const { assetId } = req.params;

        // Fetch maintenance records and populate asset and company details
        const records = await Maintenance.find({ assetID: assetId })
            .populate({
                path: 'assetID', // Assuming `assetID` is a reference to the Assets model
                select: 'assetName assetType location', // Select specific fields from the Assets collection
            })
            .populate({
                path: 'companyID', // Assuming `companyID` is a reference to the Company model
                select: 'companyName companyAddress', // Select specific fields from the Company collection
            });

        // Ensure only Maintenance staff can perform this action
        if (req.user.role !== 'maintenance-staff') {
            return res.status(403).json({ message: 'Access forbidden: Admin role required' });
        }

        if (!records.length) {
            return res.status(404).json({ message: 'No maintenance records found for this asset' });
        }

        res.status(200).json({ data: records });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch maintenance records', error: error.message });
    }
};


// Delete a maintenance record by its ID
export const deleteMaintenanceRecord = async (req, res) => {
    try {
        const { maintenanceId } = req.params;

        const deletedRecord = await Maintenance.findByIdAndDelete(maintenanceId);

        if (!deletedRecord) {
            return res.status(404).json({ message: 'Maintenance record not found' });
        }

        res.status(200).json({ message: 'Maintenance record deleted successfully', data: deletedRecord });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete maintenance record', error: error.message });
    }
};

// Get all maintenance records for a specific company
export const getMaintenanceRecordsByCompanyId = async (req, res) => {
    try {
        const { companyId } = req.params;

        const records = await Maintenance.find({ companyID: companyId });

        // Ensure only Administrator can perform this action
        if (req.user.role !== 'company-administrator') {
            return res.status(403).json({ message: 'Access forbidden: Admin role required' });
        }

        if (!records.length) {
            return res.status(404).json({ message: 'No maintenance records found for this company' });
        }

        res.status(200).json({ data: records });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch maintenance records', error: error.message });
    }
};
