const Team = require('../models/Team')
const RequestJoin = require('../models/RequestJoin')
const { verifyToken, checkPermissions } = require('../middleware/authMiddleware')

const createTeam = async (newTeam) => {
    return new Promise(async (resolve, reject) => {
        try {
            const createdTeam = await Team.create(newTeam);
            if (createdTeam) {
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: createdTeam
                });
            }
        } catch (e) {
            if (e.code === 11000) {
                reject({
                    status: 'ERR',
                    message: 'Team code already exists, please use a different code.'
                });
            } else {
                reject({
                    status: 'ERR',
                    message: e.message
                });
            }
        }
    });
};


const getTeam = (id, token, filter) => {
    return new Promise(async (resolve, reject) => {
        try {
            let idUser = null;
            if (token) {
                const decoded = await verifyToken(token);
                idUser = decoded.id;
            }

            if (!id) {
                const filterCondition = {};
                console.log("Received Filter:", filter);

                if (filter?.name || filter?.code) {
                    filterCondition.$or = [];
                    if (typeof filter.name === "string" && filter.name.trim() !== "") {
                        filterCondition.$or.push({ name: { $regex: filter.name, $options: 'i' } });
                    }
                    if (typeof filter.code === "string" && filter.code.trim() !== "") {
                        filterCondition.$or.push({ code: { $regex: filter.code, $options: 'i' } });
                    }
                
                    // Nếu $or rỗng, xóa nó để tránh lỗi
                    if (filterCondition.$or.length === 0) {
                        delete filterCondition.$or;
                    }
                }
                console.log("Filter Condition:", JSON.stringify(filterCondition, null, 2));

                
                let sortCondition = {};
                if (filter?.sortField) {
                    sortCondition[filter.sortField] = filter.sortOrder === 'desc' ? -1 : 1;
                }

                let allTeam = await Team.find(filterCondition)
                    .populate('idHost', '_id email avatar')
                    .sort(sortCondition); 
                if (idUser) {
                    allTeam = await Promise.all(allTeam.map(async team => {
                        let teamStatus = 'not-joined';
                        if (team.idHost && team.idHost._id.toString() === idUser) {
                            teamStatus = 'host';
                        } else if (team.members.some(m => m.member && m.member._id.toString() === idUser)) {
                            teamStatus = 'joined';
                        } else {
                            const pendingRequest = await RequestJoin.findOne({
                                idTeam: team._id,
                                idUser: idUser,
                                status: 'pending'
                            });

                            if (pendingRequest) {
                                teamStatus = 'pending';
                            }
                        }

                        let teamObject = team.toObject();
                        teamObject.joinStatus = teamStatus;
                        teamObject.memberCount = team.members.length;
                        teamObject.quizCount = team.quizzes ? team.quizzes.length : 0;
                        delete teamObject.members;
                        delete teamObject.quizzes;
                        return teamObject;
                    }));
                }

                resolve({
                    status: 'OK',
                    message: 'Success',
                    data: allTeam
                });
            } else {
                const team = await Team.findOne({ _id: id })
                    .populate('members.member', '_id email avatar')
                    .populate({
                        path: 'quizzes',
                        populate: {
                            path: 'topicId',
                            select: '_id name'
                        }
                    })
                    .populate('idHost', '_id email avatar');

                if (!team) {
                    return reject({
                        status: 'ERR',
                        message: 'The Team is not defined'
                    });
                }

                let teamStatus = 'not-joined';
                if (idUser) {
                    if (team.idHost._id.toString() === idUser) {
                        teamStatus = 'host';
                    } else if (team.members.some(m => m.member._id.toString() === idUser)) {
                        teamStatus = 'joined';
                    } else {
                        const pendingRequest = await RequestJoin.findOne({
                            idTeam: id,
                            idUser: idUser,
                            status: 'pending'
                        });

                        if (pendingRequest) {
                            teamStatus = 'pending';
                        }
                    }
                }
                let teamObject = team.toObject();
                teamObject.joinStatus = teamStatus;
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: team,
                    joinStatus: teamStatus
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};



const updateTeam = async (TeamId, data, token) => {
    return new Promise(async (resolve, reject) => {

        try {
            const checkTeam = await Team.findOne({
                _id: TeamId
            })
            if (!checkTeam) {
                reject({
                    status: 'ERR',
                    message: 'The Team is not defined.'
                })
            }

            await checkPermissions(token, checkTeam.idHost)
            const updatedTeam = await Team.findByIdAndUpdate(TeamId, data, { new: true })
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: updatedTeam
            })
        }

        catch (e) {
            reject(e)
        }
    })
}

const kickUser = async (teamId, userId, token) => {
    return new Promise(async (resolve, reject) => {
        try {
            const team = await Team.findOne({
                _id: teamId
            })
            if (!team) {
                reject({
                    status: 'ERR',
                    message: 'The Team is not defined.'
                })
            }
            const canUpdate = await checkPermissions(token, team.idHost)
            if (!canUpdate) {
                reject({
                    status: 'ERR',
                    message: 'You do not have sufficient permissions'
                })
            }

            if (team.idHost.toString() === userId) {
                reject({
                    status: 'ERR',
                    message: 'You can not kick yourself.'
                })
            }
        
            team.members = team.members.filter(m => m.member.toString() != userId)
            await team.save()
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: team
            })

        } catch (e) {
            reject(e)
        }
    })
}

const leaveTeam = async (teamId, token) => {
    return new Promise(async (resolve, reject) => {
        try {
            const team = await Team.findOne({
                _id: teamId
            })
            if (!team) {
                reject({
                    status: 'ERR',
                    message: 'The Team is not defined.'
                })
            }

            const decoded = await verifyToken(token)
            const userId = decoded.id
            
            if (team.idHost.toString() === userId) {
                reject({
                    status: 'ERR',
                    message: 'You can not leave the team as a host.'
                })
            }
            team.members = team.members.filter(m => m.member.toString() != userId)
            await team.save()
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: team
            })

        } catch (e) {
            reject(e)
        }
    })
}

const addQuiz = async (teamId, quizIds, token) => {
    return new Promise(async (resolve, reject) => {
        try {
            const team = await Team.findOne({
                _id: teamId
            })
            if (!team) {
                reject({
                    status: 'ERR',
                    message: 'The Team is not defined.'
                })
            }
            await checkPermissions(token, team.idHost)

            quizIds.forEach(quizId => {
                console.log(quizId)
                if (!team.quizzes.includes(quizId))
                    team.quizzes.push(quizId)
            })
            console.log('team.quizzes', team.quizzes)
            await team.save()
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: team
            })
            
        } catch (e) {
            reject(e)
        }
    })
}

const removeQuiz = async (teamId, quizIds, token) => {
    return new Promise(async (resolve, reject) => {
        try {
            const team = await Team.findOne({
                _id: teamId
            })
            if (!team) {
                reject({
                    status: 'ERR',
                    message: 'The Team is not defined.'
                })
            }
            await checkPermissions(token, team.idHost)
            quizIds.forEach(quizId => {
                team.quizzes = team.quizzes.filter(q => q.toString() != quizId)
            })
            await team.save()
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: team
            })
            
        } catch (e) {
            reject(e)
        }
    })
}


const deleteTeam = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkTeam = await Team.findOne({
                _id: id
            })
            if (checkTeam === null) {
                reject({
                    status: 'ERR',
                    message: 'The Team is not defined'
                })
            }
            await Team.findByIdAndDelete(id)
            resolve({
                status: 'OK',
                message: 'Delete Team success',
            })
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    createTeam,
    getTeam,
    updateTeam,
    deleteTeam,
    kickUser,
    leaveTeam,
    addQuiz,
    removeQuiz
}