const QuestionService = require('../services/QuestionService')

const createQuestion =  async (req, res) => {

    try {
        const response = await QuestionService.createQuestion(req.body)
        return res.status(200).json(response)
    }
    catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}


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
        const QuestionId = req.params.id
        if (!QuestionId)
        {
            return res.status(200).json({
                status: 'ERR',
                message: 'The Question is required'
            })
        }

        const data = req.body
        const response = await QuestionService.updateQuestion(QuestionId, data)
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
        const QuestionId = req.params.id
        if (!QuestionId)
        {
            return res.status(200).json({
                status: 'ERR',
                message: 'The Question is not defined'
            })
        }
        const response = await QuestionService.deleteQuestion(QuestionId)
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
}