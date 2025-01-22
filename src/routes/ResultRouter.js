const express = require("express")
const router = express.Router()
const AnswerController = require('../controllers/AnswerController')
const { authMiddleWare, authUserMiddleWare } = require("../middleware/authMiddleware");

router.post('', AnswerController.createAnswer)
router.put('/:id', AnswerController.updateAnswer)
router.delete('/:id', AnswerController.deleteAnswer)
router.get('/:id?', AnswerController.getAnswer)

module.exports = router