const mongoose = require('mongoose');
const shortid = require('shortid');

// Schema defines how chat messages will be stored in MongoDB
const ConversationsSchema = mongoose.Schema({
  users:[{ member_id: String, username: String }],
  conversationId: { type: String, default: shortid.generate }
});

module.exports = mongoose.model('Conversations', ConversationsSchema);
