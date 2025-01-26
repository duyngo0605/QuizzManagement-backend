const QuestionService = require('../services/QuestionService')

const createQuestion =  async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const response = await QuestionService.createQuestion(req.body, token)
        return res.status(200).json(response)
    }
    catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const createManyQuestions = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const questions = req.body;
        if (!Array.isArray(questions) || questions.length === 0) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The request body must be a non-empty array of questions',
            });
        }

        const responses = [];
        for (const question of questions) {
            const response = await QuestionService.createQuestion(question, token);
            responses.push(response);
        }

        return res.status(200).json({
            status: 'OK',
            message: 'Questions created successfully',
            data: responses,
        });
    } catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: 'Error creating questions',
            error: e.message,
        });
    }
};


const getQuestion = async (req, res) => {
    try {
        const QuestionId = req.params.id
        const response = await QuestionService.getQuestion(QuestionId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}


const updateQuestion =  async (req, res) => {    
    try {
        const token = req.headers.authorization.split(' ')[1];
        const QuestionId = req.params.id
        if (!QuestionId)
        {
            return res.status(200).json({
                status: 'ERR',
                message: 'The Question is required'
            })
        }

        const data = req.body
        const response = await QuestionService.updateQuestion(QuestionId, data, token)
        return res.status(200).json(response)
    }

    catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const deleteQuestion = async (req,res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const QuestionId = req.params.id
        if (!QuestionId)
        {
            return res.status(200).json({
                status: 'ERR',
                message: 'The Question is not defined'
            })
        }
        const response = await QuestionService.deleteQuestion(QuestionId, token)
        return res.status(200).json(response)
    }

    catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

module.exports = {
    createQuestion,
    updateQuestion,
    deleteQuestion,
    getQuestion,
    createManyQuestions,
}