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


const createManyUsers = async (req, res) => {
    try {
        const Users = req.body;
        if (!Array.isArray(Users) || Users.length === 0) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The request body must be a non-empty array of Users',
            });
        }

        const responses = [];
        for (const question of Users) {
            const response = await UserService.createUser(question);
            responses.push(response);
        }

        return res.status(200).json({
            status: 'OK',
            message: 'Users created successfully',
            data: responses,
        });
    } catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: 'Error creating Users',
            error: e.message,
        });
    }
};


const getUser = async (req, res) => {
    try {
        const id = req.params.id
        const token = req.headers.authorization?.split(' ')[1];
    
        const response = await UserService.getUser(id,token)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}


const getUsers = async (req, res) => {
    try {
        const search = req.query.search || "";
        const sort = req.query.sort || "name";
        const order = req.query.order || "asc";
        const token = req.headers.authorization?.split(' ')[1];
        
        const response = await UserService.getUsers(search, sort, order, token);
        const filteredResponse = response.data.map(user => ({
            _id: user._id,
            avatar: user.avatar,
            email: user.email,
            friendshipStatus: user.friendshipStatus
        }));

        return res.status(200).json({
            status: response.status,
            message: response.message,
            data: filteredResponse
        });
       
    } catch (e) {
        return res.status(404).json({
            message: e.message || "An error occurred"
        });
    }
};



const getMyProfile = async (req, res) => {
    try {

        const token = req.headers.authorization?.split(' ')[1];

        const response = await UserService.getMyProfile(token)
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

const changeProfile = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
    
        
        if (!token) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Token is required'
            });
        }

        const data = req.body;
        const response = await UserService.changeProfile(token, data);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: 'Internal Server Error',
            error: e.message
        });
    }
};

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

const getUserStats = async (req, res) => {
    try {
        const response = await UserService.getUserStats()
        return res.status(200).json(response)
    }
    catch (e) {
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
    createManyUsers,
    changeProfile,
    getMyProfile,
    getUserStats,
    getUsers
}