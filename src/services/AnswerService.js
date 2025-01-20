const Answer = require('../models/Answer')

const createAnswer = async (newAnswer) => {
    return new Promise(async (resolve, reject) => {
        try {
            const createdAnswer = await Answer.create(newAnswer)
            if (createdAnswer)
            { 
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: createdAnswer
            })
            }
        }

        catch (e) {
            reject(e)
        }
    })
}


const getAnswer = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                const allAnswer = await Answer.find()
                resolve({
                    status: 'OK',
                    message: 'Success',
                    data: allAnswer
                })
            }
            else {
                const Answer = await Answer.findOne({
                    _id: id
                })
                if (Answer === null) {
                    resolve({
                        status: 'ERR',
                        message: 'The Answer is not defined'
                    })
                }
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: Answer
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

const updateAnswer = async (AnswerId, data) => {
    return new Promise(async (resolve, reject) => {

        try {
            const checkAnswer = await Answer.findOne({
                _id: AnswerId
            })
            if (!checkAnswer){
                resolve({
                    status: 'ERR',
                    message: 'The Answer is not defined.'
                })
            }

            const updatedAnswer = await Answer.findByIdAndUpdate(AnswerId, data, {new: true})
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: updatedAnswer
            })
        }

        catch (e) {
            reject(e)
        }
    })
}

const deleteAnswer = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkAnswer = await Answer.findOne({
                _id: id
            })
            if (checkAnswer === null) {
                resolve({
                    status: 'ERR',
                    message: 'The Answer is not defined'
                })
            }
            await Answer.findByIdAndDelete(id)
            resolve({
                status: 'OK',
                message: 'Delete Answer success',
            })
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    createAnswer,
    getAnswer,
    updateAnswer,
    deleteAnswer,
}