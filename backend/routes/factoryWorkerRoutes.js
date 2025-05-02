import express from 'express';
import { addFactoryWorker, deleteFactoryWorker, getFactoryWorkersByCompany, updateFactoryWorker } from '../controllers/factoryWorkerController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route to add a factory worker with companyId as a URL parameter
router.post('/factory-worker/add/:companyId', authenticateToken, addFactoryWorker);

// Route to delete a factory worker
router.delete('/factory-worker/:workerId', authenticateToken, deleteFactoryWorker);

// Route to get all factory workers assigned to a specific company
router.get('/factory-worker/company/:companyId', authenticateToken, getFactoryWorkersByCompany);

// Route to update a factory worker's details
router.put('/factory-worker/:workerId', authenticateToken, updateFactoryWorker);

export default router;
