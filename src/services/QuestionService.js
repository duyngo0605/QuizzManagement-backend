const Question = require('../models/Question')
const Quiz = require('../models/Quiz')
const { checkPermissions } = require('../middleware/authMiddleware');

const createQuestion = async (newQuestion, token) => {
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
            if(newQuestion.idQuiz){
                const quiz = await Quiz.findOne({
                    _id: newQuestion.idQuiz
                })
                await checkPermissions(token, quiz.idCreator)
                quiz.questions.push(createdQuestion._id)
                await quiz.save()
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
                const question = await Question.findOne({
                    _id: id
                })
                if (question === null) {
                    reject({
                        status: 'ERR',
                        message: 'The Question is not defined'
                    })
                }
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: question
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

const updateQuestion = async (id, data, token) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkQuestion = await Question.findOne({
                _id: id
            })
            if (!checkQuestion){
                reject({
                    status: 'ERR',
                    message: 'The Question is not defined.'
                })
            }
            console.log('debug')
            await checkPermissions(token, checkQuestion.idCreator);

            const updatedQuestion = await Question.findByIdAndUpdate(id, data, {new: true})
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: updatedQuestion,
            });
        } catch (e) {
            reject(e);
        }
    });
};

const deleteQuestion = async (id, token) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkQuestion = await Question.findOne({
                _id: id
            })
            if (!checkQuestion){
                reject({
                    status: 'ERR',
                    message: 'The Question is not defined.'
                })
            }

            await checkPermissions(token, checkQuestion.idCreator);

            const checkQuiz = await Quiz.findOne({ questions: id });
            if (checkQuiz) {
                return reject({
                    status: 'ERR',
                    message: `Cannot delete question. It is associated with quiz ID: ${checkQuiz._id}`,
                });
            }

            await Question.findByIdAndDelete(id);
            resolve({
                status: 'OK',
                message: 'Delete Question success',
            });
        } catch (e) {
            reject(e);
        }
    });
};

module.exports = {
    createQuestion,
    getQuestion,
    updateQuestion,
    deleteQuestion,
}