const express = require('express');
const router = express.Router();
const { getBooksFromShelf, getBookStatusFromShelf, addBookToShelf, updateBookStatus, removeBookFromShelf } = require('../controllers/BookShelfController');
const auth = require('../middleware/auth');

router.get('/', auth, getBooksFromShelf);
router.get('/:book_id', auth, getBookStatusFromShelf);
router.post('/', auth, addBookToShelf);  
router.put('/:book_id', auth, updateBookStatus); 
router.delete('/:book_id', auth, removeBookFromShelf); 

module.exports = router;
