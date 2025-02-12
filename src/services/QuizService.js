const Quiz = require('../models/Quiz')
const User = require('../models/User')
const Question = require('../models/Question')
const Topic = require('../models/Topic')
const { checkPermissions } = require('../middleware/authMiddleware');
const Result = require('../models/Result');

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


const getQuiz = (id, filter, filterType) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                const countQuiz = await Quiz.countDocuments();
                let allQuiz = [];
                const sortCondition = {};

                // Kiểm tra sortField hợp lệ
                const validSortFields = ["createdAt", "participants", "name"];
                if (filter?.sortField && validSortFields.includes(filter.sortField)) {
                    sortCondition[filter.sortField] = filter.sortOrder === 'desc' ? -1 : 1;
                }

                const filterCondition = {};
                const andCondition = [];

                if (filter?.name) {
                    filterCondition.name = { $regex: filter.name, $options: 'i' };
                }
                if (filter?.status) {
                    filterCondition.status = filter.status;
                }
                if (filter?.idCreator) {
                    filterCondition.idCreator = filter.idCreator;
                }
                
                // Fix lỗi topics
                if (filter?.topics) {
                    filterCondition.topicId = { $in: Array.isArray(filter.topics) ? filter.topics : [filter.topics] };
                }

                // Fix lỗi minTime / maxTime
                if (filter?.minTime || filter?.maxTime) {
                    filterCondition.time = {};
                    if (filter.minTime) {
                        filterCondition.time.$gte = parseInt(filter.minTime);
                    }
                    if (filter.maxTime) {
                        filterCondition.time.$lte = parseInt(filter.maxTime);
                    }
                }

                // Thêm điều kiện minQuestions & maxQuestions vào andCondition
if (filter?.minQuestions || filter?.maxQuestions) {
    const exprConditions = [];

    if (filter.minQuestions) {
        exprConditions.push({ $gte: [{ $size: "$questions" }, parseInt(filter.minQuestions)] });
    }
    if (filter.maxQuestions) {
        exprConditions.push({ $lte: [{ $size: "$questions" }, parseInt(filter.maxQuestions)] });
    }

    // Chỉ thêm vào andCondition nếu có ít nhất một điều kiện hợp lệ
    if (exprConditions.length > 0) {
        andCondition.push({ $expr: { $and: exprConditions } });
    }
}


                // Gộp tất cả điều kiện vào `$and`
                if (Object.keys(filterCondition).length > 0) {
                    andCondition.push(filterCondition);
                }

                const finalFilter = andCondition.length > 0 ? { $and: andCondition } : {};
                
                        

                if (filterType === 'newest') {
                    allQuiz = await Quiz.find({ ...filterCondition, status: "active" })
                        .populate('topicId')
                        .sort({ createdAt: -1 })
                        .limit(10);
                    } else if (filterType === 'recent') {
                        const recentResults = await Result.find()
                            .sort({ createdAt: -1 })
                            .limit(10)
                            .populate({
                                path: 'idQuiz',
                                match: { status: "active" }, 
                                populate: { path: 'topicId' }
                            });
                    
                        // Lọc bỏ kết quả null và loại bỏ trùng lặp bằng Map
                        const uniqueQuizMap = new Map();
                        recentResults.forEach(result => {
                            if (result.idQuiz) {
                                uniqueQuizMap.set(result.idQuiz._id.toString(), result.idQuiz);
                            }
                        });
                    
                        allQuiz = Array.from(uniqueQuizMap.values());
                    
                    
                        if (allQuiz.length < 10) {
                            const additionalQuizzes = await Quiz.find({
                                _id: { $nin: allQuiz.map(q => q._id) },
                                status: "active",
                                ...filterCondition
                            })
                                .populate('topicId')
                                .sort({ createdAt: -1 })
                                .limit(10 - allQuiz.length);
                    
                            allQuiz = [...allQuiz, ...additionalQuizzes];
                        }
                    
                    
                }else if (filterType === 'hot') {
                    const oneWeekAgo = new Date();
                    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

                    const hotQuizzes = await Result.aggregate([
                        { $match: { createdAt: { $gte: oneWeekAgo } } },
                        { $group: { _id: "$idQuiz", count: { $sum: 1 } } },
                        { $sort: { count: -1 } },
                        { $limit: 5 }
                    ]);

                    const hotQuizIds = hotQuizzes.map(q => q._id);
                    allQuiz = await Quiz.find({ _id: { $in: hotQuizIds }, status: "active" }).populate('topicId');
                }  else {
                    allQuiz = await Quiz.find(finalFilter)
                        .populate('topicId')
                        .sort(sortCondition);
                }

                resolve({
                    status: 'OK',
                    message: 'Success',
                    data: allQuiz,
                    total: countQuiz
                });
                return;
            }

            const quiz = await Quiz.findOne({ _id: id })
                .populate('topicId')
                .populate('questions');

            if (!quiz) {
                reject({
                    status: 'ERR',
                    message: 'The Quiz is not defined'
                });
                return;
            }

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: quiz
            });
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

            if (data.status === 'active') {
                const questionCount = checkQuiz.questions.length;
                if (questionCount === 0) {
                    return reject({
                        status: 'ERR',
                        message: 'Cannot activate quiz without questions.'
                    });
                }
            }   
            const resultExists = await Result.exists({ idQuiz: QuizId });

        
            if (resultExists && data.questions) {
                delete data.questions;
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
            const existingResults = await Result.findOne({ idQuiz: id });
            if (existingResults) {
                return reject({
                    status: 'ERR',
                    message: 'Cannot delete quiz because it is linked to existing results'
                });
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
            const resultExists = await Result.exists({ idQuiz: id });
            if (resultExists) {
                return reject({
                    status: 'ERR',
                    message: 'Cannot add questions to a quiz that already has results.'
                });
            }

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
            const resultExists = await Result.exists({ idQuiz: id });
            if (resultExists) {
                return reject({
                    status: 'ERR',
                    message: 'Cannot remove questions to a quiz that already has results.'
                });
            }
            const questions = data.questions
            questions.forEach(question => {
                if (quiz.questions.includes(question))
                    quiz.questions.pull(question)
            })
            if (quiz.questions.length === 0) {
                quiz.status = 'inactive';
            }
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
            console.log('debug')
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