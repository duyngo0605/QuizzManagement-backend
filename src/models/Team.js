
const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    idHost: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true, unique: true },
    maxParticipant: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Team', TeamSchema);
