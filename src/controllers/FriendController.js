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
            return res.status(400).json({ status: "ERR", message: "Token là bắt buộc" });
        }

        const decoded = await verifyToken(token);
        const requesterId = decoded.id;
        const { recipientId } = req.body;

        if (!recipientId) {
            return res.status(400).json({ status: "ERR", message: "Cần ID người nhận" });
        }

        const response = await FriendShipService.cancelFriendRequest(requesterId, recipientId);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json({ status: "ERR", message: e.message });
    }
};

module.exports = { addFriend,cancelFriendRequest };
