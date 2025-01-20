
const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    content: { type: String, required: true },
    score: { type: Number, required: true},
    type: { type: String, 
        enum: ['selected-one', 'selected-many', 'constructed'],
        required: true },
    topicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic' },
    idCreator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Question', QuestionSchema);
