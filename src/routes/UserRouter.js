const express = require("express")
const router = express.Router()
const UserController = require('../controllers/UserController')
const { authMiddleWare, authUserMiddleWare } = require("../middleware/authMiddleware");

router.post('', UserController.createUser)
router.post('/log-in', UserController.loginUser)
router.post('/log-out', UserController.logoutUser)
router.put('/change-profile',UserController.changeProfile)
router.put('/:id', authUserMiddleWare, UserController.updateUser)
router.delete('/:id', authMiddleWare, UserController.deleteUser)
router.get('/my-profile', UserController.getMyProfile)
router.get('/:id?', UserController.getUser)
router.post('/refresh-token', UserController.refreshToken)
router.post('/many', UserController.createManyUsers)

module.exports = router