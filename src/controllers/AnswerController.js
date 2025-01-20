const AnswerService = require('../services/AnswerService')

const createAnswer =  async (req, res) => {

    try {
        const response = await AnswerService.createAnswer(req.body)
        return res.status(200).json(response)
    }
    catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}


const getAnswer = async (req, res) => {
    try {
        const AnswerId = req.params.id
        const response = await AnswerService.getAnswer(AnswerId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}


const updateAnswer =  async (req, res) => {    
    try {
        const AnswerId = req.params.id
        if (!AnswerId)
        {
            return res.status(200).json({
                status: 'ERR',
                message: 'The Answer is required'
            })
        }

        const data = req.body
        const response = await AnswerService.updateAnswer(AnswerId, data)
        return res.status(200).json(response)
    }

    catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const deleteAnswer = async (req,res) => {
    try {
        const AnswerId = req.params.id
        if (!AnswerId)
        {
            return res.status(200).json({
                status: 'ERR',
                message: 'The Answer is not defined'
            })
        }
        const response = await AnswerService.deleteAnswer(AnswerId)
        return res.status(200).json(response)
    }

    catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

module.exports = {
    createAnswer,
    updateAnswer,
    deleteAnswer,
    getAnswer,
}