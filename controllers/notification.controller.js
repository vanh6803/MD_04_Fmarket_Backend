const notifiModel = require('../models/Notification');

const newNotifiMessage = async (msg) => {
    try {
        if(msg){
            const {sender_id, receiver_id ,content} = msg;

            let obj = new notifiModel.notifi({
                sender_id: sender_id,
                receiver_id: receiver_id,
                content: content,
                status: 'unread',
                type: 'msg'
            });

            await obj.save()
                .then(saved => {
                    console.log('document saved ',saved);
                 })
                 .catch(err => {
                    console.log('error ', err);
                 })
        }
    } catch (error) {
        console.log('error ', error);
    }
}

const newNotifiComment = async (cmt) => {
    try {
        if(cmt){
            const {sender_id, receiver_id ,content} = cmt;

            let obj = new notifiModel.notifi({
                sender_id: sender_id,
                receiver_id: receiver_id,
                content: content,
                type: 'cmt'
            });

            await obj.save()
                .then(saved => {
                    console.log('document saved ',saved);
                 })
                 .catch(err => {
                    console.log('error ', err);
                 })
        }
    } catch (error) {
        console.log('error ', error);
    }
}

const allNotificationByUser = async (req, res, next) => {
    try {
        const {userId} = req.params;
        
        const notifications = await notifiModel.notifi.find({receiver_id: userId});
        
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