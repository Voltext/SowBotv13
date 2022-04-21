const mongoose = require('mongoose');

const cardCollectionSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  cards: {
    type: [String],
    required: true
  }
})

module.exports = mongoose.model('Cards', cardCollectionSchema);