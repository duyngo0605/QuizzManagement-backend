const Result = require('../models/Result')

const createResult = async (newResult) => {
    return new Promise(async (resolve, reject) => {
        try {
            const createdResult = await Result.create(newResult)
            if (createdResult)
            { 
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: createdResult
            })
            }
        }

        catch (e) {
            reject(e)
        }
    })
}


const getResult = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                const allResult = await Result.find()
                resolve({
                    status: 'OK',
                    message: 'Success',
                    data: allResult
                })
            }
            else {
                const Result = await Result.findOne({
                    _id: id
                })
                if (Result === null) {
                    resolve({
                        status: 'ERR',
                        message: 'The Result is not defined'
                    })
                }
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: Result
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

const updateResult = async (ResultId, data) => {
    return new Promise(async (resolve, reject) => {

        try {
            const checkResult = await Result.findOne({
                _id: ResultId
            })
            if (!checkResult){
                resolve({
                    status: 'ERR',
                    message: 'The Result is not defined.'
                })
            }

            const updatedResult = await Result.findByIdAndUpdate(ResultId, data, {new: true})
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: updatedResult
            })
        }

        catch (e) {
            reject(e)
        }
    })
}

const deleteResult = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkResult = await Result.findOne({
                _id: id
            })
            if (checkResult === null) {
                resolve({
                    status: 'ERR',
                    message: 'The Result is not defined'
                })
            }
            await Result.findByIdAndDelete(id)
            resolve({
                status: 'OK',
                message: 'Delete Result success',
            })
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    createResult,
    getResult,
    updateResult,
    deleteResult,
}