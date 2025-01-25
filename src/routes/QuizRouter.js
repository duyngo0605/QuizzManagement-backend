const express = require("express")
const router = express.Router()
const QuizController = require('../controllers/QuizController')
const { authMiddleWare, authUserMiddleWare } = require("../middleware/authMiddleware");

router.post('', QuizController.createQuiz)
router.put('/:id', QuizController.updateQuiz)
router.delete('/:id', QuizController.deleteQuiz)
router.get('/:id?', QuizController.getQuiz)

module.exports = router