const Post = require('../models/Post')
const Team = require('../models/Team')
const {verifyToken} = require('../middleware/authMiddleware')

const createPost = async (newPost, token) => {
    return new Promise(async (resolve, reject) => {
        try {
            const decoded = await verifyToken(token)
            const creator = decoded?.id
            const checkTeam = await Team.findOne({
                _id: newPost.team
            })
            if (!checkTeam) {
                reject({
                    status: 'ERR',
                    message: 'The Team is not defined'
                })
            }
            if (checkTeam.members.indexOf(creator) === -1 && checkTeam.idHost != creator) {
                reject({
                    status: 'ERR',
                    message: 'The User is not a member of the Team'
                })
            }
            const createdPost = await Post.create({...newPost, creator})
            if (createdPost)
            { 
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: createdPost
            })
            }
        }

        catch (e) {
            reject(e)
        }
    })
}


const getPost = (id, teamId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let query = {};
            if (id) query._id = id;
            if (teamId) query.team = teamId;

            const posts = await Post.find(query)
                .populate('quiz')
                .populate('creator', 'email avatar') 
                .populate('comments','_id') 
                .select('-likes') 
                .lean(); 

         
            const postData = posts.map(post => ({
                ...post,
                likeCount: post.likes ? post.likes.length : 0, 
    commentCount: post.comments ? post.comments.length : 0
            }));

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: postData
            });
        } catch (e) {
            reject(e);
        }
    });
};

const updatePost = async (PostId, data) => {
    return new Promise(async (resolve, reject) => {

        try {
            const checkPost = await Post.findOne({
                _id: PostId
            })
            if (!checkPost){
                reject({
                    status: 'ERR',
                    message: 'The Post is not defined.'
                })
            }

            const updatedPost = await Post.findByIdAndUpdate(PostId, data, {new: true})
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: updatedPost
            })
        }

        catch (e) {
            reject(e)
        }
    })
}

const deletePost = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkPost = await Post.findOne({
                _id: id
            })
            if (checkPost === null) {
                reject({
                    status: 'ERR',
                    message: 'The Post is not defined'
                })
            }
            await Post.findByIdAndDelete(id)
            resolve({
                status: 'OK',
                message: 'Delete Post success',
            })
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    createPost,
    getPost,
    updatePost,
    deletePost,
}