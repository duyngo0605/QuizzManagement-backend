const PostService = require('../services/PostService')

const createPost =  async (req, res) => {

    try {
        const response = await PostService.createPost(req.body)
        return res.status(200).json(response)
    }
    catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}


const getPost = async (req, res) => {
    try {
        const PostId = req.params.id
        const response = await PostService.getPost(PostId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}


const updatePost =  async (req, res) => {    
    try {
        const PostId = req.params.id
        if (!PostId)
        {
            return res.status(200).json({
                status: 'ERR',
                message: 'The Post is required'
            })
        }

        const data = req.body
        const response = await PostService.updatePost(PostId, data)
        return res.status(200).json(response)
    }

    catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const deletePost = async (req,res) => {
    try {
        const PostId = req.params.id
        if (!PostId)
        {
            return res.status(200).json({
                status: 'ERR',
                message: 'The Post is not defined'
            })
        }
        const response = await PostService.deletePost(PostId)
        return res.status(200).json(response)
    }

    catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

module.exports = {
    createPost,
    updatePost,
    deletePost,
    getPost,
}