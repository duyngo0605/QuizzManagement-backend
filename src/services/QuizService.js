const Quiz = require('../models/Quiz')
const Question = require('../models/Question')
const Topic = require('../models/Topic')
const User = require('../models/User')
const { checkPermissions } = require('../middleware/authMiddleware');

const createQuiz = async (newQuiz) => {
    return new Promise(async (resolve, reject) => {
        try {
            const createdQuiz = await Quiz.create(newQuiz);
            if (createdQuiz) { 
                if (createdQuiz.idCreator) {
                    const user = await User.findOne({ _id: createdQuiz.idCreator });
                    if (user) {
                        user.library.quizzes.push(createdQuiz._id);
                        await user.save();
                    }
                }
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: createdQuiz
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

const cloneQuiz = async (quizId, token) => {
    return new Promise(async (resolve, reject) => {
        try {
            const originalQuiz = await Quiz.findOne({ _id: quizId }).populate('questions');
            if (!originalQuiz) {
                reject({
                    status: 'ERR',
                    message: 'The Quiz is not defined.'
                });
                return;
            }

            await checkPermissions(token, originalQuiz.idCreator);

            const newQuizData = {
                ...originalQuiz.toObject(),
                _id: undefined,
                name: `${originalQuiz.name} (Clone)`,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const newQuiz = await Quiz.create(newQuizData);

            if (originalQuiz.questions && originalQuiz.questions.length > 0) {
                newQuiz.questions = originalQuiz.questions.map(question => question._id);
                await newQuiz.save();
            }

            const user = await User.findOne({ _id: originalQuiz.idCreator });
            if (user) {
                user.library.quizzes.push(originalQuiz._id);
                await user.save();
            }

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: newQuiz
            });
        } catch (e) {
            reject(e);
        }
    });
};

const getQuiz = (id, filter) => {
    return new Promise(async (resolve, reject) => {
        try {

        
            if (!id) {
                const countQuiz = await Quiz.countDocuments();
                let allQuiz = [];

                const sortCondition = {};
                if (filter?.sortField) {
                   
                    sortCondition[filter.sortField] = filter.sortOrder === 'desc' ? -1 : 1;
                }

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
                        .populate('topicId')
                        .sort(sortCondition);
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

const getPractice = async (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const quiz = await Quiz.findOne({
                _id: id
            }).populate('questions');

            if (!quiz) {
                reject({
                    status: 'ERR',
                    message: 'The Quiz is not defined.'
                });
                return;
            }

            const questions = quiz.questions.map(question => {
                const modifiedQuestion = question.toObject();

                if (modifiedQuestion.type === 'constructed' || modifiedQuestion.type === 'fill-in-the-blank') {
                    // Ẩn đáp án đúng đối với constructed và fill-in-the-blank
                    modifiedQuestion.answers = modifiedQuestion.answers.map(answer => {
                        return {
                            ...answer,
                            content: '' // Ẩn nội dung của đáp án
                        };
                    });
                } else {
                    // Trộn thứ tự các câu trả lời và đặt isCorrect về false
                    modifiedQuestion.answers = modifiedQuestion.answers.sort(() => Math.random() - 0.5).map(answer => {
                        return {
                            ...answer,
                            isCorrect: false // Đặt isCorrect về false
                        };
                    });
                }

                return modifiedQuestion;
            });

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: questions
            });
        } catch (e) {
            reject(e);
        }
    });
};

const getQuizStats = ( ) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Tổng số quiz và question
            const totalQuizzes = await Quiz.countDocuments();
            const totalQuestions = await Question.countDocuments();

            // Top topics có nhiều quiz nhất
            const hotTopics = await Topic.aggregate([
                {
                    $lookup: {
                        from: "quizzes",
                        localField: "_id",
                        foreignField: "topicId",
                        as: "quizzes"
                    }
                },
                {
                    $project: {
                        name: 1,
                        description: 1,
                        totalQuizzes: { $size: "$quizzes" }
                    }
                },
                { $sort: { totalQuizzes: -1 } },
                { $limit: 10 }
            ]);

            resolve({
                status: 'OK',
                message: 'Lấy thống kê xếp hạng thành công',
                data: {
                    totalQuizzes,
                    totalQuestions,
                    hotTopics
                }
            });

        } catch (error) {
            console.error('Error getting ranking stats:', error);
            reject({
                status: 'ERR',
                message: 'Lỗi khi lấy thống kê xếp hạng'
            });
        }
    });
}


module.exports = {
    createQuiz,
    cloneQuiz,
    getQuiz,
    updateQuiz,
    deleteQuiz,
    addQuestions,
    removeQuestions,
    getPractice,
    getQuizStats
}