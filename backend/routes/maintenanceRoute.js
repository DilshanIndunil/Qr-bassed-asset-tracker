import express from 'express';
import {
    addMaintenanceRecord,
    getMaintenanceRecordsByAsset,
    deleteMaintenanceRecord,
    getMaintenanceRecordsByCompanyId
} from '../controllers/maintenanceController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
// import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route to add a new maintenance record
router.post('/maintenance/add', authenticateToken, addMaintenanceRecord);


// Route to get all maintenance records for a specific asset
router.get('/maintenance/asset/:assetId', authenticateToken, getMaintenanceRecordsByAsset);

// Route to delete a maintenance record by its ID
router.delete('/maintenance/delete/:maintenanceId', authenticateToken, deleteMaintenanceRecord);

// Route to get all maintenance records by company ID
router.get('/maintenance/company/:companyId', authenticateToken, getMaintenanceRecordsByCompanyId);

export default router;
