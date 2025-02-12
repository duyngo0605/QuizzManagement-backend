const ResultService = require('../services/ResultService')

const createResult =  async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        if (token === null) {
            return res.status(404).json({
                message: 'The token is not defined'
            })
        }
        const response = await ResultService.createResult(req.body, token)
        return res.status(200).json(response)
    }
    catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const createManyResults = async (req, res) => {
    try {
        const Results = req.body;
        if (!Array.isArray(Results) || Results.length === 0) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The request body must be a non-empty array of Results',
            });
        }

        const responses = [];
        for (const question of Results) {
            const response = await Resultservice.createQuestion(question);
            responses.push(response);
        }

        return res.status(200).json({
            status: 'OK',
            message: 'Results created successfully',
            data: responses,
        });
    } catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: 'Error creating Results',
            error: e.message,
        });
    }
};


const getResult = async (req, res) => {
    try {
        const ResultId = req.params.id;
        const token = req.headers.authorization?.split(' ')[1];
        const { quizName, sortBy, sortOrder,idParticipant, idQuiz } = req.query; 

        const response = await ResultService.getResult(idParticipant,ResultId, token, quizName, sortBy, sortOrder, idQuiz);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: e.message || 'Internal Server Error'
        });
    }
};


const getLeadBoard = async (req, res) => {
    try {
        const { idQuiz } = req.body;
        const authHeader = req.headers.authorization;
        const token = authHeader ? authHeader.split(' ')[1] : null; 

        const response = await ResultService.getLeadBoard(idQuiz, token); 
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e.message || 'Something went wrong'
        });
    }
};



const updateResult =  async (req, res) => {    
    try {
        const ResultId = req.params.id
        if (!ResultId)
        {
            return res.status(200).json({
                status: 'ERR',
                message: 'The Result is required'
            })
        }

        const data = req.body
        const response = await ResultService.updateResult(ResultId, data)
        return res.status(200).json(response)
    }

    catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const deleteResult = async (req,res) => {
    try {
        const ResultId = req.params.id
        if (!ResultId)
        {
            return res.status(200).json({
                status: 'ERR',
                message: 'The Result is not defined'
            })
        }
        const response = await ResultService.deleteResult(ResultId)
        return res.status(200).json(response)
    }

    catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

module.exports = {
    createResult,
    updateResult,
    deleteResult,
    getResult,
    createManyResults,
    getLeadBoard
}