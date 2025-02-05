const express = require("express")
const router = express.Router()
const FriendController = require('../controllers/FriendController')

router.post('', FriendController.addFriend)
router.post("/cancel", FriendController.cancelFriendRequest);
module.exports = router