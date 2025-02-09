const CommentService = require('../services/CommentService')

const createComment =  async (req, res) => {

    try {
        const token = req.headers.authorization?.split(' ')[1];
    
        
        const response = await CommentService.createComment(req.body,token)
        return res.status(200).json(response)
    }
    catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const createManyComments = async (req, res) => {
    try {
        const Comments = req.body;
        if (!Array.isArray(Comments) || Comments.length === 0) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The request body must be a non-empty array of Comments',
            });
        }

        const responses = [];
        for (const question of Comments) {
            const response = await Commentservice.createQuestion(question);
            responses.push(response);
        }

        return res.status(200).json({
            status: 'OK',
            message: 'Comments created successfully',
            data: responses,
        });
    } catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: 'Error creating Comments',
            error: e.message,
        });
    }
};


const getComment = async (req, res) => {
    try {
        const { idPost, idQuiz, sortType } = req.query; 

        if (!idPost && !idQuiz) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Post ID or Quiz ID is required'
            });
        }

        const response = await CommentService.getComment(idPost, idQuiz, sortType || 'newest');
        return res.status(200).json(response);
    } catch (e) {
        return res.status(400).json({
            status: 'ERR',
            message: e.message || 'Something went wrong'
        });
    }
};



const updateComment =  async (req, res) => {    
    try {
        const CommentId = req.params.id
        if (!CommentId)
        {
            return res.status(200).json({
                status: 'ERR',
                message: 'The Comment is required'
            })
        }

        const data = req.body
        const response = await CommentService.updateComment(CommentId, data)
        return res.status(200).json(response)
    }

    catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const deleteComment = async (req,res) => {
    try {
        const CommentId = req.params.id
        if (!CommentId)
        {
            return res.status(200).json({
                status: 'ERR',
                message: 'The Comment is not defined'
            })
        }
        const response = await CommentService.deleteComment(CommentId)
        return res.status(200).json(response)
    }

    catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

module.exports = {
    createComment,
    updateComment,
    deleteComment,
    getComment,
    createManyComments
}