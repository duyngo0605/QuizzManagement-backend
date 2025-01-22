const CommentService = require('../services/CommentService')

const createComment =  async (req, res) => {

    try {
        const response = await CommentService.createComment(req.body)
        return res.status(200).json(response)
    }
    catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}


const getComment = async (req, res) => {
    try {
        const CommentId = req.params.id
        const response = await CommentService.getComment(CommentId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}


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
}