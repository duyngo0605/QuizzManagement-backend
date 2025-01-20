
const mongoose = require('mongoose');

const ResultSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    idParticipant: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    answers: [{type: mongoose.Schema.Types.ObjectId, ref: 'Answer'}],
    score: { type: Number, required: true },
    completeTime: { type: Date, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Result', ResultSchema);
