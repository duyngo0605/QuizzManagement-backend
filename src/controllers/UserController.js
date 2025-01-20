const UserService = require('../services/UserService')

const createUser =  async (req, res) => {

    try {
        const response = await UserService.createUser(req.body)
        return res.status(200).json(response)
    }
    catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}


const getUser = async (req, res) => {
    try {
        const userId = req.params.id
        const response = await UserService.getUser(userId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const loginUser =  async (req, res) => {    
    try {
        const { username, password} = req.body
        if (!username || !password) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required'
            })
        }
        const response = await UserService.loginUser(req.body)
        
        return res.status(200).json(response)
    }

    catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const updateUser =  async (req, res) => {    
    try {
        const userId = req.params.id
        if (!userId)
        {
            return res.status(200).json({
                status: 'ERR',
                message: 'The user is required'
            })
        }

        const data = req.body
        const response = await UserService.updateUser(userId, data)
        return res.status(200).json(response)
    }

    catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const deleteUser = async (req,res) => {
    try {
        const userId = req.params.id
        if (!userId)
        {
            return res.status(200).json({
                status: 'ERR',
                message: 'The user is not defined'
            })
        }
        const response = await UserService.deleteUser(userId)
        return res.status(200).json(response)
    }

    catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}



const refreshToken = async (req, res) => {
    try {
        let token = req.headers.token.split(' ')[1]
        if (!token) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The token is required'
            })
        }
        const response = await JwtService.refreshTokenJwtService(token)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}


const logoutUser = async (req, res) => {
    try {

        res.clearCookie('refresh_token')
        res.clearCookie('access_token')

        return res.status(200).json({
            status: 'OK',
            message: 'Logout successfully'
        })
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getUser,
    refreshToken,
    logoutUser,
}