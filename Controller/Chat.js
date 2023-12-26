const jwt = require('jsonwebtoken'); 
const Chat = require('../models/Chat.Schema');
const sendMessage = async (req, res) => {
    try {
        // Get the receiverId from the request parameters
        const receiverId = req.params.receiverId;

        // Get the message from the request body
        const { message } = req.body;

        // Use user information from res.locals
        const senderId = res.locals.userId;
        const senderName = res.locals.userFullName;
        console.log(senderId)
        console.log(senderName)

        // Ensure that senderName and message are provided in the request body
        if (!senderName || !message) {
            return res.status(400).json({ error: 'Sender name and message are required' });
        }

        const chatMessage = new Chat({
            senderId,
            senderName,
            receiverId,
            message,
        });

        await chatMessage.save();

//             Fetching all messages between the sender and receiver
// const chatHistory = await Chat.find({
//     $or: [
//         { senderId: userId, receiverId },
//         { senderId: receiverId, receiverId: userId }
//     ]
// }).select('senderName message createdAt -_id') // Exclude _id field
//   .sort({ createdAt: 1 }); // Sorting by creation time

res.status(201).json({message: 'message deliver'});
} catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
}
};
const getMessages = async (req, res) => {
try {
  const { receiverId } = req.params;

  // Get the token from the request header
  const token = req.headers.token;

  // Decode the token to get the user's ID
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  res.locals.userId = decoded;


  // Fetching all messages between the sender and receiver
  const chatHistory = await Chat.find({
    $or: [
      { senderId: res.locals.userId, receiverId },
      { senderId: receiverId, receiverId: res.locals.userId }
    ]
  }).select('senderName message createdAt -_id') // Exclude _id field
    .sort({ createdAt: 1 }); // Sorting by creation time

  res.status(200).json(chatHistory);
} catch (error) {
  console.error(error);
  res.status(500).json({ error: 'Server error' });
}
};

module.exports = { sendMessage,getMessages };