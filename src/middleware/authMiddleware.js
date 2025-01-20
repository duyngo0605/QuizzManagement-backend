const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

const authMiddleWare = (req, res, next) => {
    const token = req.headers.token
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
        if (err) {
            return res.status(404).json({
                message: 'The error',
                status: 'ERROR'
            })
        }
        if (user?.role === 'admin') {
            next()
        } else {
            return res.status(404).json({
                message: 'The authentication ',
                status: 'ERROR'
            })
        }
    });
}

const authUserMiddleWare = (req, res, next) => {

    const token = req.headers.token
    const userId = req.params.id
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
        if (err) {
            return res.status(404).json({
                message: 'The authentication',
                status: 'ERROR'
            })
        }
        if (user?.role === 'admin' || user?.role === 'staff') {
            next()
        } else {
            return res.status(404).json({
                message: 'The authentication',
                status: 'ERROR'
            })
        }
    });
}

module.exports = {
    authMiddleWare,
    authUserMiddleWare
}