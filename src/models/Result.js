
const mongoose = require('mongoose');

const ResultSchema = new mongoose.Schema({
    idParticipant: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
    userAnswers: [{ type: String }],
    score: { type: Number, required: true },
    completeTime: { type: Date, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Result', ResultSchema);
