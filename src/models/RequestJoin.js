
const mongoose = require('mongoose');

const RequestJoinSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    idTeam: { type: mongoose.Schema.Types.ObjectId, ref: 'Team'},
    idUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    status: { Type: String,
        enum: ['pending, rejected, accepted']
    }
}, { timestamps: true });

module.exports = mongoose.model('RequestJoin', RequestJoinSchema);
