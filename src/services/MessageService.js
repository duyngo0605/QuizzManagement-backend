const FriendShip = require("../models/FriendShip");
const Message = require("../models/Message");


async function sendMessage(senderId, receiverId, content) {
   
    const friendship = await FriendShip.findOne({
      $or: [
        { requester: senderId, recipient: receiverId, status: "accepted" },
        { requester: receiverId, recipient: senderId, status: "accepted" }
      ]
    });
  
    if (!friendship) throw new Error("Không thể gửi tin nhắn. Hai người chưa kết bạn.");
  

    const message = await Message.create({ senderId, receiverId, content });
    return message;
  }
  
  module.exports = {
    sendMessage
  }