
const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    content: { type: String, required: true },
    score: { type: Number, required: true},
    type: { type: String, 
        enum: ['selected-one', 'selected-many', 'constructed', 'fill-in-the-blank', 'drag-and-drop'],
        required: true },
    answers: [{
        content: { type: String, required: true },
        isCorrect: { type: Boolean, required: true },
    }],
    idCreator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Question', QuestionSchema);
