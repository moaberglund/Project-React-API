const Like = require('../models/LikeModel');
const Review = require('../models/ReviewModel');

exports.likeReview = async (req, res) => {
    try {
        const reviewId = req.params.id;
        const userId = req.user._id;

        // Controll if user already liked the review
        const existingLike = await Like.findOne({ user: userId, review: reviewId });

        if (existingLike) {
            return res.status(400).json({ message: "You already liked this review!" });
        }

        // Create new like
        const newLike = new Like({ user: userId, review: reviewId });

        await newLike.save();

        // Update review to increase the number of likes
        const review = await Review.findById(reviewId);
        review.likes = (review.likes || 0) + 1; 
        await review.save();

        res.status(201).json({ message: "Review liked successfully!", like: newLike });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


exports.unlikeReview = async (req, res) => {
    try {
        const reviewId = req.params.id;
        const userId = req.user._id;

        // Find and delete like
        const like = await Like.findOneAndDelete({ user: userId, review: reviewId });

        if (!like) {
            return res.status(404).json({ message: "Like not found!" });
        }

        // Update review to decrease the number of likes
        const review = await Review.findById(reviewId);
        review.likes = (review.likes || 0) - 1;
        await review.save();

        res.json({ message: "Like removed successfully!" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
