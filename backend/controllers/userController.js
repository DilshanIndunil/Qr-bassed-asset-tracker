import FactoryWorker from '../models/FactoryWorker.js';
import Company from '../models/Company.js'; // Adjust the import according to your file structure
import jwt from 'jsonwebtoken';
import twilio from 'twilio';
import dotenv from 'dotenv';
dotenv.config();

// Twilio setup
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);


// Temporary storage for OTPs (can be replaced with Redis for production)
let otpStore = {};

// Function to format phone number to E.164 (for Twilio)
const formatPhoneNumber = (phone) => {
    return `+94${phone.substring(1)}`; // Remove leading zero and add country code
};

export const sendOTP = async (req, res) => {
    try {
        const { phone } = req.body;

        // Validate phone number
        if (!phone) {
            return res.status(400).json({ message: 'Phone number is required' });
        }

        // Format the phone number before sending
        const formattedPhone = formatPhoneNumber(phone);

        // Generate a random 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Log the OTP to the console
        console.log(`Generated OTP for ${phone}: ${otp}`);

        // Send OTP via Twilio
        await client.messages.create({
            body: `Your verification code is: ${otp}`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: formattedPhone,
        });

        // Store OTP in memory for 1 hour
        otpStore[phone] = { otp, timestamp: Date.now() };

        return res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error("Error sending OTP:", error);
        return res.status(500).json({ message: 'Failed to send OTP', error: error.message });
    }
};


export const loginFactoryWorker = async (req, res) => {
    try {
        const { phone, otp: userOtp } = req.body;

        // Validate request body
        if (!phone || !userOtp) {
            return res.status(400).json({ message: 'Phone number and OTP are required' });
        }

        // Check if OTP exists for the phone number
        if (!otpStore[phone]) {
            return res.status(404).json({ message: 'OTP not sent or expired' });
        }

        const { otp, timestamp } = otpStore[phone];

        // Check if OTP has expired (1 hour)
        if (Date.now() - timestamp > 60 * 60 * 1000) {  // 1 hour in milliseconds
            delete otpStore[phone]; // Delete expired OTP
            return res.status(408).json({ message: 'OTP expired' });
        }

        // Check if OTP entered by user matches
        if (userOtp !== otp) {
            return res.status(401).json({ message: 'Invalid OTP' });
        }

        // Query the database with the raw phone number
        const factoryWorker = await FactoryWorker.findOne({ phone: phone });

        // Log the phone number and query result for debugging
        console.log(`Querying FactoryWorker with phone: ${phone}`);
        if (!factoryWorker) {
            console.error('Factory worker not found.');
            return res.status(404).json({ message: 'Factory worker not found' });
        }

        // Validate required fields (companyName and company)
        if (!factoryWorker.companyName || !factoryWorker.company) {
            return res.status(400).json({ message: "Worker's company details are missing." });
        }

        // Generate a JWT token with factory worker's details
        const token = jwt.sign(
            {
                id: factoryWorker._id,
                role: 'factory-worker',
                name: factoryWorker.name,
                company: factoryWorker.companyName,
                companyId: factoryWorker.company,
                phone: factoryWorker.phone
            },
            process.env.JWT_SECRET,
            { expiresIn: '40m' } // Set the expiration time to 40 minutes
        );

        // Remove the OTP after successful login
        delete otpStore[phone];

        return res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Error logging in factory worker:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};



export const loginMaintenanceStaff = async (req, res) => {
    try {
        const { phone, otp: userOtp } = req.body;

        // Validate request body
        if (!phone || !userOtp) {
            return res.status(400).json({ message: 'Phone number and OTP are required' });
        }

        // Check if OTP exists for the phone number
        if (!otpStore[phone]) {
            return res.status(404).json({ message: 'OTP not sent or expired' });
        }

        const { otp, timestamp } = otpStore[phone];

        // Check if OTP has expired (1 hour)
        if (Date.now() - timestamp > 60 * 60 * 1000) {  // 1 hour in milliseconds
            delete otpStore[phone]; // Delete expired OTP
            return res.status(408).json({ message: 'OTP expired' });
        }

        // Check if OTP entered by user matches
        if (userOtp !== otp) {
            return res.status(401).json({ message: 'Invalid OTP' });
        }

        // Log the raw phone number for debugging
        console.log(`Raw phone number: ${phone}`);

        // Find the maintenance staff by phone number (no formatting needed)
        const maintenanceStaff = await FactoryWorker.findOne({ phone: phone });

        // Log the result of the query to debug
        console.log(`Maintenance staff query result: ${JSON.stringify(maintenanceStaff)}`);

        if (!maintenanceStaff) {
            console.error('Maintenance staff not found.');
            return res.status(404).json({ message: 'Maintenance staff not found' });
        }

        // Log the position for debugging
        console.log(`Found staff position: ${maintenanceStaff.position}`);

        // Check if the maintenance staff's position is "maintenance staff"
        // if (maintenanceStaff.position.toLowerCase() !== 'maintenance staff') {
        //     console.error('Access forbidden: Position mismatch.');
        //     return res.status(403).json({ message: 'Access forbidden: Position must be "maintenance staff"' });
        // }

        // Generate a JWT token with maintenance staff's details
        const token = jwt.sign(
            {
                id: maintenanceStaff._id,
                role: 'maintenance-staff',
                name: maintenanceStaff.name,
                company: maintenanceStaff.companyName,
                phone: maintenanceStaff.phone,
                companyId: maintenanceStaff.company // Include companyId in the token payload
            },
            process.env.JWT_SECRET,
            { expiresIn: '40m' }
        );

        // Remove the OTP after successful login
        delete otpStore[phone];

        return res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Error logging in maintenance staff:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};




// Function to get the user count for a company
export const getUserCount = async (req, res) => {
    try {
        const { companyID } = req.params; // Extract companyID from the route parameter

        // Find the company by companyID
        const company = await Company.findById(companyID);

        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }

        // Get the administrator count (length of the administrator array)
        const administratorCount = company.administrator.length;

        // Get the factory worker count (length of the factoryWorkers array)
        const factoryWorkerCount = company.factoryWorkers.length;

        // Calculate total user count (administrator + factory workers)
        const totalUserCount = administratorCount + factoryWorkerCount;

        // Respond with the counts
        res.status(200).json({
            message: 'User count retrieved successfully',
            administratorCount,
            factoryWorkerCount,
            totalUserCount
        });
    } catch (error) {
        console.error('Error retrieving user count:', error);
        res.status(500).json({
            message: 'Failed to retrieve user count',
            error: error.message
        });
    }
};