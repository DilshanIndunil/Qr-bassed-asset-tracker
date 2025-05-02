import jwt from 'jsonwebtoken';
import Company from '../models/Company.js';
import Administrator from '../models/Administrator.js';


// Hardcoded SLT Admin credentials
const SLT_ADMIN_USERNAME = 'admin';  // Replace with your SLT Admin username
const SLT_ADMIN_PASSWORD = 'password';  // Replace with your SLT Admin password

// Login SLT Admin
export const loginSltAdmin = (req, res) => {
    const { username, password } = req.body;

    // Check if provided username matches the static username
    if (username !== SLT_ADMIN_USERNAME) {
        return res.status(404).json({ message: 'SLT Admin not found' });
    }

    // Check if the provided password matches the static password
    if (password !== SLT_ADMIN_PASSWORD) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    // If valid, generate JWT token
    const token = jwt.sign(
        {
            username,
            role: 'slt-admin' // Add the role here 
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    res.status(200).json({ message: 'Login successful', token });
};


// SLT Admin adds a new company
export const addCompany = async (req, res) => {
    const { name, industry, email, hotline, address, description, } = req.body;

    // Ensure only SLT Admin can perform this action
    if (req.user.role !== 'slt-admin') {
        return res.status(403).json({ message: 'Access forbidden: Admin role required' });
    }

    // Validate input
    if (!name || !industry || !email || !hotline || !address || !description) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Check if the company already exists
        const existingCompany = await Company.findOne({ email });
        if (existingCompany) {
            return res.status(400).json({ message: 'Company with this email already exists' });
        }

        // Create a new company
        const newCompany = new Company({
            name,
            industry,
            email,
            hotline,
            address,
            description,
        });

        await newCompany.save(); // Save the company to the database
        res.status(201).json({ message: 'Company added successfully', company: newCompany });
    } catch (error) {
        console.error('Error adding company:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


// Fetch all companies
export const getCompanies = async (req, res) => {
    try {

        // Ensure only SLT Admin can perform this action
        if (req.user.role !== 'slt-admin') {
            return res.status(403).json({ message: 'Access forbidden: Admin role required' });
        }

        const companies = await Company.find(); // Fetch all companies
        res.status(200).json(companies); // Return the list of companies
    } catch (err) {
        console.error('Error fetching companies:', err);
        res.status(500).json({ message: 'Server error. Unable to fetch companies.' });
    }
};

// Add administrator to company
export const addAdminToCompany = async (req, res) => {
    try {
        const { companyId, email, name } = req.body; // Expect companyId and email from the request body

        // Ensure only SLT Admin can perform this action
        if (req.user.role !== 'slt-admin') {
            return res.status(403).json({ message: 'Access forbidden: Admin role required' });
        }

        // Validate required fields
        if (!companyId || !email || !name) {
            return res.status(400).json({ message: 'Missing required fields: companyId, email, and name' });
        }

        // Step 2: Find the company by ID
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }

        // Step 1: Check if the Administrator already exists
        let admin = await Administrator.findOne({ email });
        if (!admin) {
            // If administrator does not exist, create a new one
            admin = new Administrator({
                name,
                email,
                role: 'company administrator', // Set default role
                company: companyId,
                companyName: company.name, // Use the company name from the fetched company document
            });

            await admin.save(); // Save the new administrator
        }

        // Step 3: Add the Administrator's ObjectId to the company's administrator array
        if (!company.administrator.includes(admin._id)) {
            company.administrator.push(admin._id); // Add the administrator's ID to the company
            await company.save(); // Save the updated company document
        }

        return res.status(200).json({ message: 'Administrator added successfully', admin, company });
    } catch (error) {
        console.error('Error adding administrator:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get administrator from company
export const getAllAdministrators = async (req, res) => {
    try {
        // Extract companyId from the request parameters
        const { companyId } = req.params;

        // Check if the user has the required role
        if (req.user.role !== 'slt-admin') {
            return res.status(403).json({ message: 'Access forbidden: Admin role required' });
        }

        // Step 1: Find the company document by ID
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }

        // Step 2: Get the list of administrator IDs from the company's "administrator" array
        const adminIds = company.administrator;

        // Step 3: Fetch the administrators from the Administrator collection using the IDs
        const administrators = adminIds.length > 0 ? await Administrator.find({ _id: { $in: adminIds } }) : [];

        // Step 4: Return the list of administrators (even if it's empty)
        return res.status(200).json({
            message: 'Administrators fetched successfully',
            administrators,  // This will be an empty array if no admins are found
        });
    } catch (error) {
        console.error('Error fetching administrators:', error);
        return res.status(500).json({
            message: 'Server error',
            error: error.message,
        });
    }
};

// Delete administrator from the company
export const deleteAdminFromCompany = async (req, res) => {
    try {
        const { companyId, email } = req.body; // Expect companyId and email from the request body

        // Ensure only SLT Admin can perform this action
        if (req.user.role !== 'slt-admin') {
            return res.status(403).json({ message: 'Access forbidden: Admin role required' });
        }

        // Step 1: Find the company by ID
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }

        // Step 2: Find the administrator by email
        const admin = await Administrator.findOne({ email });
        if (!admin) {
            return res.status(404).json({ message: 'Administrator not found' });
        }

        // Step 3: Check if the admin is associated with the company
        if (!company.administrator.includes(admin._id)) {
            return res.status(400).json({ message: 'Administrator is not associated with this company' });
        }

        // Step 4: Remove the Administrator's ObjectId from the company's administrator array
        company.administrator = company.administrator.filter(
            (adminId) => adminId.toString() !== admin._id.toString()
        );
        await company.save(); // Save the updated company document

        // Step 5: Optionally delete the administrator document
        await Administrator.deleteOne({ _id: admin._id });

        return res.status(200).json({ message: 'Administrator removed successfully', company });
    } catch (error) {
        console.error('Error removing administrator:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};


