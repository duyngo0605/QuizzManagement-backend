const Team = require('../models/Team')
const RequestJoin = require('../models/RequestJoin')
const { verifyToken } = require('../middleware/authMiddleware')

const createTeam = async (newTeam) => {
    return new Promise(async (resolve, reject) => {
        try {
            const createdTeam = await Team.create(newTeam)
            if (createdTeam) {
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: createdTeam
                })
            }
        }

        catch (e) {
            reject(e)
        }
    })
}

const getTeam = (id, token) => {
    return new Promise(async (resolve, reject) => {
        try {
            let idUser = null;
            if (token) {
                const decoded = await verifyToken(token);
                idUser = decoded.id;
            }
            if (!id) {
                let allTeam = await Team.find();

                if (idUser) {
                    allTeam = await Promise.all(allTeam.map(async team => {
                        let teamStatus = 'not-joined';
                    
                        if ( team.members.some(m => m.member.toString() === idUser)) {
                            teamStatus = 'joined';
                        } else if(team.idHost.toString() === idUser) {
                            teamStatus = 'host';
                        }
                        else {
                            const pendingRequest = await RequestJoin.findOne({ // ✅ Thêm await
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
                        return teamObject;
                    }));
                    
                }

                resolve({
                    status: 'OK',
                    message: 'Success',
                    data: allTeam
                });
            }
            else {
                const team = await Team.findOne({ _id: id }).populate('members.member');
                if (!team) {
                    return reject({
                        status: 'ERR',
                        message: 'The Team is not defined'
                    });
                }

                let teamStatus = 'not-joined';

                if (idUser) {
                    if (team.members.some(m => m.member._id.toString() === idUser)) {
                        teamStatus = 'joined';
                    } else if(team.idHost.toString() === idUser) {
                        teamStatus = 'host';
                    }
                     else {
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

module.exports = getTeam;


const updateTeam = async (TeamId, data) => {
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
}