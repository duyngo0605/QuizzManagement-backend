const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const ACCESS_TOKEN = process.env.ACCESS_TOKEN || "access_token";
const REFRESH_TOKEN = process.env.REFRESH_TOKEN || "refresh_token";
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

const verifyToken = async (token) => {
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
        console.log(decoded)
        if (decoded.role === 'admin' || decoded.id == idCreator) {
            return true;
        }
        throw { status: 'ERR', message: 'You do not have sufficient permissions' };
    } catch (e) {
        throw e;
    }
};

const authenticateAccessToken = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Access token not provided" });
        }

        
        const userData = verifyToken2(token, 'access');
        req.user = userData; 
        next(); 
    } catch (e) {
        return res.status(401).json({ message: e.message });
    }
};


const verifyToken2 = (token, type = 'access') => {
    try {
        const secret = type === 'access' ? ACCESS_TOKEN : REFRESH_TOKEN;
        return jwt.verify(token, secret); 
    } catch (error) {
        throw new Error(type === 'access' ? "Access token invalid or expired" : "Refresh token invalid or expired");
    }
};

module.exports = {
    authMiddleWare,
    authUserMiddleWare,
    verifyToken,
    checkPermissions,
    authenticateAccessToken,
    verifyToken2
}