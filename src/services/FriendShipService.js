const FriendShip = require("../models/FriendShip");


const sendFriendRequest = async (requesterId, recipientId) => {
    try {
     
        const existingFriendship = await FriendShip.findOne({
            $or: [
                { requester: requesterId, recipient: recipientId },
                { requester: recipientId, recipient: requesterId }
            ]
        });

        if (existingFriendship) {
            if (existingFriendship.status === "pending") {
                return { status: "ERR", message: "Friend request already sent" };
            }
            if (existingFriendship.status === "accepted") {
                return { status: "ERR", message: "You are already friends" };
            }
        }

      
        const friendship = await FriendShip.create({
            requester: requesterId,
            recipient: recipientId,
            status: "pending"
        });

        return { status: "OK", message: "Friend request sent", data: friendship };
    } catch (error) {
        throw new Error(error.message);
    }
};


  

  async function acceptFriendRequest(requesterId, recipientId) {
    const friendship = await FriendShip.findOneAndUpdate(
      { requester: requesterId, recipient: recipientId, status: "pending" },
      { status: "accepted" },
      { new: true }
    );
    return friendship;
  }

  const cancelFriendRequest = async (requesterId, recipientId) => {
    try {
        const deletedRequest = await FriendShip.findOneAndDelete({
            requester: requesterId,
            recipient: recipientId,
            status: "pending"
        });

        if (!deletedRequest) {
            return { status: "ERR", message: "Không tìm thấy lời mời kết bạn hoặc đã bị hủy" };
        }

        return { status: "OK", message: "Đã hủy lời mời kết bạn" };
    } catch (error) {
        throw new Error(error.message);
    }
};


  
  async function blockUser(userId, blockedUserId) {
    await FriendShip.findOneAndUpdate(
      { requester: userId, recipient: blockedUserId },
      { status: "blocked" },
      { upsert: true } 
    );
  }

  async function getFriends(userId) {
    return await FriendShip.find({
      $or: [{ requester: userId }, { recipient: userId }],
      status: "accepted"
    }).populate("requester recipient");
  }
  
  

  module.exports = {
    sendFriendRequest,
    acceptFriendRequest,
    cancelFriendRequest,
    blockUser,
    getFriends
}