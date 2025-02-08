const { verifyToken } = require('../middleware/authMiddleware')
const Conversation = require("../models/Conversation");
const User = require("../models/User");
const Message = require("../models/Message");
const getListConversation = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(400).json({ status: "ERR", message: "Token is required" });
    }

    const decoded = await verifyToken(token);
    const userId = decoded.id;

    const conversations = await Conversation.find({
      $or: [{ user1: userId }, { user2: userId }]
    })
      .populate("user1", "email avatar")
      .populate("user2", "email avatar")
      .populate("lastMessage.messageId", "content sentAt")
      .populate("lastMessage.senderId", "email")
      .sort({ "lastMessage.sentAt": -1 });

    const formattedConversations = conversations.map((conversation) => {
      const otherUser =
        conversation.user1._id.toString() === userId.toString()
          ? conversation.user2
          : conversation.user1;

      return {
        conversationId: conversation._id.toString(),
        user: {
          id: otherUser._id.toString(),
          email: otherUser.email,
          avatar: otherUser.avatar || ""
        },
        lastMessage: conversation.lastMessage?.content || "",
        createdAt: conversation.createdAt.toISOString()
      };
    });

    return res.status(200).json({
      status: "OK",
      message: "Lấy danh sách cuộc trò chuyện thành công",
      data: formattedConversations
    });
  } catch (error) {
    return res.status(500).json({
      status: "ERROR",
      message: error.message
    });
  }
};






const sendMessage = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(400).json({ status: "ERR", message: "Token is required" });
    }

    const decoded = await verifyToken(token);
    const senderId = decoded.id;
    const { receiverId, content, type, attachments } = req.body;

    if (!receiverId || !content) {
      return res.status(400).json({ status: "ERROR", message: "Thiếu thông tin!" });
    }

    let conversation = await Conversation.findOne({
      $or: [
        { user1: senderId, user2: receiverId },
        { user1: receiverId, user2: senderId }
      ]
    });

    if (!conversation) {
      conversation = new Conversation({ user1: senderId, user2: receiverId });
      await conversation.save();
    }
    const message = new Message({
      conversationId: conversation._id,
      senderId,
      receiverId,
      content,
      type,
      attachments
    });

    await message.save();

  
    conversation.lastMessage = {
      messageId: message._id,
      senderId: senderId,
      content: content,
    };
    await conversation.save();

    
    return res.status(201).json({
      status: "OK",
      message: "Gửi tin nhắn thành công",
      data: message
    });
  } catch (error) {
    return res.status(500).json({ status: "ERROR", message: error.message });
  }
};


module.exports = { getListConversation,sendMessage };
