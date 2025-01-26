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

const createManyQuizzes = async (req, res) => {
    try {
        const Quizzes = req.body;
        if (!Array.isArray(Quizzes) || Quizzes.length === 0) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The request body must be a non-empty array of Quizzes',
            });
        }

        const responses = [];
        for (const question of Quizzes) {
            const response = await Quizzeservice.createQuestion(question);
            responses.push(response);
        }

        return res.status(200).json({
            status: 'OK',
            message: 'Quizzes created successfully',
            data: responses,
        });
    } catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: 'Error creating Quizzes',
            error: e.message,
        });
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

const addQuestions = async (req, res) => {
    try {
        const QuizId = req.params.id
        const data = req.body
        const response = await QuizService.addQuizzes(QuizId, data)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const removeQuestions = async (req, res) => {
    try {
        const QuizId = req.params.id
        const data = req.body
        const response = await QuizService.removeQuizzes(QuizId, data)
        return res.status(200).json(response)
    } catch (e) {
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
    addQuestions,
    removeQuestions,
    createManyQuizzes
}