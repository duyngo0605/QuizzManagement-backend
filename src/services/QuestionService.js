const Question = require('../models/Question')
const Quiz = require('../models/Quiz')
const User = require('../models/User')
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
            if(newQuestion.idCreator){
                const user = await User.findOne({
                    _id: newQuestion.idCreator
                })
                user.library.questions.push(createdQuestion._id)
                await user.save()
            }
        }

        catch (e) {
            reject(e)
        }
    })
}


const getQuestion = (id, filter) => {
    return new Promise(async (resolve, reject) => {
        try {
            const countQuestion = await Question.countDocuments();
            let allQuestion = [];
            if (!id) {

                const filterCondition = {};
                if(filter) {
                    
                

                    if (filter) {
                        if (filter.content) {
                            filterCondition.content = { $regex: filter.content, $options: 'i' }; // Tìm kiếm theo nội dung (không phân biệt hoa thường)
                        }
                        if (filter.type) {
                            filterCondition.type = filter.type; // Tìm kiếm chính xác theo loại câu hỏi
                        }
                        if (filter.idCreator) {
                            filterCondition.idCreator = filter.idCreator; // Tìm kiếm chính xác theo idCreator
                        }
                    }

                }
                allQuestion = await Question.find(filterCondition)
                resolve({
                    status: 'OK',
                    message: 'Success',
                    data: allQuestion,
                    total: countQuestion
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
                    data: question,
                    total: countQuestion
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

            const user = await User.findOne({
                _id: checkQuestion.idCreator
            })
            user.library.questions.pull(checkQuestion._id)
            await user.save()

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