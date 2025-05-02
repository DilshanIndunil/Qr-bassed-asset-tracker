import Administrator from "../models/Administrator.js";
import Company from "../models/Company.js"; // Ensure the Company model is imported
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

// Temporary store for verification codes
const verificationCodes = {};

// Step 1: Send Verification Code
export const sendVerificationCode = async (req, res) => {
    const { email } = req.body;

    try {
        // Validate the email input
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        // Check if the email exists in the database
        const admin = await Administrator.findOne({ email });
        if (!admin) {
            return res.status(404).json({ message: "Administrator not found" });
        }

        // Generate a random 6-digit verification code
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

        // Store the verification code temporarily with an expiration time (10 minutes)
        verificationCodes[email] = {
            code: verificationCode,
            expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes from now
        };

        // Send the verification code via email
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Your Verification Code",
            text: `Your verification code is ${verificationCode}`,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: "Verification code sent successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to send verification code", error: error.message });
    }
};

export const verifyCode = async (req, res) => {
    const { email, code } = req.body;

    try {
        // Validate the input
        if (!email || !code) {
            return res.status(400).json({ message: "Email and verification code are required" });
        }

        // Normalize the email
        const normalizedEmail = email.toLowerCase();

        // Check if the code exists and matches the stored code
        const storedCode = verificationCodes[normalizedEmail];
        if (!storedCode || storedCode.code !== code) {
            return res.status(400).json({ message: "Invalid verification code" });
        }

        // Check if the code has expired
        if (storedCode.expiresAt < Date.now()) {
            delete verificationCodes[normalizedEmail]; // Remove expired code
            return res.status(400).json({ message: "Verification code has expired" });
        }

        // Find the administrator in the database
        const admin = await Administrator.findOne({ email: normalizedEmail }).populate('company');
        if (!admin) {
            return res.status(404).json({ message: "Administrator not found" });
        }

        if (!admin.company) {
            return res.status(404).json({ message: "Associated company not found for this administrator" });
        }

        // Generate a JWT token with additional details
        const token = jwt.sign(
            {
                id: admin._id,
                email: admin.email,
                name: admin.name,
                role: "company-administrator",
                companyId: admin.company._id,
                companyName: admin.company.name,
            },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        // Remove the verification code after successful verification
        delete verificationCodes[normalizedEmail];

        res.status(200).json({ message: "Verification successful", token });
    } catch (error) {
        res.status(500).json({ message: "Failed to verify code", error: error.message });
    }
};


// New function to get the administrator's details
export const getAdministratorDetails = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const admin = await Administrator.findById(decoded.id).populate('company');

        if (!admin) {
            return res.status(404).json({ message: "Administrator not found" });
        }

        res.status(200).json({
            name: admin.name,
            email: admin.email,
            companyName: admin.company.name,
            companyId: admin.company._id
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch administrator details", error: error.message });
    }
};