const mongoose = require('mongoose');

const MicroCardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  concept: { type: String, required: true },
  explanation: { type: String },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MicroCard', MicroCardSchema);
