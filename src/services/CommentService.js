const Comment = require('../models/Comment')
const { verifyToken } = require('../middleware/authMiddleware');
const Post = require('../models/Post');
const Quiz = require('../models/Quiz');
const createComment = async (newComment, token) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!token) {
                return reject({
                    status: 'ERR',
                    message: 'Unauthorized'
                });
            }

            const decoded = await verifyToken(token);
            const idUser = decoded.id;

            if (!newComment.post && !newComment.quiz) {
                return reject({
                    status: 'ERR',
                    message: 'Post ID or Quiz ID is required'
                });
            }
          
            if (newComment.parent) {
                const parentComment = await Comment.findById(newComment.parent);
                
                if (!parentComment) {
                    return reject({
                        status: 'ERR',
                        message: 'Parent comment does not exist'
                    });
                }

            
                if (parentComment.parent) {
                    return reject({
                        status: 'ERR',
                        message: 'Only one level of replies is allowed'
                    });
                }
            }

            const createdComment = await Comment.create({
                ...newComment,
                user: idUser,
                parent: newComment.parent || null
            });
            if (newComment.post) {
                await Post.findByIdAndUpdate(newComment.post, {
                    $push: { comments: createdComment._id }
                }).exec();
            } else if (newComment.quiz) {
                await Quiz.findByIdAndUpdate(newComment.quiz, {
                    $push: { comments: createdComment._id }
                }).exec();
            }
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: createdComment
            });

        } catch (e) {
            reject(e);
        }
    });
};





const getComment = async (idPost, idQuiz) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!idPost && !idQuiz) {
                return reject({
                    status: 'ERR',
                    message: 'Post ID or Quiz ID is required'
                });
            }

            let filter = {};
            if (idPost) {
                filter.post = idPost;
            } else {
                filter.quiz = idQuiz;
            }

            let comments = await Comment.find({ ...filter, parent: null })
                .populate('user', 'email')
                .select('-parent');

            for (let comment of comments) {
                comment._doc.replies = await Comment.find({ parent: comment._id })
                    .populate('user', 'email avatar')
                    .select('-post -quiz -parent');
            }

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: comments
            });
        } catch (e) {
            reject(e);
        }
    });
};


const updateComment = async (CommentId, data) => {
    return new Promise(async (resolve, reject) => {

        try {
            const checkComment = await Comment.findOne({
                _id: CommentId
            })
            if (!checkComment){
                reject({
                    status: 'ERR',
                    message: 'The Comment is not defined.'
                })
            }

            const updatedComment = await Comment.findByIdAndUpdate(CommentId, data, {new: true})
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: updatedComment
            })
        }

        catch (e) {
            reject(e)
        }
    })
}

const deleteComment = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkComment = await Comment.findOne({
                _id: id
            })
            if (checkComment === null) {
                reject({
                    status: 'ERR',
                    message: 'The Comment is not defined'
                })
            }
            await Comment.findByIdAndDelete(id)
            resolve({
                status: 'OK',
                message: 'Delete Comment success',
            })
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    createComment,
    getComment,
    updateComment,
    deleteComment,
}