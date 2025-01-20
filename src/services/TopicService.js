const Topic = require('../models/Topic')

const createTopic = async (newTopic) => {
    return new Promise(async (resolve, reject) => {
        try {
            const createdTopic = await Topic.create(newTopic)
            if (createdTopic)
            { 
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: createdTopic
            })
            }
        }

        catch (e) {
            reject(e)
        }
    })
}


const getTopic = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                const allTopic = await Topic.find()
                resolve({
                    status: 'OK',
                    message: 'Success',
                    data: allTopic
                })
            }
            else {
                const Topic = await Topic.findOne({
                    _id: id
                })
                if (Topic === null) {
                    resolve({
                        status: 'ERR',
                        message: 'The Topic is not defined'
                    })
                }
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: Topic
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

const updateTopic = async (TopicId, data) => {
    return new Promise(async (resolve, reject) => {

        try {
            const checkTopic = await Topic.findOne({
                _id: TopicId
            })
            if (!checkTopic){
                resolve({
                    status: 'ERR',
                    message: 'The Topic is not defined.'
                })
            }

            const updatedTopic = await Topic.findByIdAndUpdate(TopicId, data, {new: true})
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: updatedTopic
            })
        }

        catch (e) {
            reject(e)
        }
    })
}

const deleteTopic = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkTopic = await Topic.findOne({
                _id: id
            })
            if (checkTopic === null) {
                resolve({
                    status: 'ERR',
                    message: 'The Topic is not defined'
                })
            }
            await Shift.deleteMany({Topic: id})
            await Topic.findByIdAndDelete(id)
            resolve({
                status: 'OK',
                message: 'Delete Topic success',
            })
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    createTopic,
    getTopic,
    updateTopic,
    deleteTopic,
}