const mongoose = require('mongoose');

const aiChatMemorySchema = new mongoose.Schema({
  user: {
    type: String,
    trim: true,
    index: true,
    required: [true, 'please provide a user']
  },
  role: {
    type: String,
    enum: ['user', 'assistant', 'system'],
    required: [true, 'Please provide a role'],
    default: 'user'
  },
  content: {
    type: String,
    required: [true, 'Please provide a content']
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

const ChatMemory = mongoose.model('ChatMemory', aiChatMemorySchema);

module.exports = ChatMemory;