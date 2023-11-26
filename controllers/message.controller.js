const messageModel = require('../models/Message');
const accountModel = require('../models/Account');

const dataProcessing = async (msg) => {
    try {
        if(msg){
            let obj = new messageModel.message(msg);
            await obj.save();
        }else{
            console.log('no data');
        }
    } catch (error) {
        console.log(error);
    }
}

//Get the list of people you've texted 
const getPeopleMessageList = async (req, res, next) => {
    try {
        const { userId } = req.params; // userId của người dùng hiện tại

        // Tìm tất cả tin nhắn mà người dùng hiện tại là người gửi hoặc người nhận
        const messages = await messageModel.message.find({
            $or: [{ sender_id: userId }, { receiver_id: userId }]
        });

        // Lấy danh sách người đã nhắn tin với người dùng hiện tại
        const peopleList = messages.map(message => {
            return message.sender_id.toString() === userId
                ? message.receiver_id
                : message.sender_id;
        });

        // Lọc bỏ các id trùng lặp và tìm thông tin tài khoản tương ứng
        const uniquePeopleList = Array.from(new Set(peopleList));
        const accounts = await accountModel.account.find({ _id: { $in: uniquePeopleList, $ne: userId } });

        return res.status(200).json({
            code: 200,
            result: accounts,
            message: "Get people list message successfully",
        });
    } catch (error) {
        return res.status(500).json({ code: 500, message: error.message });
    }
}


const getMessageList  = async (req, res, next) => {
    try {   
        const {userId1, userId2} = req.query; //senderID = userId

        const messages = await messageModel.message.find({
            $or: [
                { sender_id: userId1, receiver_id: userId2 },
                { sender_id: userId2, receiver_id: userId1 }
            ]
        })
        .sort({ createdAt: 1 });

        if(!messages || messages.length === 0){
            return res.status(404).json({
                code: 404,
                message: "You haven't texted",
              });
        }

        return res.status(200).json({
            code: 200,
            result: messages,
            message: "get message list successfully",
          });

    } catch (error) {
        return res.status(500).json({ code: 500, message: error.message });
    }
}

module.exports = {
    dataProcessing,
    getPeopleMessageList,
    getMessageList,
}