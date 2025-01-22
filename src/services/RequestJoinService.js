const RequestJoin = require('../models/RequestJoin')

const createRequestJoin = async (newRequestJoin) => {
    return new Promise(async (resolve, reject) => {
        try {
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


const getRequestJoin = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                const allRequestJoin = await RequestJoin.find()
                resolve({
                    status: 'OK',
                    message: 'Success',
                    data: allRequestJoin
                })
            }
            else {
                const RequestJoin = await RequestJoin.findOne({
                    _id: id
                })
                if (RequestJoin === null) {
                    resolve({
                        status: 'ERR',
                        message: 'The RequestJoin is not defined'
                    })
                }
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: RequestJoin
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

const updateRequestJoin = async (RequestJoinId, data) => {
    return new Promise(async (resolve, reject) => {

        try {
            const checkRequestJoin = await RequestJoin.findOne({
                _id: RequestJoinId
            })
            if (!checkRequestJoin){
                resolve({
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

const deleteRequestJoin = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkRequestJoin = await RequestJoin.findOne({
                _id: id
            })
            if (checkRequestJoin === null) {
                resolve({
                    status: 'ERR',
                    message: 'The RequestJoin is not defined'
                })
            }
            await RequestJoin.findByIdAndDelete(id)
            resolve({
                status: 'OK',
                message: 'Delete RequestJoin success',
            })
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    createRequestJoin,
    getRequestJoin,
    updateRequestJoin,
    deleteRequestJoin,
}