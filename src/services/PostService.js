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

            if (!newPost.content || newPost.content.trim() === '') {
                return reject({
                    status: 'ERR',
                    message: 'Content is required'
                });
            }
            if (!checkTeam) {
                reject({
                    status: 'ERR',
                    message: 'The Team is not defined'
                })
            }
            console.log(creator);
            
            const isMember = checkTeam.members.some(m => m.member.toString() === creator);

            const isHost = checkTeam.idHost.toString() === creator;

            if (!isMember && !isHost) {
                return reject({
                    status: 'ERR',
                    message: 'The User is not a member of the Team'
                });
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


const getPost = (id, teamId, token,sortBy = 'updatedAt') => {
    return new Promise(async (resolve, reject) => {
        try {
            let query = {};
            if (id) query._id = id;
            if (teamId) query.team = teamId;

            let userId = null;
            if (token ) {
                try {
                    const decoded = await verifyToken(token);
                    userId = decoded?.id;
                   
                } catch (error) {
                    return reject({ status: 'ERR', message: 'Invalid token' });
                }
            }
            const sortCriteria = sortBy === 'createdAt' ? { createdAt: -1 } : { updatedAt: -1 };

            const posts = await Post.find(query)
                .populate('quiz')
                .populate('creator', 'email avatar') 
                .populate('comments', '_id') 
                .populate('quiz', '_id image name') 
                .select('likes image content createdAt updatedAt') 
                .lean()
                .sort(sortCriteria);

            const postData = posts.map(post => {
                let postResult = {
                    ...post,
                    likeCount: post.likes ? post.likes.length : 0,
                    commentCount: post.comments ? post.comments.length : 0
                };

                if (userId) {
                    postResult.statusLike = post.likes.some(like => like.user.toString() === userId);
                }

                return postResult;
            });

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


const toggleLikePost = async (postId, token) => {
    return new Promise(async (resolve, reject) => {
        try {
          
            
            const decoded = await verifyToken(token)
            const userId = decoded?.id
            const post = await Post.findById(postId);
            if (!post) {
                return reject({ status: 'ERR', message: 'Post not found' });
            }
            if (!userId) {
                return reject({ status: 'ERR', message: 'User not found' });
            }
          
            const alreadyLikedIndex = post.likes.findIndex(like => like.user.toString() === userId);

            if (alreadyLikedIndex !== -1) {
                
                post.likes.splice(alreadyLikedIndex, 1);
            } else {
              
                post.likes.push({ user: userId });
            }

            await post.save();

            resolve({
                status: 'OK',
                message: alreadyLikedIndex !== -1 ? 'Post unliked successfully' : 'Post liked successfully',
                data: post
            });
        } catch (e) {
            reject(e);
        }
    });
};

module.exports = {
    createPost,
    getPost,
    updatePost,
    deletePost,
    toggleLikePost
};
