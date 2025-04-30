const express = require("express")
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/users", authMiddleware, async (req, res) => {
    if(!req.user.isAdmin) {
        return res.status(403).json({message: "Access denied" });
    }
    try {
        const users = await User.find({});
        res.json(users);
    }
    catch (error){
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;