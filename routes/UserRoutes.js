const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Import User Controller
const { register, login, getUserById, updateProfile, deleteProfile, validateToken } = require('../controllers/UserController');

// Routes
router.post('/register', register);
router.post('/login', login);
router.get('/:id', auth, getUserById);
router.put('/profile', auth, updateProfile);
router.delete('/profile', auth, deleteProfile)
router.get('/validate', auth, validateToken);

module.exports = router;