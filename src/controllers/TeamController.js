const TeamService = require('../services/TeamService')

const createTeam =  async (req, res) => {

    try {
        const response = await TeamService.createTeam(req.body)
        return res.status(200).json(response)
    }
    catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}


const getTeam = async (req, res) => {
    try {
        const TeamId = req.params.id
        const response = await TeamService.getTeam(TeamId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}


const updateTeam =  async (req, res) => {    
    try {
        const TeamId = req.params.id
        if (!TeamId)
        {
            return res.status(200).json({
                status: 'ERR',
                message: 'The Team is required'
            })
        }

        const data = req.body
        const response = await TeamService.updateTeam(TeamId, data)
        return res.status(200).json(response)
    }

    catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const deleteTeam = async (req,res) => {
    try {
        const TeamId = req.params.id
        if (!TeamId)
        {
            return res.status(200).json({
                status: 'ERR',
                message: 'The Team is not defined'
            })
        }
        const response = await TeamService.deleteTeam(TeamId)
        return res.status(200).json(response)
    }

    catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

module.exports = {
    createTeam,
    updateTeam,
    deleteTeam,
    getTeam,
}