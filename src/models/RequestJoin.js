
const mongoose = require('mongoose');

const RequestJoinSchema = new mongoose.Schema({
    idTeam: { type: mongoose.Schema.Types.ObjectId, ref: 'Team'},
    idUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    status: { type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    }
}, { timestamps: true });

module.exports = mongoose.model('RequestJoin', RequestJoinSchema);
