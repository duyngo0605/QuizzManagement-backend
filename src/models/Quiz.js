
const mongoose = require('mongoose');

const QuizSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String },
    topicId: [{type: mongoose.Schema.Types.ObjectId, ref: 'Topic'}],
    questions: [{type: mongoose.Schema.Types.ObjectId, ref: 'Question'}],
    image: {type: String},
    idCreator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, required: true },
    time: { type: Number },
    comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}],
}, { timestamps: true });


module.exports = mongoose.model('Quiz', QuizSchema);
