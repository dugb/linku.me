const mongoose = require('mongoose');
const shortid = require('shortid');

// Schema defines how chat messages will be stored in MongoDB
const ConversationsSchema = mongoose.Schema({
  users: [{ type: String }],
  conversationId: { type: String, default: shortid.generate }
});

module.exports = mongoose.model('Conversation', ConversationsSchema);
