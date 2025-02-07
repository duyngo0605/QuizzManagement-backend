const express = require("express")
const router = express.Router()
const { authMiddleWare, authUserMiddleWare } = require("../middleware/authMiddleware");
const ConversationService=require('../services/ConversationService')

router.get('/', ConversationService.getListConversation)


module.exports = router