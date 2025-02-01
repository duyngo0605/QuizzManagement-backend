const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    post: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        default: null
    },
    quiz: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
        default: null 
    },
    content: { type: String, required: true },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        default: null 
    },
    date: { type: Date, default: Date.now },
    likes: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        date: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Comment', CommentSchema);
