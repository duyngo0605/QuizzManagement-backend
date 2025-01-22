const express = require("express")
const router = express.Router()
const PostController = require('../controllers/PostController')
const { authMiddleWare, authUserMiddleWare } = require("../middleware/authMiddleware");

router.post('', PostController.createPost)
router.put('/:id', PostController.updatePost)
router.delete('/:id', PostController.deletePost)
router.get('/:id?', PostController.getPost)

module.exports = router