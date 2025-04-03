// Setting up registration API

const express = require("express");
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

module.exports = router;

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