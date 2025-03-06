const Review = require('../models/ReviewModel');

// Create a review
exports.createReview = async (req, res) => {
    try {
        const { rating, title, text, book_id } = req.body;

        // If user is not logged in
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "User not found" });
        }

        const newReview = new Review({
            rating,
            title,
            text,
            book_id,
            user: req.user._id  // Get user-ID from token
        });

        await newReview.save();
        res.status(201).json(newReview);
    } catch (err) {
        console.log("Error creating review:", err);
        res.status(500).json({ message: "Something went wrong", error: err.message });
    }
};


// Get all reviews
exports.getReviews = async (req, res) => {
    try {
        const { book_id } = req.query;

        // If book_id is provided, filter reviews by book_id
        const query = book_id ? { book_id } : {};
        
        const reviews = await Review.find(query)
            .populate("user", "username firstname lastname") // Get user details
            .sort({ created_at: -1 });

        res.json(reviews);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get one review by id
exports.getReviewById = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id)
            .populate("user", "username firstname lastname");

        if (!review) {
            return res.status(404).json({ message: "Review not found!" });
        }

        res.json(review);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateReview = async (req, res) => {
    try {
        const { rating, title, text } = req.body;
        
        let review = await Review.findById(req.params.id);
        
        if (!review) {
            return res.status(404).json({ message: "Review not found!" });
        }

        // Convert both review.user and req.user._id to string before comparing
        if (review.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to update this review!" });
        }

        // Uppdate fields
        review.rating = rating ?? review.rating;
        review.title = title ?? review.title;
        review.text = text ?? review.text;
        review.updated_at = Date.now();

        await review.save();
        res.json({ message: "Review updated successfully!", review });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};



// Delete a review (only the creator can delete)
exports.deleteReview = async (req, res) => {
    try {
        let review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ message: "Review not found!" });
        }

        // Controll user
        if (review.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to delete this review!" });
        }        

        await review.deleteOne();
        res.json({ message: "Review deleted successfully!" });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
