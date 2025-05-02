import Asset from "../models/Assets.js";
import Company from "../models/Company.js";
import mongoose from "mongoose";

export const addAsset = async (req, res) => {
    try {
        const { companyID } = req.params; // Extract companyID from URL
        const { name, brand, purchaseDate, status } = req.body;

        // Ensure only allowed roles can perform this action
        if (
            req.user.role === 'company-administrator'
        ) {
            // Allowed roles, continue with the operation
        } else {
            return res.status(403).json({ message: 'Access forbidden: Admin role required' });
        }

        // Validate if company exists
        const company = await Company.findById(companyID);
        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }

        // Count existing assets for this company
        const assetCount = await Asset.countDocuments({ companyID });

        // Generate the next sequential asset ID (e.g., 001, 002, ...)
        const assetID = String(assetCount + 1).padStart(3, "0");

        // Create a new asset
        const newAsset = new Asset({
            assetID,  // Use sequential asset ID
            name,
            brand,
            purchaseDate,
            status,
            companyID,
            companyName: company.name, // Store company name
        });

        // Save the asset to the database
        const savedAsset = await newAsset.save();

        // Add the asset to the company's assets array
        company.assets.push(savedAsset._id);
        await company.save();

        res.status(201).json({
            message: "Asset added successfully",
            asset: savedAsset,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error adding asset",
            error,
        });
    }
};

// Get asset details by assetID
export const getAssetById = async (req, res) => {
    try {
        const { assetID } = req.params; // Get assetID from the URL parameter

        // Ensure only allowed roles can perform this action
        if (
            req.user.role === 'company-administrator' ||
            req.user.role === 'maintenance-staff' ||
            req.user.role === 'factory-worker'
        ) {
            // Allowed roles, continue with the operation
        } else {
            return res.status(403).json({ message: 'Access forbidden: Admin role required' });
        }

        // Find the asset by its custom assetID
        const asset = await Asset.findOne({ assetID });

        if (!asset) {
            return res.status(404).json({ message: 'Asset not found' });
        }

        // Return the asset details
        res.status(200).json({
            message: 'Asset retrieved successfully',
            asset
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error retrieving asset',
            error
        });
    }
};

// Update assets by assetID
export const updateAsset = async (req, res) => {
    try {
        const { assetID } = req.params; // Get assetID from URL
        const updates = req.body; // Fields to update

        // Ensure only Administrator can perform this action
        if (req.user.role !== 'company-administrator') {
            return res.status(403).json({ message: 'Access forbidden: Admin role required' });
        }

        // Prevent updating assetID
        if (updates.assetID) {
            return res.status(400).json({ message: 'Cannot update assetID' });
        }

        // Find asset and update with the provided fields
        const updatedAsset = await Asset.findOneAndUpdate(
            { assetID }, // Match asset by custom ID
            { $set: updates }, // Update fields dynamically
            { new: true, runValidators: true } // Return the updated document and validate changes
        );

        if (!updatedAsset) {
            return res.status(404).json({ message: 'Asset not found' });
        }

        res.status(200).json({
            message: 'Asset updated successfully',
            asset: updatedAsset
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating asset', error });
    }
};

// Edit assets by assetID
export const editAsset = async (req, res) => {
    try {
        // Extract assetID from params (or use body if you prefer)
        const { assetID } = req.params;

        // Find the asset by assetID
        const asset = await Asset.findOne({ assetID });

        // Ensure only Administrator can perform this action
        if (req.user.role !== 'company-administrator' && req.user.role !== 'maintenance-staff' && req.user.role !== 'factory-worker') {
            return res.status(403).json({ message: 'Access forbidden: Admin role required' });
        }



        if (!asset) {
            return res.status(404).json({ message: 'Asset not found' });
        }

        // Get the fields to be updated from the request body
        const updateData = req.body;

        // Iterate over the fields passed in the request body and update them
        Object.keys(updateData).forEach((key) => {
            // Check if the field is a valid field to update
            if (asset[key] !== undefined) {
                asset[key] = updateData[key];
            }
        });

        // Save the updated asset
        const updatedAsset = await asset.save();

        // Return the updated asset
        res.status(200).json({
            message: 'Asset updated successfully',
            asset: updatedAsset
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error updating asset',
            error
        });
    }
};


// Get all assets by companyID
export const getAssetsByCompanyID = async (req, res) => {
    try {
        const { companyID } = req.params; // Get companyID from the URL parameter

        // // Ensure only Administrator can perform this action
        if (req.user.role !== 'company-administrator') {
            return res.status(403).json({ message: 'Access forbidden: Admin role required' });
        }

        // Find all assets associated with the companyID
        const assets = await Asset.find({ companyID });

        if (assets.length === 0) {
            return res.status(404).json({ message: 'No assets found for this company' });
        }

        // Return the assets
        res.status(200).json({
            message: 'Assets retrieved successfully',
            assets
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error retrieving assets',
            error
        });
    }
};


// Delete an asset and remove it from the company's assets array
export const deleteAsset = async (req, res) => {
    try {
        const { assetID } = req.params; // Get assetID from URL parameter

        // Ensure only Administrator can perform this action
        if (req.user.role !== 'company-administrator') {
            return res.status(403).json({ message: 'Access forbidden: Admin role required' });
        }

        // Find the asset by its custom assetID
        const asset = await Asset.findOne({ assetID });
        if (!asset) {
            return res.status(404).json({ message: 'Asset not found' });
        }

        // Remove the asset from the Asset collection
        await Asset.findOneAndDelete({ assetID });

        // Remove the asset's ID from the company's assets array
        await Company.updateOne(
            { _id: asset.companyID }, // Match company by its ID
            { $pull: { assets: asset._id } } // Remove the asset's ObjectId from the assets array
        );

        res.status(200).json({
            message: 'Asset deleted successfully',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error deleting asset',
            error
        });
    }
};


// Update user and status fields of an asset by assetID
export const updateUserAndStatusByAssetId = async (req, res) => {
    try {
        const { assetID } = req.params;
        const { user, status } = req.body;

        const updateData = {};
        if (user !== undefined) updateData.user = user;
        if (status !== undefined) updateData.status = status;

        const asset = await Asset.findOneAndUpdate(
            { assetID },
            updateData,
            { new: true }
        );

        if (req.user.role !== 'maintenance-staff' && req.user.role !== 'factory-worker') {
            return res.status(403).json({ message: 'Access forbidden: Admin role required' });
        }

        if (!asset) {
            return res.status(404).json({ message: 'Asset not found' });
        }

        res.status(200).json({ message: 'User and status updated successfully', asset });
    } catch (error) {
        console.error('Error updating user and status:', error);
        res.status(500).json({ message: 'Failed to update user and status', error });
    }
};


// Update location of an asset by assetID
export const updateLocationByAssetId = async (req, res) => {
    try {
        const { assetID } = req.params;
        const { location } = req.body;

        if (req.user.role !== 'maintenance-staff' && req.user.role !== 'factory-worker') {
            return res.status(403).json({ message: 'Access forbidden: Admin role required' });
        }

        if (location === undefined) {
            return res.status(400).json({ message: 'Location is required' });
        }

        const asset = await Asset.findOneAndUpdate(
            { assetID },
            { location },  // Updating only the location field
            { new: true }
        );

        if (!asset) {
            return res.status(404).json({ message: 'Asset not found' });
        }

        res.status(200).json({ message: 'Location updated successfully', asset });
    } catch (error) {
        console.error('Error updating location:', error);
        res.status(500).json({ message: 'Failed to update location', error });
    }
};

export const getAssetCountByCompanyID = async (req, res) => {
    try {
        const { companyID } = req.params; // Extract companyID from the route parameter

        // Ensure only allowed roles can perform this action
        if (req.user.role !== 'company-administrator') {
            return res.status(403).json({ message: 'Access forbidden: Admin role required' });
        }

        // Count the number of assets associated with the companyID
        const assetCount = await Asset.countDocuments({ companyID });

        res.status(200).json({
            message: 'Asset count retrieved successfully',
            companyID,
            assetCount
        });
    } catch (error) {
        console.error('Error retrieving asset count:', error);
        res.status(500).json({
            message: 'Failed to retrieve asset count',
            error
        });
    }
};

