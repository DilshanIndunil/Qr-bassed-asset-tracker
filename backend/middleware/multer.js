import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Define the upload folder
const uploadFolder = 'uploads/images';

// Ensure the directory exists
if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder, { recursive: true });
}

// Configure Multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadFolder); // Save to "uploads/images"
    },
    filename: (req, file, cb) => {
        // Save the file with a unique name based on timestamp
        cb(null, `image_${Date.now()}${path.extname(file.originalname)}`);
    },
});

// File type validation
const fileFilter = (req, file, cb) => {
    const allowedMimes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];

    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        return cb(new Error("Invalid file type. Only JPG, PNG, and GIF are allowed."), false);
    }
};

// File size and limits
const maxSize = 5 * 1024 * 1024; // 5MB limit
const fileLimits = {
    fileSize: maxSize,
    files: 4,
};

// Initialize Multer
const upload = multer({ storage, fileFilter, limits: fileLimits });

export default upload;
