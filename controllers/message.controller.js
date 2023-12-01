const messageModel = require('../models/Message');
const accountModel = require('../models/Account');
const storeModel = require('../models/Store');

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
        const { userId } = req.params;

        const messages = await messageModel.message.find({
            $or: [{ sender_id: userId }, { receiver_id: userId }]
        });

        if(!messages){
            return res.status(404).json({ code: 404, message: "No message!" });
        }

        const peopleList = messages.map(message => (
            message.sender_id.toString() === userId
                ? message.receiver_id
                : message.sender_id
        ));

        if(!peopleList){
            return res.status(404).json({ code: 404, message: "No people list!" });
        }

        const uniquePeopleSet = new Set(peopleList);
        const uniquePeopleList = Array.from(uniquePeopleSet);

        const result = await Promise.all(uniquePeopleList.map(async (accountId) => {
            const store = await storeModel.store.findOne({ account_id: accountId });
            if (store) {
                const account = await accountModel.account.findOne({ _id: accountId });
                const { latestMessage } = await latestMessageFun(userId, accountId);
                return {
                    store,
                    account,
                    latestMessage
                };
            }
            return null;
        }));

        if(!result){
            return res.status(404).json({ code: 404, message: "can not show result!" });
        }

        const uniqueResult = removeDuplicateStores(result, 'account._id', userId);

        return res.status(200).json({
            code: 200,
            result: uniqueResult,
            message: "Get people list message successfully",
        });
    } catch (error) {
        return res.status(500).json({ code: 500, message: error.message });
    }
}

const latestMessageFun = async (userId, accountId) => {
    const latestMessage = await messageModel.message.findOne({
        $or: [
            { sender_id: userId, receiver_id: accountId },
            { sender_id: accountId, receiver_id: userId }
        ]
    }).sort({ createdAt: -1 }).limit(1);
    
    return {latestMessage};
}

function removeDuplicateStores(stores, key, userId) {
    const uniqueStoresMap = new Map();
    for (const store of stores) {
        const storeKey = store[key];
        if (storeKey !== userId && !uniqueStoresMap.has(storeKey)) {
            uniqueStoresMap.set(storeKey, store);
        }
    }
    return Array.from(uniqueStoresMap.values());
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