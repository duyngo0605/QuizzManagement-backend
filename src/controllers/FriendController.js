const FriendShipService = require('../services/FriendShipService');
const { verifyToken } = require('../middleware/authMiddleware')

const addFriend = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Token is required',
            });
        }

        
        const decoded = await verifyToken(token);
        const requesterId = decoded.id;  
        const { recipientId } = req.body; 

        if (!recipientId) {
            return res.status(400).json({ status: 'ERR', message: 'Recipient ID is required' });
        }

        const response = await FriendShipService.sendFriendRequest(requesterId, recipientId);
        return res.status(200).json(response);
    }
    catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: e.message
        });
    }
};


const cancelFriendRequest = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(400).json({ status: "ERR", message: "Token is required" });
        }

        const decoded = await verifyToken(token);
        const userId = decoded.id;
        const { friendId } = req.body;

        if (!friendId) {
            return res.status(400).json({ status: "ERR", message: "Friend ID is required" });
        }

        const response = await FriendShipService.cancelFriendRequest(userId, friendId);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json({ status: "ERR", message: e.message });
    }
};


const acceptFriendRequest = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(400).json({ status: "ERR", message: "Token is required" });
        }

        const decoded = await verifyToken(token);
        const recipientId = decoded.id;
        const { requesterId } = req.body;

        if (!requesterId) {
            return res.status(400).json({ status: "ERR", message: "Requester ID is required" });
        }

        const response = await FriendShipService.acceptFriendRequest(requesterId, recipientId);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json({ status: "ERR", message: e.message });
    }
    
};


const getFriendRequests = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(400).json({ status: "ERR", message: "Token is required" });
        }

        const decoded = await verifyToken(token);
        const userId = decoded.id;

        const response = await FriendShipService.getFriendRequests(userId);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json({ status: "ERR", message: e.message });
    }
};

    const getListFriend = async (req, res) => {
        try {
            const token = req.headers.authorization?.split(" ")[1];
            if (!token) {
                return res.status(400).json({ status: "ERR", message: "Token is required" });
            }

            const decoded = await verifyToken(token);
            let userId = decoded.id;
            if (req.query.idUser) {
                userId = req.query.idUser;
            }
            const response = await FriendShipService.getListFriend(userId);
            return res.status(200).json(response);
        } catch (e) {
            return res.status(500).json({ status: "ERR", message: e.message });
        }
    };

module.exports = { addFriend,cancelFriendRequest,acceptFriendRequest,getFriendRequests,getListFriend };
