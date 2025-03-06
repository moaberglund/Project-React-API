const mongoose = require('mongoose');

const BookShelfSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  
        required: true
    },
    book_id: {
        type: String,  
        required: true
    },
    status: {
        type: String,
        enum: ['want to read', 'currently reading', 'read'],
        default: 'want to read',  // Standard
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('BookShelf', BookShelfSchema);
