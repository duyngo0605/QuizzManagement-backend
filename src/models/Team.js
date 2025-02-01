
const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
    idHost: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    name: { type: String, required: true, unique: true },
    image: { type: String, required: true},
    maxParticipant: { type: Number, required: true },
    code: { type: String, required: true, unique: true },
    members: [{
        member: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        role: {
            type: String,
            enum: ['manager', 'participant'],
            default: 'participant'
        }
    }],
    quizs: [{type: mongoose.Schema.Types.ObjectId, ref: 'Quiz'}]
}, { timestamps: true });

module.exports = mongoose.model('Team', TeamSchema);
