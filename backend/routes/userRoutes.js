import express from 'express';
import { loginFactoryWorker, loginMaintenanceStaff, sendOTP, getUserCount } from '../controllers/userController.js';

const router = express.Router();

// Route to send OTP to the phone number
router.post('/send-otp', sendOTP);

// Route to log in a factory worker
router.post('/login-factory-worker', loginFactoryWorker);

// Route to log in maintenance staff
router.post('/login-maintenance-staff', loginMaintenanceStaff);

router.get('/user-count/:companyID', getUserCount);

export default router;
