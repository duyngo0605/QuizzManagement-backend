const TeamService = require('../services/TeamService')
const { verifyToken2 } = require('../middleware/authMiddleware')
const createTeam =  async (req, res) => {

    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: "Access token not provided" });
        }

        const userData = verifyToken2(token, 'access');
        req.body.idHost = userData.id;
        const response = await TeamService.createTeam(req.body)
        return res.status(200).json(response)
    }
    catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}



const createManyTeams = async (req, res) => {
    try {
        const Teams = req.body;
        if (!Array.isArray(Teams) || Teams.length === 0) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The request body must be a non-empty array of Teams',
            });
        }

        const responses = [];
        for (const question of Teams) {
            const response = await Teamservice.createQuestion(question);
            responses.push(response);
        }

        return res.status(200).json({
            status: 'OK',
            message: 'Teams created successfully',
            data: responses,
        });
    } catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: 'Error creating Teams',
            error: e.message,
        });
    }
};


const getTeam = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        const TeamId = req.params.id
        const response = await TeamService.getTeam(TeamId, token)
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
    createManyTeams
}