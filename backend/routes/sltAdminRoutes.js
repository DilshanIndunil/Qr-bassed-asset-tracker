import express from 'express';
import { loginSltAdmin, addCompany, getCompanies, addAdminToCompany, deleteAdminFromCompany, getAllAdministrators } from '../controllers/sltAdminController.js';  // Import the SLT Admin login controller
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// SLT Admin login route (updated path)
router.post('/slt-admin/login', loginSltAdmin);

// SLT Admin adds a new company
router.post('/slt-admin/add-company', authenticateToken, addCompany);

// SLT Admin fetches all companies
router.get('/slt-admin/companies', authenticateToken, getCompanies);

// Route to add an administrator to a company
router.post('/slt-admin/add-administrator', authenticateToken, addAdminToCompany);

// Route to remove administrator from a company 
router.delete('/slt-admin/remove-administrator', authenticateToken, deleteAdminFromCompany);

// Route to get administrators by company ID for SLT-Admin
router.get('/slt-admin/administrator/:companyId', authenticateToken, getAllAdministrators);

export default router;
