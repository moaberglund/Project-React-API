const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Import Review Controller
const { createReview, getReviews, getReviewsByBook, getReviewById, updateReview, deleteReview } = require('../controllers/ReviewController');

// Routes
router.post('/', auth, createReview);
router.get('/', getReviews);
router.get('/book/:bookId', getReviewsByBook);
router.get('/:id', getReviewById);
router.put('/:id', auth, updateReview);
router.delete('/:id', auth, deleteReview);

module.exports = router;