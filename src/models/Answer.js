
const mongoose = require('mongoose');

const AnswerSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
    isCorrect: { type: Boolean, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Answer', AnswerSchema);
