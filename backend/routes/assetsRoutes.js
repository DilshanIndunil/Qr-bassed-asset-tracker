import express from 'express';
import {
    addAsset,
    updateAsset,
    editAsset,
    deleteAsset,
    getAssetsByCompanyID,
    getAssetById,
    updateUserAndStatusByAssetId,
    updateLocationByAssetId,
    getAssetCountByCompanyID,
} from '../controllers/assetsController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/assets/add/:companyID', authenticateToken, addAsset); // Add an asset

// Update asset fields
router.patch('/update/:assetID', authenticateToken, updateAsset);

// Route to update asset fields dynamically
router.put('/edit-asset/:assetID', authenticateToken, editAsset);

// Define the GET route to fetch all assets for a given companyID
router.get('/assets/:companyID', authenticateToken, getAssetsByCompanyID);

// Define the GET route to fetch asset details by assetID
router.get('/assets/details/:assetID', authenticateToken, getAssetById);

router.delete('/assets/:assetID', authenticateToken, deleteAsset);

// Define the PATCH route to update the user and status fields of an asset by assetID
router.patch('/assets/user-status/:assetID', authenticateToken, updateUserAndStatusByAssetId);

// Define the PATCH route to update the location field of an asset by assetID
router.patch('/assets/location/:assetID', authenticateToken, updateLocationByAssetId);

// Count assets in company
router.get('/companies/asset-count/:companyID', authenticateToken, getAssetCountByCompanyID);

export default router;
