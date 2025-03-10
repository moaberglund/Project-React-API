const BookShelf = require('../models/BookShelfModel');

// Hämta alla böcker i bokhyllan för en användare
exports.getBooksFromShelf = async (req, res) => {
    try {
        const userId = req.user._id;

        // Hämta böcker från bokhyllan
        const booksInShelf = await BookShelf.find({ user: userId });

        if (booksInShelf.length === 0) {
            return res.status(404).json({ message: "No books found in your bookshelf!" });
        }

        res.json({ books: booksInShelf });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Add a book to the bookshelf
exports.addBookToShelf = async (req, res) => {
    try {
        const { book_id, status } = req.body;
        const userId = req.user._id;

        // Controll if the book is already in the bookshelf
        const existingBook = await BookShelf.findOne({ user: userId, book_id });

        if (existingBook) {
            return res.status(400).json({ message: "This book is already in your bookshelf!" });
        }

        // Add it
        const newBook = new BookShelf({
            user: userId,
            book_id,
            status
        });

        await newBook.save();
        res.status(201).json({ message: "Book added to your bookshelf!", book: newBook });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateBookStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const userId = req.user._id;
        const bookId = req.params.id;  // bookId from URL

        //Find the book in the bookshelf
        const bookInShelf = await BookShelf.findOne({ user: userId, book_id: bookId });

        if (!bookInShelf) {
            console.log("Book not found for user in bookshelf");
            return res.status(404).json({ message: "Book not found in your bookshelf!" });
        }

        // Update status
        bookInShelf.status = status;
        await bookInShelf.save();

        res.json({ message: "Book status updated!", book: bookInShelf });
    } catch (err) {
        console.log("Error in updateBookStatus:", err);
        res.status(500).json({ message: err.message });
    }
};


// Delete a book from the bookshelf
exports.removeBookFromShelf = async (req, res) => {
    try {
        const userId = req.user._id;
        const bookId = req.params.id;  // bookId from URL

        // Find and remove
        const bookInShelf = await BookShelf.findOneAndDelete({ user: userId, book_id: bookId });

        if (!bookInShelf) {
            return res.status(404).json({ message: "Book not found in your bookshelf!" });
        }

        res.json({ message: "Book removed from your bookshelf!" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
