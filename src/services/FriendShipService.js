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


  


const cancelFriendRequest = async (requesterId, recipientId) => {
  try {
      const deletedRequest = await FriendShip.findOneAndDelete({
          $or: [
              { requester: requesterId, recipient: recipientId, status: "pending" },
              { requester: recipientId, recipient: requesterId, status: "pending" }
          ]
      });

      if (!deletedRequest) {
          return { status: "ERR", message: "Không tìm thấy lời mời kết bạn hoặc đã bị hủy" };
      }

      return { status: "OK", message: "Đã hủy lời mời kết bạn" };
  } catch (error) {
      throw new Error(error.message);
  }
};



const acceptFriendRequest = async (requesterId, recipientId) => {
  try {
      const friendship = await FriendShip.findOneAndUpdate(
          { requester: requesterId, recipient: recipientId, status: "pending" },
          { status: "accepted" },
          { new: true }
      );

      if (!friendship) {
          return { status: "ERR", message: "Không tìm thấy lời mời kết bạn" };
      }

      return { status: "OK", message: "Đã chấp nhận lời mời kết bạn" };
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

  const getFriendRequests = async (userId) => {
    try {
        const requests = await FriendShip.find({ recipient: userId, status: "pending" })
            .populate("requester", "_id email avatar");

        return {
            status: "OK",
            message: "Lấy danh sách lời mời kết bạn thành công",
            data: requests
        };
    } catch (error) {
        throw new Error(error.message);
    }
};

const getListFriend = async (userId) => {
  try {
    console.log(userId);

    
    const requests = await FriendShip.find({
      $or: [{ recipient: userId }, { requester: userId }],
      status: "accepted"
    })
    .populate("requester", "email avatar") 
    .populate("recipient", "email avatar"); 

    
    const friends = requests.map((friendship) => {
      return {
        user: String(friendship.requester._id) === userId 
          ? friendship.recipient 
          : friendship.requester 
      };
    });

    return {
      status: "OK",
      message: "Lấy danh sách bạn bè thành công",
      data: friends
    };
  } catch (error) {
    throw new Error(error.message);
  }
};


  
  

  module.exports = {
    sendFriendRequest,
    acceptFriendRequest,
    cancelFriendRequest,
    blockUser,
    getFriendRequests,
    getListFriend
}