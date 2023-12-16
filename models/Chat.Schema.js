const mongoose = require('mongoose');

const ChatSchema = mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' // Assuming you have a general User model or you can specify Customer, Freelancer, Seller
    },
    senderName: {
        type: String, // Add a field to store sender's name
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    message: {
        type: String,
    }
}, { timestamps: true });

const Chat = mongoose.model("Chat", ChatSchema);
module.exports = Chat;