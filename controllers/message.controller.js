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
        const {senderId} = req.params; //senderID = userId
        //continue
        const receiver_id = await messageModel.message.distinct('receiver_id', {sender_id: senderId});
        
        if(!receiver_id){
            return res.status(404).json({
                code: 404,
                message: "You haven't texted anyone yet",
              });
        }

        return res.status(200).json({
            code: 200,
            result: receiver_id,
            message: "get people list message successfully",
          });
    } catch (error) {
        return res.status(500).json({ code: 500, message: error.message });
    }
}

const getMessageList  = async (req, res, next) => {
    try {   
        const {senderId, receiverId} = req.params; //senderID = userId

        const messages = messageModel.message.find({ sender_id: senderId, receiver_id: receiverId })
    } catch (error) {
        return res.status(500).json({ code: 500, message: error.message });
    }
}

module.exports = {
    dataProcessing,
    getPeopleMessageList,
    getMessageList,
}