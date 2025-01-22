const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: { type: String, required: true },
    date: { type: Date, default: Date.now },
    likes: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        date: { type: Date, default: Date.now }}
    ],
}, { timestamps: true });   

module.exports = mongoose.model('Comment', CommentSchema);
