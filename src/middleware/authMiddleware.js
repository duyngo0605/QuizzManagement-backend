const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

const authMiddleWare = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1]
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
    const token = req.headers.authorization.split(' ')[1]
    const userId = req.params.id
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
        if (err) {
            return res.status(404).json({
                message: 'The error',
                status: 'ERROR'
            })
        }
        if (user?.role === 'admin' || user?.id === userId) {
            next()
        } else {
            return res.status(404).json({
                message: 'The authentication',
                status: 'ERROR'
            })
        }
    });
}

const verifyToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
            if (err) {
                return reject({ status: 'ERR', message: 'Invalid or expired token' });
            }
            resolve(decoded);
        });
    });
};


const checkPermissions = async (token, idCreator) => {
    try {
        const decoded = await verifyToken(token);

        if (decoded.role === 'admin' || decoded.id == idCreator) {
            console.log(idCreator)
            return true;
        }
        throw { status: 'ERR', message: 'You do not have sufficient permissions' };
    } catch (e) {
        throw e;
    }
};

module.exports = {
    authMiddleWare,
    authUserMiddleWare,
    verifyToken,
    checkPermissions
}