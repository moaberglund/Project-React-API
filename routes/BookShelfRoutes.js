const express = require('express');
const router = express.Router();
const { addBookToShelf, updateBookStatus, removeBookFromShelf } = require('../controllers/BookShelfController');
const auth = require('../middleware/auth');

router.post('/', auth, addBookToShelf);  
router.put('/:id', auth, updateBookStatus); 
router.delete('/:id', auth, removeBookFromShelf); 

module.exports = router;
