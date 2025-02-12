const Topic = require('../models/Topic')
const Quiz = require('../models/Quiz')
const Result = require('../models/Result')

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
                const topic = await Topic.findOne({
                    _id: id
                })
                if (topic === null) {
                    reject({
                        status: 'ERR',
                        message: 'The Topic is not defined'
                    })
                }
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: topic
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
                reject({
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
                reject({
                    status: 'ERR',
                    message: 'The Topic is not defined'
                })
            }
            await Quiz.updateMany(
                { topicId: id }, // Điều kiện tìm kiếm quiz chứa topicId
                { $pull: { topicId: id } } // Xóa topicId khỏi mảng
            );

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

const getTopicStats =  (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const topic = await Topic.findOne({
                _id: id
            })
            if (!topic){
                reject({
                    status: 'ERR',
                    message: 'The Topic is not defined.'
                })
            }
            const quizzes = await Quiz.find({ topicId: id });
            const quizIds = quizzes.map(quiz => quiz._id);
            const totalQuizzes = quizzes.length;
            const totalAttempts = await Result.countDocuments({
                idQuiz: { $in: quizIds }
            });
            console.log('debug')
            const dailyStats = await Result.aggregate([
                {
                    $match: {
                        idQuiz: { $in: quizIds }
                    }
                },
                {
                    $group: {
                        _id: {
                            year: { $year: "$createdAt" },
                            month: { $month: "$createdAt" },
                            day: { $dayOfMonth: "$createdAt" }
                        },
                        count: { $sum: 1 },
                        averageScore: { $avg: "$score" }
                    }
                },
                {
                    $sort: {
                        "_id.year": -1,
                        "_id.month": -1,
                        "_id.day": -1
                    }
                }
            ]);
            const monthlyStats = await Result.aggregate([
                {
                    $match: {
                        idQuiz: { $in: quizIds }
                    }
                },
                {
                    $group: {
                        _id: {
                            year: { $year: "$createdAt" },
                            month: { $month: "$createdAt" }
                        },
                        count: { $sum: 1 },
                        averageScore: { $avg: "$score" }
                    }
                },
                {
                    $sort: {
                        "_id.year": -1,
                        "_id.month": -1
                    }
                }
            ]);
            const yearlyStats = await Result.aggregate([
                {
                    $match: {
                        idQuiz: { $in: quizIds }
                    }
                },
                {
                    $group: {
                        _id: {
                            year: { $year: "$createdAt" }
                        },
                        count: { $sum: 1 },
                        averageScore: { $avg: "$score" }
                    }
                },
                {
                    $sort: {
                        "_id.year": -1
                    }
                }
            ]);
            const averageScore = await Result.aggregate([
                {
                    $match: {
                        idQuiz: { $in: quizIds }
                    }
                },
                {
                    $group: {
                        _id: null,
                        averageScore: { $avg: "$score" }
                    }
                }
            ]);
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: {
                    totalQuizzes,
                    totalAttempts,
                    averageScore: averageScore[0]?.averageScore || 0,
                    dailyStats,
                    monthlyStats,
                    yearlyStats
                }
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
    getTopicStats
}