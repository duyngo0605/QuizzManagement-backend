const Topic = require('../models/Topic');
const Quiz = require('../models/Quiz');
const Question = require('../models/Question');

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

module.exports = new RankingController();