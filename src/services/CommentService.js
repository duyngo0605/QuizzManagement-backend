const Comment = require('../models/Comment')

const createComment = async (newComment) => {
    return new Promise(async (resolve, reject) => {
        try {
            const createdComment = await Comment.create(newComment)
            if (createdComment)
            { 
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: createdComment
            })
            }
        }

        catch (e) {
            reject(e)
        }
    })
}


const getComment = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                const allComment = await Comment.find()
                resolve({
                    status: 'OK',
                    message: 'Success',
                    data: allComment
                })
            }
            else {
                const comment = await Comment.findOne({
                    _id: id
                })
                if (comment === null) {
                    reject({
                        status: 'ERR',
                        message: 'The Comment is not defined'
                    })
                }
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: comment
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

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