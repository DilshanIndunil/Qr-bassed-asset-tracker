import express from "express";
import { sendVerificationCode, verifyCode, getAdministratorDetails } from "../controllers/administratorController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/administrator/send-code", sendVerificationCode); // Send verification code
router.post("/administrator/verify-code", verifyCode);         // Verify the code and login
router.get("/administrator/details", authenticateToken, getAdministratorDetails);       // Get administrator name

export default router;