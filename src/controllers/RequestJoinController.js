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

const createManyRequestJoins = async (req, res) => {
    try {
        const RequestJoins = req.body;
        if (!Array.isArray(RequestJoins) || RequestJoins.length === 0) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The request body must be a non-empty array of RequestJoins',
            });
        }

        const responses = [];
        for (const question of RequestJoins) {
            const response = await RequestJoinservice.createQuestion(question);
            responses.push(response);
        }

        return res.status(200).json({
            status: 'OK',
            message: 'RequestJoins created successfully',
            data: responses,
        });
    } catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: 'Error creating RequestJoins',
            error: e.message,
        });
    }
};


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
    createManyRequestJoins
}