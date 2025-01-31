const RequestJoin = require('../models/RequestJoin')
const {verifyToken} = require('../middleware/authMiddleware')

const createRequestJoin = async (newRequestJoin, token) => {
    return new Promise(async (resolve, reject) => {
        try {
            const decoded = await verifyToken(token)
            newRequestJoin.idUser = decoded.id
            const createdRequestJoin = await RequestJoin.create(newRequestJoin)
            if (createdRequestJoin)
            { 
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: createdRequestJoin
            })
            }
        }

        catch (e) {
            reject(e)
        }
    })
}


const getRequestJoin = (id, token, idTeam, status) => {
    return new Promise(async (resolve, reject) => {
        try {
            let idUser = null;
            if (token) {
            const decoded = await verifyToken(token);
            idUser = decoded.id;
            }
            let filter = {};

            if (id) {
                
                const requestJoin = await RequestJoin.findOne({ _id: id });
                if (!requestJoin) {
                    return reject({
                        status: 'ERR',
                        message: 'The RequestJoin is not defined'
                    });
                }
                return resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: requestJoin
                });
            }

          
            if (idTeam) {
                filter.idTeam = idTeam;
            } else {
                
                filter.idUser = idUser;
            }

           
            if (status) {
                filter.status = status;
            }

            const allRequestJoin = await RequestJoin.find(filter);
            return resolve({
                status: 'OK',
                message: 'Success',
                data: allRequestJoin
            });
        } catch (e) {
            return reject({
                status: 'ERR',
                message: e.message
            });
        }
    });
};

const updateRequestJoin = async (RequestJoinId, data) => {
    return new Promise(async (resolve, reject) => {

        try {
            const checkRequestJoin = await RequestJoin.findOne({
                _id: RequestJoinId
            })
            if (!checkRequestJoin){
                reject({
                    status: 'ERR',
                    message: 'The RequestJoin is not defined.'
                })
            }

            const updatedRequestJoin = await RequestJoin.findByIdAndUpdate(RequestJoinId, data, {new: true})
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: updatedRequestJoin
            })
        }

        catch (e) {
            reject(e)
        }
    })
}

const deleteRequestJoin = (id, idTeam, token) => {
    return new Promise(async (resolve, reject) => {
        try {
            const decoded = await verifyToken(token);
            const idUser = decoded.id;
            if (!id && !idTeam) {
                return reject({
                    status: 'ERR',
                    message: 'Missing parameters: Provide either id or idTeam'
                });
            }

            let deleteQuery = {};

            if (id) {
                deleteQuery = { _id: id };
            } else {
                deleteQuery = { idTeam: idTeam, idUser: idUser };
            }

            const checkRequestJoin = await RequestJoin.findOne(deleteQuery);

            if (!checkRequestJoin) {
                return reject({
                    status: 'ERR',
                    message: 'RequestJoin not found'
                });
            }

            await RequestJoin.deleteMany(deleteQuery);

            resolve({
                status: 'OK',
                message: 'Delete RequestJoin success'
            });
        } catch (e) {
            reject({
                status: 'ERR',
                message: e.message || 'Something went wrong'
            });
        }
    });
};



module.exports = {
    createRequestJoin,
    getRequestJoin,
    updateRequestJoin,
    deleteRequestJoin,
}