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

exports.getReviewsByBook = async (req, res) => {
    try {
        const { bookId } = req.params;  // Hämta bookId från URL

        const reviews = await Review.find({ book_id: bookId })  // Filtrera på book_id
            .populate("user", "username firstname lastname") // Hämta användarinformation
            .sort({ created_at: -1 }); // Sortera senaste först

        res.json(reviews);
    } catch (err) {
        console.error("Error fetching reviews:", err);
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

        // Controll to make sure user is logged in
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "Unauthorized: User not found" });
        }

        // Find review
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ message: "Review not found!" });
        }

        // Controll to make sure user is the creator of the review
        if (review.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to update this review!" });
        }

        // Validate that rating is between 1 and 5
        if (rating !== undefined && (rating < 1 || rating > 5)) {
            return res.status(400).json({ message: "Rating must be between 1 and 5" });
        }

        // Update
        const updatedReview = await Review.findByIdAndUpdate(
            req.params.id,
            {
                rating: rating ?? review.rating,
                title: title ?? review.title,
                text: text ?? review.text,
                updated_at: Date.now()
            },
            { new: true } // Return the updated review
        );

        res.json({ message: "Review updated successfully!", review: updatedReview });

    } catch (err) {
        console.error("Error updating review:", err);
        res.status(500).json({ message: "Something went wrong", error: err.message });
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
