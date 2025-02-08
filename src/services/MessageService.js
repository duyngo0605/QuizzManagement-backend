const FriendShip = require("../models/FriendShip");
const Message = require("../models/Message");
const Conversation = require("../models/Conversation");
const { verifyToken } = require('../middleware/authMiddleware');

const getMessage = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(400).json({ status: "ERR", message: "Token is required" });
    }

    const decoded = await verifyToken(token);
    const userId = decoded.id; // Người đang đăng nhập
    const { friendId } = req.params; // ID của người bạn muốn xem tin nhắn

    if (!friendId) {
      return res.status(400).json({ status: "ERROR", message: "Thiếu friendId!" });
    }

    // 🔎 Tìm cuộc trò chuyện giữa userId và friendId
    const conversation = await Conversation.findOne({
      $or: [
        { user1: userId, user2: friendId },
        { user1: friendId, user2: userId },
      ],
    });

    if (!conversation) {
      return res.status(404).json({ status: "ERROR", message: "Chưa có cuộc trò chuyện nào giữa hai người!" });
    }

    // 📩 Lấy tin nhắn từ cuộc trò chuyện
    const messages = await Message.find({ conversationId: conversation._id })
      .sort({ sentAt: 1 });

    return res.status(200).json({
      status: "OK",
      message: "Lấy tin nhắn thành công",
      data: messages,
    });
  } catch (error) {
    return res.status(500).json({ status: "ERROR", message: error.message });
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

  const saveMessage = async (conversationId, senderId, content, receiverId) => {
    try {
      let conversation = await Conversation.findById(conversationId);

      console.log(conversation.id);
      
      if (!conversation) {
        conversation = new Conversation({ user1: senderId, user2: receiverId });
        await conversation.save();
      }
      const message = new Message({
        conversationId: conversation._id,
        senderId,
        receiverId,
        content,
      });

      await message.save();

      conversation.lastMessage = {
        messageId: message._id,
        senderId: senderId,
        content: content,
      };
      await conversation.save();

      
      return message;
    } catch (error) {
      return error.message ;
    }
  }


module.exports = {
  sendMessage,
  getMessage,
  saveMessage
}