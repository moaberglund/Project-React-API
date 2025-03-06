const mongoose = require('mongoose');

// Review Schema
const ReviewShema = new mongoose.Schema({
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    title: {
        type: String,
        required: true,
        min: 5,
        max: 100
    },
    text: {
        type: String,
        required: true,
        min: 5,
        max: 500
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    book_id: {
        type: String,
        required: true
    },
    likes: {
        type: Number,
        default: 0
    }
},
    { timestamps: true }); //createdAt + updatedAt

const Review = mongoose.model('Review', ReviewShema);
module.exports = Review;