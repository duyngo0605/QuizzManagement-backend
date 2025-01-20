
const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    idHost: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true, unique: true },
    image: { type: String, required: true},
    maxParticipant: { type: Number, required: true },
    members: [{
        member: { Type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        role: {
            Type: String,
            enum: ['manager', 'participant']
        }
    }],
    quizs: [{Type: mongoose.Schema.Types.ObjectId, ref: 'Quiz'}]
}, { timestamps: true });

module.exports = mongoose.model('Team', TeamSchema);
