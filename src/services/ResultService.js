const Result = require('../models/Result');
const Question = require('../models/Question');
const Quiz = require('../models/Quiz');
const {verifyToken} = require('../middleware/authMiddleware');

const calculateScore = async (idQuiz, userAnswers) => {
    const quiz = await Quiz.findById(idQuiz);
    const questions = quiz.questions;
    let score = 0;
    for (let i = 0; i < questions.length; i++) {
        const question = await Question.findById(questions[i]);
        if (question) {
            const correctAnswers = question.answers.filter(answer => answer.isCorrect);
            const userAnswer = userAnswers[i];
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

const createResult = async (newResult, token) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { idQuiz, userAnswers } = newResult;

            if (newResult.status && newResult.status === 'done') {
                newResult.score = await calculateScore(idQuiz, userAnswers);
            }

            const decoded = await verifyToken(token);
            
            const createdResult = await Result.create({
                ...newResult,
                idParticipant: decoded.id
            });
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

            const { idQuiz, userAnswers } = data;

            if (data.status && data.status === 'done') {
                data.score = await calculateScore(idQuiz, userAnswers);
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