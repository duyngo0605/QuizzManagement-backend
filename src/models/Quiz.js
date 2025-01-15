
const mongoose = require('mongoose');

const QuizSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true, unique: true },
    description: { type: String },
    topicId: {type: mongoose.Schema.Types.ObjectId, ref: 'Topic'},
    image: {type: String},
    idCreator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, required: true },
    time: { type: Number },
}, { timestamps: true });


module.exports = mongoose.model('Quiz', QuizSchema);
