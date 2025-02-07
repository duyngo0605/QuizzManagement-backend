const express = require("express")
const router = express.Router()
const FriendController = require('../controllers/FriendController')

router.post('', FriendController.addFriend)
router.post("/cancel", FriendController.cancelFriendRequest);
router.post("/accept", FriendController.acceptFriendRequest);
router.get("/request", FriendController.getFriendRequests);
router.get("/friends", FriendController.getListFriend);
module.exports = router