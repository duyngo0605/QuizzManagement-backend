const express = require("express")
const router = express.Router()
const CommentController = require('../controllers/CommentController')
const { authMiddleWare, authUserMiddleWare } = require("../middleware/authMiddleware");

router.post('', CommentController.createComment)
router.put('/:id', CommentController.updateComment)
router.delete('/:id', CommentController.deleteComment)
router.get('/:id?', CommentController.getComment)

module.exports = router