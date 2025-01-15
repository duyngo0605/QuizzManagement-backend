
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    idUser: { type: String, required: true, unique: true },
    userName: { type: String, required: true, unique: true },
    hashPass: { type: String, required: true },
    role: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
