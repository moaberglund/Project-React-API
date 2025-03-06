const jwt = require('jsonwebtoken');
const User = require('../models/UserModel'); 

module.exports = async (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) {
        return res.status(401).json({ message: "Access denied!" });
    }

    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET_KEY);

        req.user = decoded; // Add decoded data in request objectet

        // Fetch User from database based on decoded userId
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        req.user = user;  // Add full User in request object

        next(); // Continue to next middleware

    } catch (err) {
        console.log("Error decoding token:", err);
        res.status(401).json({ message: "Invalid token" });
    }
};
