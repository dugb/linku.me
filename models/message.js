const mongoose = require('mongoose');

// Schema defines how chat messages will be stored in MongoDB
const MessageSchema = mongoose.Schema({
  conversationId: { type: String, unique: true, required: true },
  body: {
    type: String,
    required: true
  },
  author: {
    member_id: { type: String, unique: true, required: true },
    username: { type: String, unique: true, required: true }
  },
  created: { type: Date, default: Date.now }
},

{
  timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
});

module.exports = mongoose.model('Message', MessageSchema);
