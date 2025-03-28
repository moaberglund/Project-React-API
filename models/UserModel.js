const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User Schema
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        min: 5,
        max: 50,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        min: 8,
        max: 20
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        match: [/.+\@.+\..+/, "Please fill a valid email address"]
    },
    firstname: {
        type: String,
    },
    lastname: {
        type: String,
    },
    birthday: {
        type: Date
    },
    country: {
        type: String
    },
    city: {
        type: String
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

// Hash the password before saving the user
// .pre("save") is a middleware that runs before the save() method
UserSchema.pre("save", async function (next) {
    try {
        if (this.isNew || this.isModified("password")) {
            const hashedPassword = await bcrypt.hash(this.password, 10);
            this.password = hashedPassword;
        }
        next(); // continue
    } catch (err) {
        next(err);
    }
});

// Compare the password
UserSchema.methods.comparePassword = async function (password) {
    try {
        return await bcrypt.compare(password, this.password);
    } catch (err) {
        throw err;
    }
};


// Export the model
module.exports = mongoose.model('User', UserSchema);