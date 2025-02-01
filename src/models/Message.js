const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  conversationId: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation", required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  type: { type: String, enum: ["text", "image", "video", "file"], default: "text" },
  attachments: [
    {
      url: { type: String },
      type: { type: String, enum: ["image", "video", "file"] }
    }
  ],
  sentAt: { type: Date, default: Date.now },
  status: { type: String, enum: ["sent", "delivered", "seen"], default: "sent" }
});

module.exports = mongoose.model("Message", MessageSchema);
