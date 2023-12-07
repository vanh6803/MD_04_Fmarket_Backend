const notifiModel = require('../models/Notification');

const newNotifiMessage = async (msg) => {
    try {
        if(msg){
            const {sender_id, receiver_id ,content} = msg;

            const obj = new notifiModel.notifi({
                sender_id: sender_id,
                receiver_id: receiver_id,
                content: content,
                status: 'unread',
                type: 'msg'
            });

            const savedNotification = await obj.save();
            console.log('Document saved:', savedNotification);

            return savedNotification;
        }
    } catch (error) {
        console.log('error ', error);
    }
}

const newNotifiComment = async (cmt) => {
    try {
        if (cmt) {
            const { sender_id, receiver_id, content } = cmt;

            const newNotification = new notifiModel.notifi({
                sender_id: sender_id,
                receiver_id: receiver_id,
                content: content,
                type: 'cmt'
            });

            const savedNotification = await newNotification.save();
            console.log('Document saved:', savedNotification);

            return savedNotification; 
        }
    } catch (error) {
        console.log('Error:', error);
        throw error; 
    }
}

const allNotificationByUser = async (req, res, next) => {
    try {
        const {userId} = req.params;
        
        const notifications = await notifiModel.notifi.find({ receiver_id: userId })
        .populate({
            path: 'sender_id',
            model: 'account'
        })
        .populate({
            path: 'receiver_id',
            model: 'account'
        }).sort({ createdAt: -1 });

        if(!notifications || notifications.length === 0 ) {
            return res.status(404).json({ code: 404, message: "Không tìm thấy thông báo nào!" });
        }

        return res.status(200).json({
            code: 200,
            result: notifications,
            message: "Lấy danh sách thông báo thành công",
        });

    } catch (error) {
        return res.status(500).json({ code: 500, message: error.message });
    }
}

const updateStatusNotifi = async (req, res, next) => {
    try {
        const { notificationId } = req.params;

        await notifiModel.notifi.updateOne(
            { _id: notificationId, status: 'unread' },
            { $set: { status: 'read' } }
        ).then(success => {
            return res.status(200).json({ code: 200, result: success, message: "Đã xem tin nhắn" });
        })

    } catch (error) {
        return res.status(500).json({ code: 500, message: error.message });
    }
}

module.exports = {
    newNotifiMessage,
    newNotifiComment,
    allNotificationByUser,
    updateStatusNotifi
};