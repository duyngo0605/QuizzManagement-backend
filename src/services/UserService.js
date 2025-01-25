const User = require('../models/User')
const bcrypt = require('bcrypt')
const { generateAccessToken, generateRefreshToken, decodeAccessToken } = require('./JwtService')

const createUser = async (newUser) => {
    console.log(newUser)
    return new Promise(async (resolve, reject) => {
        const { username, password, role, avatar, email } = newUser

        try {
            const checkUser = await User.findOne({
                username: username
            })
    
            if (checkUser){
                resolve({
                    status: 'ERR',
                    message: 'The user was existed.'
                })
            }
            const hash = bcrypt.hashSync(password, 10);

            const createdUser = await User.create({
                username,
                password: hash,
                role,
                avatar,
                email
            })
            if (createdUser)
            { 
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: createdUser
            })
            }
        }

        catch (e) {
            reject(e)
        }
    })
}

const loginUser = async (loginModel) => {
    return new Promise(async (resolve, reject) => {
        const { username, password} = loginModel
        console.log(username, password)
        try {
            const checkUser = await User.findOne({
                username: username
            })

            if (!checkUser){
                reject({
                    status: 'ERR',
                    message: 'The user is not defined.'
                })
            }
            const comparepassword = bcrypt.compareSync(password, checkUser.password);

            if (comparepassword)
            { 
                const access_token = await generateAccessToken({
                    id: checkUser.id,
                    username: checkUser.username,
                    role: checkUser.role
                })
    
                const refresh_token = await generateRefreshToken({
                    id: checkUser.id,
                    username: checkUser.username,
                    role: checkUser.role
                })
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                access_token,
                refresh_token,
            })
            }
            else
            {
                reject({
                    status: 'ERR',
                    message: 'The password is not correct.'
                })
            }
            
        }

        catch (e) {
            reject(e)
        }
    })
}

const getUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {console.log('debug')
                const allUser = await User.find().populate('employee')
                resolve({
                    status: 'OK',
                    message: 'Success',
                    data: allUser
                })
            }
            else {
                const user = await User.findOne({
                    _id: id
                })
                if (user === null) {
                    resolve({
                        status: 'ERR',
                        message: 'The user is not defined'
                    })
                }
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: user
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

const updateUser = async (userId, data) => {
    return new Promise(async (resolve, reject) => {

        try {
            const checkUser = await User.findOne({
                _id: userId
            })
            if (!checkUser){
                resolve({
                    status: 'ERR',
                    message: 'The user is not defined.'
                })
            }
            if (data.password)
            {
                const hash = bcrypt.hashSync(data.password, 10);
                data.password = hash;
            }

            const updatedUser = await User.findByIdAndUpdate(userId, data, {new: true})
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: updatedUser
            })
        }

        catch (e) {
            reject(e)
        }
    })
}

const deleteUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({
                _id: id
            })
            if (checkUser === null) {
                resolve({
                    status: 'ERR',
                    message: 'The user is not defined'
                })
            }

            await User.findByIdAndDelete(id)
            resolve({
                status: 'OK',
                message: 'Delete user success',
            })
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    createUser,
    loginUser,
    getUser,
    updateUser,
    deleteUser,
}