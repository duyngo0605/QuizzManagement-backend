const mongoose = require('mongoose');

const ResultSchema = new mongoose.Schema({
    idParticipant: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
    userAnswers: [[{}]],
    score: { type: Number, default: 0 },
    completeTime: { type: Number, required: true },
    status: { 
        type: String, 
        enum: ['done', 'pending'], 
        default: 'pending' 
    },
    attempTime: { type: Number, default: 1 }
}, { timestamps: true });

module.exports = mongoose.model('Result', ResultSchema);