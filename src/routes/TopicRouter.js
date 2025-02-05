const express = require("express")
const router = express.Router()
const TopicController = require('../controllers/TopicController')
const { authMiddleWare, authUserMiddleWare } = require("../middleware/authMiddleware");

router.post('', authMiddleWare, TopicController.createTopic)
router.put('/:id', authMiddleWare, TopicController.updateTopic)
router.delete('/:id', authMiddleWare, TopicController.deleteTopic)
router.get('/:id?', TopicController.getTopic)
router.post('/many', TopicController.createManyTopics)
router.get('/stats/:id', TopicController.getTopicStats)

module.exports = router