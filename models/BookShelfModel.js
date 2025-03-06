const mongoose = require('mongoose');

const BookShelfSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  
        required: true
    },
    book_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',  
        required: true
    },
    status: {
        type: String,
        enum: ['Want to Read', 'Currently Reading', 'Read'],
        default: 'want to read',  // Standard
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('BookShelf', BookShelfSchema);
