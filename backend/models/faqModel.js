const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
  topic: {
    type: String,
    required: true,
    unique: true
  },
  questions: [{
    question: {
      type: String,
      required: true
    },
    answer: {
      type: String,
      required: true
    }
  }]
}, { timestamps: true });

module.exports = mongoose.model('FAQ', faqSchema); 