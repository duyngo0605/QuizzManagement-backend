const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    content: { type: String, required: true },
    image: { type: String },
    team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true},
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz'},
    creator : {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    likes: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        date: { type: Date, default: Date.now }}
    ],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Comment'}
    ],
}, { timestamps: true });

module.exports = mongoose.model('Post', PostSchema);
