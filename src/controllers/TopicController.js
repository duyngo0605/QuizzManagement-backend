const TopicService = require('../services/TopicService')

const createTopic =  async (req, res) => {

    try {
        const response = await TopicService.createTopic(req.body)
        return res.status(200).json(response)
    }
    catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}


const getTopic = async (req, res) => {
    try {
        const TopicId = req.params.id
        const response = await TopicService.getTopic(TopicId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}


const updateTopic =  async (req, res) => {    
    try {
        const TopicId = req.params.id
        if (!TopicId)
        {
            return res.status(200).json({
                status: 'ERR',
                message: 'The Topic is required'
            })
        }

        const data = req.body
        const response = await TopicService.updateTopic(TopicId, data)
        return res.status(200).json(response)
    }

    catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const deleteTopic = async (req,res) => {
    try {
        const TopicId = req.params.id
        if (!TopicId)
        {
            return res.status(200).json({
                status: 'ERR',
                message: 'The Topic is not defined'
            })
        }
        const response = await TopicService.deleteTopic(TopicId)
        return res.status(200).json(response)
    }

    catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

module.exports = {
    createTopic,
    updateTopic,
    deleteTopic,
    getTopic,
}