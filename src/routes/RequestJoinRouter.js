const express = require("express")
const router = express.Router()
const RequestJoinController = require('../controllers/RequestJoinController')
const { authMiddleWare, authUserMiddleWare } = require("../middleware/authMiddleware");

router.post('', RequestJoinController.createRequestJoin)
router.put('/:id', RequestJoinController.updateRequestJoin)
router.delete('/:id?', RequestJoinController.deleteRequestJoin)
router.get('/:id?', RequestJoinController.getRequestJoin)
router.post('/many', RequestJoinController.createManyRequestJoins)

module.exports = router