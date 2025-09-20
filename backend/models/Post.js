const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  author: { type: String, default: 'Anonymous' },
  text: { type: String, required: true },
  articleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Article' },
  upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', PostSchema);
