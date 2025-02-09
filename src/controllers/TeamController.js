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
        const TeamId = req.params.id;

        const filter = {
            code: req.query.code || null, 
            name: req.query.name || null, 
            sortField: req.query.sortField || 'createdAt',
            sortOrder: req.query.sortOrder || 'desc'
        };

        const myTeam = req.query.myTeam === 'true'; // Kiểm tra tham số myTeam từ query

        const response = await TeamService.getTeam(TeamId, token, filter, myTeam);
        
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e.message || "Something went wrong"
        });
    }
};



const updateTeam =  async (req, res) => {    
    try {
        const token = req.headers.authorization?.split(' ')[1];
        const TeamId = req.params.id
        if (!TeamId)
        {
            return res.status(200).json({
                status: 'ERR',
                message: 'The Team is required'
            })
        }

        const data = req.body
        if (data.kickUser) {
            const response = await TeamService.kickUser(TeamId, data.kickUser, token)
            return res.status(200).json(response)
        }
        if (data.addQuiz) {
            const response = await TeamService.addQuiz(TeamId, data.addQuiz, token)
            return res.status(200).json(response)
        }
        if (data.removeQuiz) {
            const response = await TeamService.removeQuiz(TeamId, data.removeQuiz, token)
            return res.status(200).json(response)
        }
        const response = await TeamService.updateTeam(TeamId, data, token)
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

const leaveTeam = async (req,res) => {
    try {
        const TeamId = req.params.id
        const token = req.headers.authorization?.split(' ')[1];
        if (!TeamId)
        {
            return res.status(200).json({
                status: 'ERR',
                message: 'The Team is not defined'
            })
        }
        const response = await TeamService.leaveTeam(TeamId, token)
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
    createManyTeams,
    leaveTeam
}