const mongoose = require('mongoose');

const battleSchema = mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  userId1: {
    type: String,
    required: true
  },
  userId2: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('battle', battleSchema);