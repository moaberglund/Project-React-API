const express = require('express');
const router = express.Router();
const { getBooksFromShelf, addBookToShelf, updateBookStatus, removeBookFromShelf } = require('../controllers/BookShelfController');
const auth = require('../middleware/auth');

router.get('/', auth, getBooksFromShelf);
router.post('/', auth, addBookToShelf);  
router.put('/:book_id', auth, updateBookStatus); 
router.delete('/:book_id', auth, removeBookFromShelf); 

module.exports = router;
