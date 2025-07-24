import express from 'express';
import mongoose from 'mongoose';
import Employee from '../models/employee.model.js';
import bcrypt from 'bcrypt';
import createTokenAndSaveCookie from '../jwt/generateToken.js';
import secureRoute from '../middleware/secureRoute.js';
import { sendMail } from '../utils/mailer.js';

const router = express.Router();

// In-memory store for pending signups
const pendingSignups = {};

// Helper to generate 6-digit OTP
function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Signup with OTP initiation
router.post('/signup', async (req, res) => {
    const { employeeId, name, email, password, department } = req.body;
    if (!employeeId || !name || !email || !password || !department) {
        return res.status(400).json({ error: 'All fields are required.' });
    }
    if (!email.endsWith('@adityabirla.com')) {
        return res.status(400).json({ error: 'Only @adityabirla.com emails are allowed.' });
    }
    const existingEmployee = await Employee.findOne({ $or: [{ email }, { employeeId }] });
    if (existingEmployee) {
        return res.status(400).json({ error: 'Employee already exists.' });
    }
    try {
        const otp = generateOtp();
        console.log('OTP for', email, 'is', otp); // TEMP: Log OTP for testing
        pendingSignups[email] = {
            employeeId,
            name,
            email,
            password,
            department,
            otp,
            expires: Date.now() + 10 * 60 * 1000
        };
        // Send OTP via email with improved template
        await sendMail(
            email,
            'Your OTP Code',
            `Hello ${name},\n\nYour OTP code for signup is: ${otp}\n\nThis code will expire in 10 minutes.\n\nIf you did not request this, please ignore this email.`
        );
        res.status(200).json({ message: 'OTP sent to your email.' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to send OTP.' });
    }
});

// OTP verification and account creation
router.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;
    const pending = pendingSignups[email];
    if (!pending) {
        return res.status(400).json({ error: 'No pending signup for this email.' });
    }
    if (pending.otp !== otp) {
        return res.status(400).json({ error: 'Invalid OTP.' });
    }
    if (Date.now() > pending.expires) {
        delete pendingSignups[email];
        return res.status(400).json({ error: 'OTP expired.' });
    }
    try {
        const employee = new Employee({
            employeeId: pending.employeeId,
            name: pending.name,
            email: pending.email,
            password: pending.password,
            department: pending.department,
            role: 'employee'
        });
        await employee.save();
        delete pendingSignups[email];
        // Create token and save cookie
        createTokenAndSaveCookie(employee._id, res);
        res.status(201).json({ user: { employeeId: employee.employeeId, name: employee.name, role: employee.role } });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.post('/login', async (req, res) => {
    const { email, employeeId, password } = req.body;
    if ((!email && !employeeId) || !password) {
        return res.status(400).json({ error: 'Email or employeeId and password are required.' });
    }
    try {
        const query = email ? { email } : { employeeId };
        const employee = await Employee.findOne(query);
        if (!employee) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }

        const isMatch = await bcrypt.compare(password, employee.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }

        // Create token and save cookie
        createTokenAndSaveCookie(employee._id, res);

        // Only send plain user info
        res.status(200).json({ user: { employeeId: employee.employeeId, name: employee.name, role: employee.role } });
    } catch (err) {
        res.status(500).json({ error: 'Server error.' });
    }
});

// Get current user info
router.get('/me', secureRoute, (req, res) => {
    res.json({
        employeeId: req.user.employeeId,
        name: req.user.name,
        role: req.user.role,
        department: req.user.department
    });
});

// Logout endpoint
router.post('/logout', (req, res) => {
    res.clearCookie('jwt', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/',
    }); 
    res.json({ message: 'Logged out' });
});

export default router;
