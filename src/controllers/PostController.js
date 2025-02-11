const PostService = require('../services/PostService')

const createPost =  async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        const response = await PostService.createPost(req.body, token)
        return res.status(200).json(response)
    }
    catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const createManyPosts = async (req, res) => {
    try {
        const Posts = req.body;
        if (!Array.isArray(Posts) || Posts.length === 0) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The request body must be a non-empty array of Posts',
            });
        }

        const responses = [];
        for (const question of Posts) {
            const response = await Postservice.createQuestion(question);
            responses.push(response);
        }

        return res.status(200).json({
            status: 'OK',
            message: 'Posts created successfully',
            data: responses,
        });
    } catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: 'Error creating Posts',
            error: e.message,
        });
    }
};

const getPost = async (req, res) => {
    try {
        const { id } = req.params;
        const { teamId, sortBy,creator } = req.query; 
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

        const response = await PostService.getPost(id, teamId,creator, token, sortBy); 
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e.message || 'Error fetching posts'
        });
    }
};





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

const toggleLikePost = async (req, res) => {
    try {
        const { id } = req.params;
        const token = req.headers.authorization.split(' ')[1];
        const response = await PostService.toggleLikePost(id, token);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(400).json({
            status: 'ERR',
            message: e.message || 'Error toggling like on post'
        });
    }
};

module.exports = {
    createPost,
    updatePost,
    deletePost,
    getPost,
    createManyPosts,
    toggleLikePost 
};