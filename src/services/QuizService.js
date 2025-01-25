const Quiz = require('../models/Quiz')

const createQuiz = async (newQuiz) => {
    return new Promise(async (resolve, reject) => {
        try {
            const createdQuiz = await Quiz.create(newQuiz)
            if (createdQuiz)
            { 
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: createdQuiz
            })
            }
        }

        catch (e) {
            reject(e)
        }
    })
}


const getQuiz = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                const allQuiz = await Quiz.find().populate('topicId')
                resolve({
                    status: 'OK',
                    message: 'Success',
                    data: allQuiz
                })
            }
            else {
                const Quiz = await Quiz.findOne({
                    _id: id
                }).populate('topicId')
                if (Quiz === null) {
                    reject({
                        status: 'ERR',
                        message: 'The Quiz is not defined'
                    })
                }
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: Quiz
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

const updateQuiz = async (QuizId, data) => {
    return new Promise(async (resolve, reject) => {

        try {
            const checkQuiz = await Quiz.findOne({
                _id: QuizId
            })
            if (!checkQuiz){
                reject({
                    status: 'ERR',
                    message: 'The Quiz is not defined.'
                })
            }

            const updatedQuiz = await Quiz.findByIdAndUpdate(QuizId, data, {new: true})
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: updatedQuiz
            })
        }

        catch (e) {
            reject(e)
        }
    })
}

const deleteQuiz = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkQuiz = await Quiz.findOne({
                _id: id
            })
            if (checkQuiz === null) {
                reject({
                    status: 'ERR',
                    message: 'The Quiz is not defined'
                })
            }
            await Quiz.findByIdAndDelete(id)
            resolve({
                status: 'OK',
                message: 'Delete Quiz success',
            })
        } catch (e) {
            reject(e)
        }
    })
}

const addQuestions = async (id, questions) => {
    return new Promise(async (resolve, reject) => {
        try {
            const quiz = await Quiz.findOne({
                _id: id
            })
            if (!quiz) {
                reject({
                    status: 'ERR',
                    message: 'The Quiz is not defined.'
                })
            }
            quiz.questions.push(questions)
            await quiz.save()
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: quiz
            })
        } catch (e) {
            reject(e)
        }
    })
}

const removeQuestions = async (id, questions) => {
    return new Promise(async (resolve, reject) => {
        try {
            const quiz = await Quiz.findOne({
                _id: id
            })
            if (!quiz) {
                reject({
                    status: 'ERR',
                    message: 'The Quiz is not defined.'
                })
            }
            quiz.questions.pull(questions)
            await quiz.save()
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: quiz
            })
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    createQuiz,
    getQuiz,
    updateQuiz,
    deleteQuiz,
}