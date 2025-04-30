// Setting up registration API

const express = require("express");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const router = express.Router();
// Register API
router.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = new User( {username, email, password });
        await user.save();

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.status(201).json({ message: "User registered successfully", token});
    }   
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Login API
router.post("/login", async (req, res) => {
    try{
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message : "Invalid credebtials" });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ message: "Login successful", token });
    }
    catch (error){
        res.status(400).json({ error: error.message });
    }
});

// Forget Password Endpoint
router.post("/forget-password", async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) 
            return res.status(404).json({ message: "No account with that email found"});
        const token = crypto.randomBytes(20).toString("hex");
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000;
        await user.save();

        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const resetURL = `${process.env.CLIENT_URL}/reset-password/${token}`;
        const mailOptions = {
            to: user.email,
            from: process.env.EMAIL_USER,
            subject: "Password Reset Request",
            text:   `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
                    `Please click on the following link, or paste it into your browser to complete the process:\n\n` +
                    `${resetURL}\n\n` +
                    `If you did not request this, please ignore this email.\n`,
        };

        transporter.sendMail(mailOptions, (err) => {
            if (err){
                return res.status(500).json({ message: "Error sending email" });
            }
            res.json({ message: "Password reset email sent" });
        });
    }
    catch(error){
        res.status(500).json({ message: error.message });
    }
});

// Reset password endpoint
router.post("/reset-password/:token", async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try{
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });
        if (!user) {
        return res.status(400)
            .json({ message: "Password rest token is invalid or has expired."});
        }
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        res.json({ message: "Password has been successfully reset!"});
    }
    catch (err){
        res.status(500).json({ message:  error.message });
    }
});

module.exports = router;