const Post = require('../models/Post')

const createPost = async (newPost) => {
    return new Promise(async (resolve, reject) => {
        try {
            const createdPost = await Post.create(newPost)
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


const getPost = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                const allPost = await Post.find()
                resolve({
                    status: 'OK',
                    message: 'Success',
                    data: allPost
                })
            }
            else {
                const Post = await Post.findOne({
                    _id: id
                })
                if (Post === null) {
                    resolve({
                        status: 'ERR',
                        message: 'The Post is not defined'
                    })
                }
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: Post
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

const updatePost = async (PostId, data) => {
    return new Promise(async (resolve, reject) => {

        try {
            const checkPost = await Post.findOne({
                _id: PostId
            })
            if (!checkPost){
                resolve({
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
                resolve({
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