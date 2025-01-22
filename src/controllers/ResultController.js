const ResultService = require('../services/ResultService')

const createResult =  async (req, res) => {

    try {
        const response = await ResultService.createResult(req.body)
        return res.status(200).json(response)
    }
    catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}


const getResult = async (req, res) => {
    try {
        const ResultId = req.params.id
        const response = await ResultService.getResult(ResultId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}


const updateResult =  async (req, res) => {    
    try {
        const ResultId = req.params.id
        if (!ResultId)
        {
            return res.status(200).json({
                status: 'ERR',
                message: 'The Result is required'
            })
        }

        const data = req.body
        const response = await ResultService.updateResult(ResultId, data)
        return res.status(200).json(response)
    }

    catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const deleteResult = async (req,res) => {
    try {
        const ResultId = req.params.id
        if (!ResultId)
        {
            return res.status(200).json({
                status: 'ERR',
                message: 'The Result is not defined'
            })
        }
        const response = await ResultService.deleteResult(ResultId)
        return res.status(200).json(response)
    }

    catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

module.exports = {
    createResult,
    updateResult,
    deleteResult,
    getResult,
}