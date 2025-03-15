const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require("../models/User");
const nodemailer = require('nodemailer');
const crypto = require('crypto');
require('dotenv').config();

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Send verification email
const sendVerificationEmail = async (email, token) => {
    const link = `${process.env.BASE_URL}/auth/verify-email/${token}`;
    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: "dieh90126@gmail.com",
            subject: 'Email Verification',
            html: `<p>Click <a href="${link}">here</a> to verify your email.</p>`
        });

        console.log("Email sent:", info.response);
    } catch (error) {
        console.error("Email sending failed:", error);
    }
};

// User Signup
const signup = async (req, res) => {
    try {
        const { firstName, lastName, email, password, role } = req.body;
        const user = await UserModel.findOne({ email });
        if (user) return res.status(409).json({ message: 'User already exists', success: false });

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = crypto.randomBytes(32).toString('hex');

        const newUser = new UserModel({ firstName, lastName, email, password: hashedPassword, role, verificationToken });
        await newUser.save();
        await sendVerificationEmail(email, verificationToken);
        console.log(await sendVerificationEmail(email, verificationToken));

        res.status(201).json({ message: "Signup successful, please verify your email", success: true });
    } catch (err) {
        console.error("Signup Error:", err);
        res.status(500).json({ message: "Internal server error", success: false });
    }
};

// Verify Email
const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;
        const user = await UserModel.findOne({ verificationToken: token });

        if (!user) return res.status(400).json({ message: "Invalid or expired token", success: false });

        user.isVerified = true;
        user.verificationToken = null;
        await user.save();

        res.status(200).json({ message: "Email verified successfully", success: true });
    } catch (err) {
        console.error("Email Verification Error:", err);
        res.status(500).json({ message: "Internal server error", success: false });
    }
};

// User Login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(403).json({ message: "Invalid credentials", success: false });
        }

        if (user.role !== "admin") {
            return res.status(403).json({ message: "Only admins can log in", success: false });
        }

        if (!(await bcrypt.compare(password, user.password))) {
            return res.status(403).json({ message: "Invalid credentials", success: false });
        }

        if (!user.isVerified) {
            return res.status(403).json({ message: "Please verify your email first", success: false });
        }

        const jwtToken = jwt.sign(
            { email: user.email, _id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            message: "Admin login successful",
            success: true,
            jwtToken,
            email,
            firstName: user.firstName,
            role: user.role
        });

    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ message: "Internal server error", success: false });
    }
};


module.exports = { signup, login, verifyEmail };
