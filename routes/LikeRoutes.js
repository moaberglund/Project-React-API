const express = require('express');
const router = express.Router();
const { likeReview, unlikeReview } = require('../controllers/LikeController');
const auth = require('../middleware/auth');

// Routes
router.post('/:id', auth, likeReview);
router.delete('/:id', auth, unlikeReview);

module.exports = router;
