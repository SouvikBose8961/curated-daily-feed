const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String },
  content: { type: String }, // full text
  summary: { type: String }, // AI summary bullets (stringified)
  simplified: { type: String }, // ELI5 version
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Article', ArticleSchema);
