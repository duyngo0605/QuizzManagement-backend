const Quiz = require('../models/Quiz')
const User = require('../models/User')
const { checkPermissions } = require('../middleware/authMiddleware');

const createQuiz = async (newQuiz) => {
    return new Promise(async (resolve, reject) => {
        try {
            const createdQuiz = await Quiz.create(newQuiz)
            if (createdQuiz)
            { 
                if (createdQuiz.idCreator) {
                    const user = await User.findOne({
                        _id: createdQuiz.idCreator
                    })
                    user.library.quizzes.push(createdQuiz._id)
                    await user.save()
                }
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

const getQuiz = (id, filter) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                const countQuiz = await Quiz.countDocuments();
                let allQuiz = [];
                if (filter) {
                    const filterCondition = {};

                    if (filter.name) {
                        filterCondition.name = { $regex: filter.name, $options: 'i' }; // Tìm kiếm theo tên (không phân biệt hoa thường)
                    }
                    if (filter.status) {
                        filterCondition.status = filter.status; // Tìm kiếm chính xác theo trạng thái
                    }
                    if (filter.idCreator) {
                        filterCondition.idCreator = filter.idCreator; // Tìm kiếm chính xác theo idCreator
                    }

                    const allQuizFilter = await Quiz.find(filterCondition)
                        .populate('topicId');

                    resolve({
                        status: 'OK',
                        message: 'Success',
                        data: allQuizFilter,
                        total: countQuiz
                    });
                    return;
                }

                allQuiz = await Quiz.find().populate('topicId');
                resolve({
                    status: 'OK',
                    message: 'Success',
                    data: allQuiz,
                    total: countQuiz
                });
            } else {
                const quiz = await Quiz.findOne({ _id: id })
                    .populate('topicId')
                    .populate('questions');
                if (!quiz) {
                    reject({
                        status: 'ERR',
                        message: 'The Quiz is not defined'
                    });
                }
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: quiz
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};


const updateQuiz = async (QuizId, data, token) => {
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

            await checkPermissions(token, checkQuiz.idCreator)

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

const deleteQuiz = (id, token) => {
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

             const user = await User.findOne({
                _id: checkQuiz.idCreator
            })
            user.library.quizzes.pull(id)
            await user.save()

            await checkPermissions(token, checkQuiz.idCreator)
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

const addQuestions = async (id, data, token) => {
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
            await checkPermissions(token, quiz.idCreator)
            const questions = data.questions
            questions.forEach(question => {
                 quiz.questions.push(question)
            })
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

const removeQuestions = async (id, data, token) => {
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
            await checkPermissions(token, quiz.idCreator)
            const questions = data.questions
            questions.forEach(question => {
                if (quiz.questions.includes(question))
                    quiz.questions.pull(question)
            })
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
    addQuestions,
    removeQuestions
}