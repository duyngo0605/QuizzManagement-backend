
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {type: String, enum: ['admin','customer'], default: 'customer'},
    avatar: {type: String},
    email: {type: String},
    library: {
        questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
        quizzes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' }]
    }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
