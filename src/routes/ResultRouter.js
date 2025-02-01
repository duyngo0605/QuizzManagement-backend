const express = require("express")
const router = express.Router()
const ResultController = require('../controllers/ResultController')
const { authMiddleWare, authUserMiddleWare } = require("../middleware/authMiddleware");

router.post('', ResultController.createResult)
router.put('/:id', ResultController.updateResult)
router.delete('/:id', ResultController.deleteResult)
router.get('/:id?', ResultController.getResult)
router.post('/many', ResultController.createManyResults)
router.post('/leadboard', ResultController.getLeadBoard)

module.exports = router