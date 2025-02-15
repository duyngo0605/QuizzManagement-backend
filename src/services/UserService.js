const User = require('../models/User')
const bcrypt = require('bcrypt')
const Friendship = require('../models/FriendShip')
const Result=require('../models/Result')
const { verifyToken } = require('../middleware/authMiddleware')
const { generateAccessToken, generateRefreshToken, decodeAccessToken } = require('./JwtService')

const createUser = async (newUser) => {
    return new Promise(async (resolve, reject) => {
        const { username, password, role, avatar, email } = newUser
        if (!username || !password) {
            reject({
                status: 'ERR',
                message: 'The username and password are required.'
            })
        }
        try {
            const checkUser = await User.findOne({
                username: username
            })

            if (checkUser) {
                reject({
                    status: 'ERR',
                    message: 'The user was existed.'
                })
            }
            const hash = bcrypt.hashSync(password, 10);

            const createdUser = await User.create({
                username,
                password: hash,
                role,
                avatar,
                email
            })
            if (createdUser) {
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: createdUser
                })
            }
        }

        catch (e) {
            reject(e)
        }
    })
}

const loginUser = async (loginModel) => {
    return new Promise(async (resolve, reject) => {
        const { username, password } = loginModel
        if (!username || !password) {
            reject({
                status: 'ERR',
                message: 'The username and password are required.'
            })
        }
        try {
            const checkUser = await User.findOne({
                username: username
            })

            if (!checkUser) {
                reject({
                    status: 'ERR',
                    message: 'The user is not defined.'
                })
            }
            const comparepassword = bcrypt.compareSync(password, checkUser.password);

            if (comparepassword) {
                const access_token = await generateAccessToken({
                    id: checkUser.id,
                    username: checkUser.username,
                    role: checkUser.role
                })

                const refresh_token = await generateRefreshToken({
                    id: checkUser.id,
                    username: checkUser.username,
                    role: checkUser.role
                })
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    access_token,
                    refresh_token,
                })
            }
            else {
                reject({
                    status: 'ERR',
                    message: 'The password is not correct.'
                })
            }

        }

        catch (e) {
            reject(e)
        }
    })
}

const getUser = (id, token) => {
    return new Promise(async (resolve, reject) => {
        try {
            const decoded = await verifyToken(token);
            const idUser = decoded.id;
            const isAdmin = decoded.role === "admin";

            if(!id){
            if (isAdmin) {
                const users = await User.find().select("-password");
                return resolve({
                    status: "OK",
                    message: "SUCCESS",
                    data: users,
                });
            }
        }

            let targetUserId = id ;
            
            const user = await User.findOne({ _id: targetUserId }).select("-password");
            
            if (!user) {
                return reject({
                    status: "ERR",
                    message: "The user is not defined",
                });
            }

            
            const friendCount = await Friendship.countDocuments({
                $or: [{ requester: targetUserId }, { recipient: targetUserId }],
                status: "accepted",
            });

            
            const totalScore = await Result.aggregate([
                { $match: { idParticipant: user._id } },
                { $group: { _id: null, total: { $sum: "$score" } } },
            ]);

            
            const quizCount = user.library.quizzes.length;
            const questionCount = user.library.questions.length;


            const friendship = await Friendship.findOne({
                $or: [
                    { requester: idUser, recipient: targetUserId },
                    { requester: targetUserId, recipient: idUser },
                ],
            });

            let friendshipStatus = "none";
            if (friendship) {
                if (friendship.status === "accepted") {
                    friendshipStatus = "friends";
                } else if (friendship.status === "pending" && friendship.requester.toString() === idUser) {
                    friendshipStatus = "request_sent";
                } else if (friendship.status === "pending" && friendship.recipient.toString() === idUser) {
                    friendshipStatus = "request_received";
                } else if (friendship.status === "blocked") {
                    friendshipStatus = "blocked";
                }
            }

            resolve({
                status: "OK",
                message: "SUCCESS",
                data: {
                    ...user._doc,
                    friendCount,
                    totalScore: totalScore.length > 0 ? totalScore[0].total : 0,
                    quizCount,
                    questionCount,
                    friendshipStatus,
                },
            });
        } catch (e) {
            reject(e);
        }
    });
};



const getMyProfile = (token) => {
    return new Promise(async (resolve, reject) => {
        try {
            const decoded = await verifyToken(token);
            const idUser = decoded.id;

            // Lấy thông tin user
            const user = await User.findOne({ _id: idUser }).select("-password");

            if (!user) {
                return reject({
                    status: "ERR",
                    message: "The user is not defined",
                });
            }

            // Đếm số lượng bạn bè (Friendship có status là "accepted")
            const friendCount = await Friendship.countDocuments({
                $or: [{ requester: idUser }, { recipient: idUser }],
                status: "accepted",
            });

            // Tính tổng điểm của user từ bảng Result
            const totalScore = await Result.aggregate([
                { $match: { idParticipant: user._id } },
                { $group: { _id: null, total: { $sum: "$score" } } },
            ]);

            // Lấy số lượng quiz và question từ library của user
            const quizCount = user.library.quizzes.length;
            const questionCount = user.library.questions.length;

            resolve({
                status: "OK",
                message: "Success",
                data: {
                    ...user._doc,
                    friendCount,
                    totalScore: totalScore.length > 0 ? totalScore[0].total : 0,
                    quizCount,
                    questionCount,
                },
            });
        } catch (e) {
            reject(e);
        }
    });
};



const updateUser = async (userId, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({
                _id: userId
            })
            if (!checkUser) {
                reject({
                    status: 'ERR',
                    message: 'The user is not defined.'
                })
            }
            if (data.password) {
                const hash = bcrypt.hashSync(data.password, 10);
                data.password = hash;
            }

            const updatedUser = await User.findByIdAndUpdate(userId, data, { new: true })
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: updatedUser
            })
        }

        catch (e) {
            reject(e)
        }
    })
}

const deleteUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({
                _id: id
            })
            if (checkUser === null) {
                reject({
                    status: 'ERR',
                    message: 'The user is not defined'
                })
            }

            await User.findByIdAndDelete(id)
            resolve({
                status: 'OK',
                message: 'Delete user success',
            })
        } catch (e) {
            reject(e)
        }
    })
}


const changeProfile = async (token, data) => {
    return new Promise(async (resolve, reject) => {
        try {


            const decoded = await verifyToken(token);
            const userId = decoded.id;

            if (!userId) {
                return reject({
                    status: 'ERR',
                    message: 'Unauthorized request'
                });
            }

            const user = await User.findById(userId);
            if (!user) {
                return reject({
                    status: 'ERR',
                    message: 'User not found'
                });
            }


            if (data.password && data.oldPassword) {
                const isMatch = bcrypt.compareSync(data.oldPassword, user.password);
                if (!isMatch) {
                    return reject({
                        status: 'ERR',
                        message: 'Old password is incorrect'
                    });
                }

                data.password = bcrypt.hashSync(data.password, 10);
            } else if (data.password && !data.oldPassword) {
                return reject({
                    status: 'ERR',
                    message: 'Old password is required to change the password'
                });
            }

            const updatedUser = await User.findByIdAndUpdate(userId, data, { new: true });

            resolve({
                status: 'OK',
                message: 'User updated successfully',
                data: updatedUser
            });
        } catch (e) {
            reject({
                status: 'ERR',
                message: 'Server error',
                error: e.message
            });
        }
    });
};

const getUserStats = () => {
    return new Promise(async (resolve, reject) => {
        try {
                    // Tổng số user
                    const totalUsers = await User.countDocuments();

                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const newUsersToday = await User.countDocuments({
                        createdAt: {
                            $gte: today,
                            $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
                        }
                    });

        
                    // Thống kê user theo ngày
                    const dailyStats = await User.aggregate([
                        {
                            $group: {
                                _id: {
                                    year: { $year: "$createdAt" },
                                    month: { $month: "$createdAt" },
                                    day: { $dayOfMonth: "$createdAt" }
                                },
                                count: { $sum: 1 }
                            }
                        },
                        { $sort: { "_id.year": -1, "_id.month": -1, "_id.day": -1 } }
                    ]);
        
                    const topQuizCreators = await User.aggregate([
                        {
                            $project: {
                                username: 1,
                                email: 1,
                                totalQuizzes: { $size: "$library.quizzes" }
                            }
                        },
                        { $sort: { totalQuizzes: -1 } },
                        { $limit: 5 }
                    ]);
                    
                    // User có nhiều question nhất
                    const topQuestionCreators = await User.aggregate([
                        {
                            $project: {
                                username: 1,
                                email: 1,
                                totalQuestions: { $size: "$library.questions" }
                            }
                        },
                        { $sort: { totalQuestions: -1 } },
                        { $limit: 5 }
                    ]);
        
                    // User có nhiều lượt làm quiz nhất
                    const topActiveUsers = await Result.aggregate([
                        {
                            $group: {
                                _id: "$idParticipant",
                                totalAttempts: { $sum: 1 }
                            }
                        },
                        {
                            $lookup: {
                                from: "users",
                                localField: "_id",
                                foreignField: "_id",
                                as: "userInfo"
                            }
                        },
                        { $unwind: "$userInfo" },
                        {
                            $project: {
                                username: "$userInfo.username",
                                email: "$userInfo.email",
                                totalAttempts: 1
                            }
                        },
                        { $sort: { totalAttempts: -1 } },
                        { $limit: 5 }
                    ]);
        
                    resolve({
                        status: "OK",
                        message: "Success",
                        data: {
                            totalUsers,
                            newUsersToday,
                            dailyStats,
                            topQuizCreators,
                            topQuestionCreators,
                            topActiveUsers
                        }
                    });
        
                } catch (error) {
                    console.error('Error getting home stats:', error);
                   reject({
                        status: 'ERR',
                        message: 'Server error',
                        error: error.message
                    });
                }
            });
}


const getUsers = (search = "", sort = "name", order = "asc", token) => {
    return new Promise(async (resolve, reject) => {
        try {
            const decoded = await verifyToken(token);
            const idUser = decoded.id;

            let query = {};
            if (search) {
                query = {
                    $or: [
                    
                        { email: { $regex: search, $options: "i" } }
                    ]
                };
            }

            let sortQuery = {};
            sortQuery[sort] = order === "asc" ? 1 : -1;

            const users = await User.find(query).select("-password").sort(sortQuery);

            const usersWithFriendshipStatus = await Promise.all(users.map(async (user) => {
                const friendship = await Friendship.findOne({
                    $or: [
                        { requester: idUser, recipient: user._id },
                        { requester: user._id, recipient: idUser },
                    ],
                });

                let friendshipStatus = "none";
                if (friendship) {
                    if (friendship.status === "accepted") {
                        friendshipStatus = "friends";
                    } else if (friendship.status === "pending" && friendship.requester.toString() === idUser) {
                        friendshipStatus = "request_sent";
                    } else if (friendship.status === "pending" && friendship.recipient.toString() === idUser) {
                        friendshipStatus = "request_received";
                    } else if (friendship.status === "blocked") {
                        friendshipStatus = "blocked";
                    }
                }

                return {
                    ...user._doc,
                    friendshipStatus,
                };
            }));

            resolve({
                status: "OK",
                message: "SUCCESS",
                data: usersWithFriendshipStatus,
            });
        } catch (e) {
            reject(e);
        }
    });
};



module.exports = {
    createUser,
    loginUser,
    getUser,
    updateUser,
    deleteUser,
    changeProfile,
    getMyProfile,
    getUserStats,
    getUsers
}