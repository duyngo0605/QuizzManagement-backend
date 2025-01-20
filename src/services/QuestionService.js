const Question = require('../models/Question')

const createQuestion = async (newQuestion) => {
    return new Promise(async (resolve, reject) => {
        try {
            const createdQuestion = await Question.create(newQuestion)
            if (createdQuestion)
            { 
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: createdQuestion
            })
            }
        }

        catch (e) {
            reject(e)
        }
    })
}


const getQuestion = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                const allQuestion = await Question.find()
                resolve({
                    status: 'OK',
                    message: 'Success',
                    data: allQuestion
                })
            }
            else {
                const Question = await Question.findOne({
                    _id: id
                })
                if (Question === null) {
                    resolve({
                        status: 'ERR',
                        message: 'The Question is not defined'
                    })
                }
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: Question
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

const updateQuestion = async (QuestionId, data) => {
    return new Promise(async (resolve, reject) => {

        try {
            const checkQuestion = await Question.findOne({
                _id: QuestionId
            })
            if (!checkQuestion){
                resolve({
                    status: 'ERR',
                    message: 'The Question is not defined.'
                })
            }

            const updatedQuestion = await Question.findByIdAndUpdate(QuestionId, data, {new: true})
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: updatedQuestion
            })
        }

        catch (e) {
            reject(e)
        }
    })
}

const deleteQuestion = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkQuestion = await Question.findOne({
                _id: id
            })
            if (checkQuestion === null) {
                resolve({
                    status: 'ERR',
                    message: 'The Question is not defined'
                })
            }
            await Shift.deleteMany({Question: id})
            await Question.findByIdAndDelete(id)
            resolve({
                status: 'OK',
                message: 'Delete Question success',
            })
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    createQuestion,
    getQuestion,
    updateQuestion,
    deleteQuestion,
}