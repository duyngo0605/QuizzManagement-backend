const Team = require('../models/Team')

const createTeam = async (newTeam) => {
    return new Promise(async (resolve, reject) => {
        try {
            const createdTeam = await Team.create(newTeam)
            if (createdTeam)
            { 
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


const getTeam = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                const allTeam = await Team.find()
                resolve({
                    status: 'OK',
                    message: 'Success',
                    data: allTeam
                })
            }
            else {
                const team = await Team.findOne({
                    _id: id
                })
                if (team === null) {
                    reject({
                        status: 'ERR',
                        message: 'The Team is not defined'
                    })
                }
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: team
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

const updateTeam = async (TeamId, data) => {
    return new Promise(async (resolve, reject) => {

        try {
            const checkTeam = await Team.findOne({
                _id: TeamId
            })
            if (!checkTeam){
                reject({
                    status: 'ERR',
                    message: 'The Team is not defined.'
                })
            }

            const updatedTeam = await Team.findByIdAndUpdate(TeamId, data, {new: true})
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