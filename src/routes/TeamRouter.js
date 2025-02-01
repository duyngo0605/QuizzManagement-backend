const express = require("express")
const router = express.Router()
const TeamController = require('../controllers/TeamController')
const { authMiddleWare, authUserMiddleWare } = require("../middleware/authMiddleware");

router.post('', TeamController.createTeam)
router.put('/:id', TeamController.updateTeam)
router.delete('/:id', TeamController.deleteTeam)
router.get('/:id?', TeamController.getTeam)
router.post('/many', TeamController.createManyTeams)
router.post('/leave/:id', TeamController.leaveTeam)

module.exports = router