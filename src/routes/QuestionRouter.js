const express = require("express")
const router = express.Router()
const QuestionController = require('../controllers/QuestionController')
const { authMiddleWare, authUserMiddleWare } = require("../middleware/authMiddleware");


router.post('/many', QuestionController.createManyQuestions)
router.get('/get-my-question', QuestionController.getMyQuestion)
router.post('', QuestionController.createQuestion)
router.put('/:id', QuestionController.updateQuestion)
router.delete('/:id', QuestionController.deleteQuestion)
router.get('/:id?', QuestionController.getQuestion)


module.exports = router