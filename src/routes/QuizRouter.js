const express = require("express")
const router = express.Router()
const QuizController = require('../controllers/QuizController')
const { authMiddleWare, authUserMiddleWare,authenticateAccessToken } = require("../middleware/authMiddleware");
router.get('/get-my-quiz', QuizController.getMyQuiz)
router.post('', QuizController.createQuiz)
router.put('/:id', QuizController.updateQuiz)
router.delete('/:id', QuizController.deleteQuiz)
router.get('/:id?', QuizController.getQuiz)
router.post('/:id/questions', QuizController.addQuestions)
router.delete('/:id/questions', QuizController.removeQuestions)
router.post('/many', QuizController.createManyQuizzes)

module.exports = router