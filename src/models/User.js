
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    idUser: { type: String, required: true, unique: true },
    userName: { type: String, required: true, unique: true },
    hashPass: { type: String, required: true },
    role: {type: String, enum: ['admin','customer'], default: 'customer'},
    avatar: {type: String},
    email: {type: String},
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
