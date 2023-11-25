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
        const { senderId } = req.params; // senderID = userId
        const receiverIds = await messageModel.message.distinct('receiver_id', { sender_id: senderId });

        if (!receiverIds || receiverIds.length === 0) {
            return res.status(404).json({
                code: 404,
                message: "You haven't texted anyone yet",
            });
        }

        // Use find to get accounts based on the array of receiver IDs
        const accounts = await accountModel.account.find({ _id: { $in: receiverIds } });

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
        const {senderId, receiverId} = req.query; //senderID = userId

        const messages = await messageModel.message.find({
            $or: [
                { sender_id: senderId },
                { receiver_id: receiverId }
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