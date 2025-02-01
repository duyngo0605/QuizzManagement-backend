const FriendShip = require("../models/FriendShip");

async function sendFriendRequest(requesterId, recipientId) {
    const friendship = await FriendShip.create({
      requester: requesterId,
      recipient: recipientId,
      status: "pending"
    });
    return friendship;
  }
  

  async function acceptFriendRequest(requesterId, recipientId) {
    const friendship = await FriendShip.findOneAndUpdate(
      { requester: requesterId, recipient: recipientId, status: "pending" },
      { status: "accepted" },
      { new: true }
    );
    return friendship;
  }

  async function cancelFriendRequest(requesterId, recipientId) {
    await FriendShip.findOneAndDelete({ requester: requesterId, recipient: recipientId, status: "pending" });
  }

  
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