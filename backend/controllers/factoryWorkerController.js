import FactoryWorker from '../models/FactoryWorker.js';
import Company from '../models/Company.js';
import mongoose from 'mongoose';

// Add a new factory worker
export const addFactoryWorker = async (req, res) => {
    try {
        const { name, phone, email, position, department } = req.body;
        const { companyId } = req.params;  // Extract companyId from route parameters

        // Ensure only Administrator can perform this action
        if (req.user.role !== 'company-administrator') {
            return res.status(403).json({ message: 'Access forbidden: Admin role required' });
        }

        // Validate request body
        if (!name || !phone || !email || !position) {
            return res.status(400).json({ message: 'All fields are required: name, phone, email, position' });
        }

        // Check if the company exists
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }

        // Check if a worker with the same phone already exists
        const existingPhone = await FactoryWorker.findOne({ phone });
        if (existingPhone) {
            return res.status(400).json({ message: 'Factory worker with this phone already exists' });
        }

        // Create a new factory worker
        const newWorker = new FactoryWorker({ name, phone, email, company: companyId, companyName: company.name, position, department });
        await newWorker.save();

        // Add worker reference to the company's factoryWorkers array (if necessary)
        company.factoryWorkers.push(newWorker._id);
        await company.save();

        return res.status(201).json({ message: 'Factory worker added successfully', factoryWorker: newWorker });
    } catch (error) {
        console.error('Error adding factory worker:', error);
        return res.status(500).json({ message: 'Failed to add factory worker', error: error.message });
    }
};

export const deleteFactoryWorker = async (req, res) => {
    try {
        const { workerId } = req.params;

        // Ensure only Adminictrator can perform this action
        if (req.user.role !== 'company-administrator') {
            return res.status(403).json({ message: 'Access forbidden: Admin role required' });
        }

        if (!mongoose.Types.ObjectId.isValid(workerId)) {
            return res.status(400).json({ message: 'Invalid worker ID format' });
        }

        // Find the factory worker by ID
        const factoryWorker = await FactoryWorker.findById(workerId);
        if (!factoryWorker) {
            return res.status(404).json({ message: 'Factory worker not found' });
        }

        // Find the associated company
        const company = await Company.findById(factoryWorker.company);
        if (!company) {
            return res.status(404).json({ message: 'Associated company not found' });
        }

        // Remove the worker reference from the company's factoryWorkers array
        company.factoryWorkers = company.factoryWorkers.filter(
            (worker) => worker.toString() !== workerId
        );

        // Save the updated company document
        await company.save(); // Ensure the update is persisted to the database

        // Delete the factory worker document from the database
        await FactoryWorker.deleteOne({ _id: workerId });

        return res.status(200).json({ message: 'Factory worker deleted successfully' });
    } catch (error) {
        console.error('Error deleting factory worker:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};


// Controller for getting factory workers by company ID
export const getFactoryWorkersByCompany = async (req, res) => {
    try {
        const { companyId } = req.params; // Get company ID from request parameters
        // Ensure only Adminictrator can perform this action
        if (req.user.role !== 'company-administrator') {
            return res.status(403).json({ message: 'Access forbidden: Admin role required' });
        }

        // Check if the company exists
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }

        // Find all factory workers assigned to this company
        const factoryWorkers = await FactoryWorker.find({ company: companyId });

        return res.status(200).json({ message: 'Factory workers fetched successfully', factoryWorkers });
    } catch (error) {
        console.error('Error fetching factory workers:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};


// Controller for updating factory worker details
export const updateFactoryWorker = async (req, res) => {
    try {
        const { workerId } = req.params; // Get the workerId from request parameters
        const { name, phone, email, position } = req.body; // Get updated data from request body

        // Ensure only Administrator can perform this action
        if (req.user.role !== 'company-administrator') {
            return res.status(403).json({ message: 'Access forbidden: Admin role required' });
        }

        // Validate request body
        if (!name || !phone || !email || !position) {
            return res.status(400).json({ message: 'All fields are required: name, phone, email, position' });
        }

        // Check if the factory worker exists
        const factoryWorker = await FactoryWorker.findById(workerId);
        if (!factoryWorker) {
            return res.status(404).json({ message: 'Factory worker not found' });
        }

        // Update the worker's details
        factoryWorker.name = name || factoryWorker.name;
        factoryWorker.phone = phone || factoryWorker.phone;
        factoryWorker.email = email || factoryWorker.email;
        factoryWorker.position = position || factoryWorker.position;

        // Save the updated worker details
        await factoryWorker.save();

        return res.status(200).json({ message: 'Factory worker updated successfully', factoryWorker });
    } catch (error) {
        console.error('Error updating factory worker:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};
