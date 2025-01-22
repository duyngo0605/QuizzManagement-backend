const RequestJoinService = require('../services/RequestJoinService')

const createRequestJoin =  async (req, res) => {

    try {
        const response = await RequestJoinService.createRequestJoin(req.body)
        return res.status(200).json(response)
    }
    catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}


const getRequestJoin = async (req, res) => {
    try {
        const RequestJoinId = req.params.id
        const response = await RequestJoinService.getRequestJoin(RequestJoinId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}


const updateRequestJoin =  async (req, res) => {    
    try {
        const RequestJoinId = req.params.id
        if (!RequestJoinId)
        {
            return res.status(200).json({
                status: 'ERR',
                message: 'The RequestJoin is required'
            })
        }

        const data = req.body
        const response = await RequestJoinService.updateRequestJoin(RequestJoinId, data)
        return res.status(200).json(response)
    }

    catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const deleteRequestJoin = async (req,res) => {
    try {
        const RequestJoinId = req.params.id
        if (!RequestJoinId)
        {
            return res.status(200).json({
                status: 'ERR',
                message: 'The RequestJoin is not defined'
            })
        }
        const response = await RequestJoinService.deleteRequestJoin(RequestJoinId)
        return res.status(200).json(response)
    }

    catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

module.exports = {
    createRequestJoin,
    updateRequestJoin,
    deleteRequestJoin,
    getRequestJoin,
}