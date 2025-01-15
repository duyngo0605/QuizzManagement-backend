
const mongoose = require('mongoose');

const TopicSchema = new mongoose.Schema({
    idTopic: { type: String, required: true, unique: true },
    name: { type: String, required: true, unique: true },
}, { timestamps: true });

module.exports = mongoose.model('Topic', TopicSchema);
