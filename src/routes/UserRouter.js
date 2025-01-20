const express = require("express")
const router = express.Router()
const UserController = require('../controllers/UserController')
const { authMiddleWare, authUserMiddleWare } = require("../middleware/authMiddleware");

router.post('', authMiddleWare, UserController.createUser)
router.post('/log-in', UserController.loginUser)
router.post('/log-out', UserController.logoutUser)
router.put('/:id', authUserMiddleWare, UserController.updateUser)
router.delete('/:id', authMiddleWare, UserController.deleteUser)
router.get('/:id?', authMiddleWare, UserController.getUser)
router.post('/refresh-token', UserController.refreshToken)

module.exports = router