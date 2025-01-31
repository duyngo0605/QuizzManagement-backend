const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema({
  user1: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  user2: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  lastMessage: {
    messageId: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: String },
    sentAt: { type: Date }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Conversation", ConversationSchema);
