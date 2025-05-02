import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { deleteCompany, updateCompany } from '../controllers/companyContoller.js';


const router = express.Router();

// Update company route
router.put('/company/:companyId', authenticateToken, updateCompany);

// Delete company route
router.delete('/company/:companyId', authenticateToken, deleteCompany);



export default router;