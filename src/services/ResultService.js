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

            const previousAttempts = await Result.countDocuments({
                idQuiz,
                idParticipant: decoded.id,
                attemptTime: previousAttempts + 1
            });

            const createdResult = await Result.create({
                ...newResult,
                idParticipant: decoded.id
            });
            const populatedResult = await Result.findById(createdResult._id)
            .populate('idQuiz', 'name image _id');
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: populatedResult
            });
        } catch (e) {
            reject(e);
        }
    });
};

const getResult = (idParticipant,id, token, quizName, sortBy, sortOrder) => {
    return new Promise(async (resolve, reject) => {
        try {
            let query = {};

            
            if (id) {
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
                return;
            }
            if (idParticipant) {
                query.idParticipant = idParticipant;
            }

           
            if (token && !idParticipant) {
                const decoded = await verifyToken(token);
                query.idParticipant = decoded.id;
            }


            if (quizName) {
                const quiz = await Quiz.findOne({ name: new RegExp(quizName, 'i') });
                if (!quiz) {
                    reject({
                        status: 'ERR',
                        message: 'Quiz not found'
                    });
                    return;
                }
                query.idQuiz = quiz._id;
            }
            const order = sortOrder === 'asc' ? 1 : -1;
    
            let sortOption = {};
            if (sortBy === 'leaderboard') {
                sortOption = {
                    score: -order,          
                    completeTime: order,  
                    attempts: order         
                };
            } else if (sortBy === 'date') {
                sortOption = { createdAt: order }; 
            }

            
            let queryResult = Result.find(query)
                .populate('idQuiz', 'name image _id')
                .sort(sortOption);

            
            if (idParticipant) {
                queryResult = queryResult.limit(5);
            }

        
            const allResult = await queryResult;

            resolve({
                status: 'OK',
                message: 'Success',
                data: allResult
            });
        } catch (e) {
            reject({
                status: 'ERR',
                message: e.message || 'Internal Server Error'
            });
        }
    });
};




const getLeadBoard = (idQuiz, token) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userId = null;
            if (token) {
                try {
                    const decoded = await verifyToken(token);
                    userId = decoded.id;
                } catch (error) {
                    console.warn("Invalid token, proceeding without user data");
                }
            }

            if (!idQuiz) {
                reject({
                    status: 'ERR',
                    message: 'idQuiz is required'
                });
                return;
            }

            const results = await Result.find({ idQuiz: idQuiz })
                .populate('idParticipant', 'username email avatar _id')
                .populate('idQuiz', 'name');

            if (!results || results.length === 0) {
                reject({
                    status: 'ERR',
                    message: 'No results found for the specified quiz'
                });
                return;
            }

            const bestScores = {};
            results.forEach(result => {
                const participantId = result.idParticipant._id.toString();
                if (!bestScores[participantId] ||
                    result.score > bestScores[participantId].score ||
                    (result.score === bestScores[participantId].score && result.attempTime < bestScores[participantId].attempTime) ||
                    (result.score === bestScores[participantId].score && result.attempTime === bestScores[participantId].attempTime && result.completeTime < bestScores[participantId].completeTime)
                ) {
                    bestScores[participantId] = result;
                }
            });

            let sortedResults = Object.values(bestScores).sort((a, b) => {
                if (b.score !== a.score) return b.score - a.score;
                if (a.attempTime !== b.attempTime) return a.attempTime - b.attempTime;
                return a.completeTime - b.completeTime;
            });

            let myData = null;

            sortedResults = sortedResults.map((result, index) => {
                const rank = index + 1;
                const userData = {
                    rank: rank,
                    user: {
                        id: result.idParticipant._id,
                        username: result.idParticipant.username,
                        email: result.idParticipant.email,
                        avatar: result.idParticipant.avatar
                    },
                    score: result.score,
                    attempTime: result.attempTime,
                    completeTime: result.completeTime
                };

                if (userId && result.idParticipant._id.toString() === userId) {
                    myData = { ...userData, myRanking: rank };
                }

                return userData;
            });

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: {
                    leaderBoard: sortedResults, 
                    myData: myData
                }
            });
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
    getLeadBoard
};