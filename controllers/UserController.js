const User = require('../models/UserModel');
const jwt = require('jsonwebtoken');

// Register a new user
exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists!" });
        }

        // Create a new user
        const user = new User({ username, password });
        await user.save();
        res.status(201).json({ message: "User created successfully!" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Login a user
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if the user exists
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: "Invalid username or password." });
        }

        // Compare password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid username or password." });
        }

        // Create JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "12h" });

        // Convert user to object and remove password
        const userData = user.toObject();
        delete userData.password;

        // Send response with token and user object
        res.json({ token, user: userData });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// Get user profile (protected route)
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select("-password"); // exclude password
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// NEW getuserbyID route (problem with route above)
exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        console.log("Fetching user with ID:", id);

        const user = await User.findById(id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        res.json(user);
    } catch (err) {
        console.error("Error fetching user:", err);
        res.status(500).json({ message: "Server error" });
    }
};


// Update user profile (protected route)
exports.updateProfile = async (req, res) => {
    try {
        const { email, firstname, lastname, city, country } = req.body;

        // Find and update the user
        const updatedUser = await User.findByIdAndUpdate(
            req.user.userId,
            {
                $set: {
                    ...(email && { email }),
                    ...(firstname && { firstname }),
                    ...(lastname && { lastname }),
                    ...(city && { city }),
                    ...(country && { country }),
                }
            },
            {
                new: true, // Return user
                select: '-password' // Exclude password from result
            }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found!" });
        }

        res.json({
            message: "Profile updated successfully",
            user: updatedUser
        });
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: err.message });
        }
        res.status(500).json({ message: err.message });
    }
};

// Delete user account with password verification (protected route)
exports.deleteProfile = async (req, res) => {
    try {
        const { password } = req.body;

        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        // Verify password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid password" });
        }

        await user.deleteOne();

        res.json({
            message: "Account deleted successfully"
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// Validate JWT token
exports.validateToken = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                valid: false,
                message: "Missing token"
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        // Controll user exists
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(401).json({
                valid: false,
                message: "No user found"
            });
        }

        return res.json({
            valid: true,
            user: user,
            message: "Valid token"
        });

    } catch (err) {
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({
                valid: false,
                message: "Not valid token"
            });
        }
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({
                valid: false,
                message: "Token has expired"
            });
        }
        return res.status(500).json({
            valid: false,
            message: "Server error"
        });
    }
};