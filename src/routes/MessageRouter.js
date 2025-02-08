const express = require("express")
const router = express.Router()
const { authMiddleWare, authUserMiddleWare } = require("../middleware/authMiddleware");
const MessageService=require('../services/MessageService')
router.get('/:friendId', MessageService.getMessage)
router.post('/', MessageService.sendMessage)

module.exports = router