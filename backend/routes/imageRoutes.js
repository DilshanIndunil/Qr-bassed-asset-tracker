import express from 'express';
import upload from '../middleware/multer.js';  // Import the multer middleware
import { importSingle, fetchImage } from '../controllers/imageController.js'; // Import controller functions

const router = express.Router();

// Route to handle image upload for a specific asset
router.post('/upload-single/:assetID', upload.single('image'), importSingle);

// Route to fetch image by assetID (GET request)
router.get('/fetch-image/:assetID', fetchImage);

export default router;
