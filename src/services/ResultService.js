const Result = require('../models/Result');
const Question = require('../models/Question');
const {verifyToken} = require('../middleware/authMiddleware');

// Hàm tính điểm dựa trên câu trả lời của người dùng và đáp án đúng của câu hỏi
const calculateScore = async (questions, userAnswers) => {
    let score = 0;
    for (let i = 0; i < questions.length; i++) {
        const question = await Question.findById(questions[i]);
        if (question) {
            const correctAnswers = question.answers.filter(answer => answer.isCorrect);
            const userAnswer = userAnswers[i];
            console.log(correctAnswers, userAnswer);
            const isCorrect = checkIsCorrect(correctAnswers, userAnswer);
            if (isCorrect) {
                score += question.score;
            }
        }
    }
    return score;
};

const checkIsCorrect = (correctAnswers, userAnswer) => {
    for (let i = 0; i < correctAnswers.length; i++) {
        if (correctAnswers[i].content !== userAnswer[i].content) {
            return false;
        }
    }
    return true;
};

// Tạo kết quả mới
const createResult = async (newResult, token) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { questions, userAnswers } = newResult;

            // Nếu status là 'done', tính điểm
            if (newResult.status && newResult.status === 'done') {
                newResult.score = await calculateScore(questions, userAnswers);
            }

            const decoded = verifyToken(token);
            

            // Tạo kết quả mới
            const createdResult = await Result.create({idParticipant: decoded.id,...newResult});
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: createdResult
            });
        } catch (e) {
            reject(e);
        }
    });
};

// Lấy kết quả theo ID hoặc tất cả kết quả
const getResult = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                const allResult = await Result.find();
                resolve({
                    status: 'OK',
                    message: 'Success',
                    data: allResult
                });
            } else {
                const result = await Result.findOne({ _id: id });
                if (!result) {
                    reject({
                        status: 'ERR',
                        message: 'The Result is not defined'
                    });
                    return;
                }
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: result
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

// Cập nhật kết quả
const updateResult = async (ResultId, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkResult = await Result.findOne({ _id: ResultId });
            if (!checkResult) {
                reject({
                    status: 'ERR',
                    message: 'The Result is not defined.'
                });
                return;
            }

            const { questions, userAnswers } = data;

            // Nếu status là 'done', tính điểm
            if (data.status && data.status === 'done') {
                data.score = await calculateScore(questions, userAnswers);
            }
            
            const updatedResult = await Result.findByIdAndUpdate(ResultId, data, { new: true });
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: updatedResult
            });
        } catch (e) {
            reject(e);
        }
    });
};

const deleteResult = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkResult = await Result.findOne({ _id: id });
            if (!checkResult) {
                reject({
                    status: 'ERR',
                    message: 'The Result is not defined'
                });
                return;
            }

            await Result.findByIdAndDelete(id);
            resolve({
                status: 'OK',
                message: 'Delete Result success',
            });
        } catch (e) {
            reject(e);
        }
    });
};

module.exports = {
    createResult,
    getResult,
    updateResult,
    deleteResult,
};