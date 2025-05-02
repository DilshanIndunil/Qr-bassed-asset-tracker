import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import connectDB from './config/db.js'; // Database connection

// Import Routes
import sltAdminRoutes from './routes/sltAdminRoutes.js';
import companyRoutes from './routes/companyRoutes.js';
import administratorRoutes from './routes/administratorRoutes.js';
import factoryWorkerRoutes from './routes/factoryWorkerRoutes.js';
import assetsRoutes from './routes/assetsRoutes.js';
import userRoutes from './routes/userRoutes.js';
import maintenanceRoute from './routes/maintenanceRoute.js';
import imageRoutes from './routes/imageRoutes.js';

dotenv.config(); // Load environment variables from .env file

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json()); // For JSON data
app.use(bodyParser.json()); // Parsing application/json
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'], // Replace with your frontend URLs
    credentials: true, // Allow credentials (cookies, authentication headers, etc.)
}));

// ✅ Serve images correctly from 'uploads' folder
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api', sltAdminRoutes);
app.use('/api', companyRoutes);
app.use('/api', administratorRoutes);
app.use('/api', factoryWorkerRoutes);
app.use('/api', assetsRoutes);
app.use('/api', userRoutes);
app.use('/api', maintenanceRoute);
app.use('/api', imageRoutes);

// Default Route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
