
const mongoose = require('mongoose');

const AnswerSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
    isCorrect: { type: Boolean, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Answer', AnswerSchema);
