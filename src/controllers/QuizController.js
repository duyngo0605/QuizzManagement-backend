const QuizService = require('../services/QuizService')

const createQuiz =  async (req, res) => {

    try {
        const response = await QuizService.createQuiz(req.body)
        return res.status(200).json(response)
    }
    catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}


const getQuiz = async (req, res) => {
    try {
        const QuizId = req.params.id
        const response = await QuizService.getQuiz(QuizId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}


const updateQuiz =  async (req, res) => {    
    try {
        const QuizId = req.params.id
        if (!QuizId)
        {
            return res.status(200).json({
                status: 'ERR',
                message: 'The Quiz is required'
            })
        }

        const data = req.body
        const response = await QuizService.updateQuiz(QuizId, data)
        return res.status(200).json(response)
    }

    catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const deleteQuiz = async (req,res) => {
    try {
        const QuizId = req.params.id
        if (!QuizId)
        {
            return res.status(200).json({
                status: 'ERR',
                message: 'The Quiz is not defined'
            })
        }
        const response = await QuizService.deleteQuiz(QuizId)
        return res.status(200).json(response)
    }

    catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

module.exports = {
    createQuiz,
    updateQuiz,
    deleteQuiz,
    getQuiz,
}