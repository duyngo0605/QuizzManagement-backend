const QuizService = require('../services/QuizService')
const { verifyToken2 } = require('../middleware/authMiddleware')
const createQuiz = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Access token not provided" });
        }
        const userData = verifyToken2(token, 'access');
        req.body.idCreator = userData.id; 

        const response = await QuizService.createQuiz(req.body);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(401).json({ message: e.message });
    }
};



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
            const response = await QuizService.createQuiz(question);
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

const cloneQuiz = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const QuizId = req.params.id
        if (!QuizId)
        {
            return res.status(404).json({
                status: 'ERR',
                message: 'The Quiz is required'
            })
        }

        const response = await QuizService.cloneQuiz(QuizId, token)
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
        const filter = req.query;
        const QuizId = req.params.id;
        const filterType = filter.filterType;
        const response = await QuizService.getQuiz(QuizId, filter,filterType)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: e.message || 'Internal Server Error',
        });
    }
}


const updateQuiz =  async (req, res) => {    
    try {
        const token = req.headers.authorization.split(' ')[1];
        const QuizId = req.params.id
        if (!QuizId)
        {
            return res.status(404).json({
                status: 'ERR',
                message: 'The Quiz is required'
            })
        }

        const data = req.body
        const response = await QuizService.updateQuiz(QuizId, data, token)
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
        const token = req.headers.authorization.split(' ')[1];
        const QuizId = req.params.id
        if (!QuizId)
        {
            return res.status(200).json({
                status: 'ERR',
                message: 'The Quiz is not defined'
            })
        }
        const response = await QuizService.deleteQuiz(QuizId, token)
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
        const token = req.headers.authorization.split(' ')[1];
        const QuizId = req.params.id
        const data = req.body
        const response = await QuizService.addQuestions(QuizId, data, token)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const removeQuestions = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const QuizId = req.params.id
        const data = req.body
        const response = await QuizService.removeQuestions(QuizId, data, token)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getMyQuiz = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Access token not provided" });
        }
        const userData = verifyToken2(token, 'access');
        const userId = userData.id;
        const { name, status, sortField, sortOrder } = req.query;

        
        const filter = {
            idCreator: userId, 
            name: name || null, 
            status: status || null, 
            sortField: sortField || null, 
            sortOrder: sortOrder || 'asc',
        };
    
        const response = await QuizService.getQuiz(null,filter);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: e.message || 'Something went wrong',
        });
    }
};


const getPractice = async (req, res) => {
    try {
        const QuizId = req.params.id
        const response = await QuizService.getPractice(QuizId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: e.message || 'Internal Server Error',
        });
    }
}

const getQuizStats = async (req, res) => {
    try {
        const response = await QuizService.getQuizStats()
        return res.status(200).json(response)
    } catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: e.message || 'Internal Server Error',
        });
    }
}

module.exports = {
    createQuiz,
    cloneQuiz,
    updateQuiz,
    deleteQuiz,
    getQuiz,
    addQuestions,
    removeQuestions,
    createManyQuizzes,
    getMyQuiz,
    getPractice,
    getQuizStats
}