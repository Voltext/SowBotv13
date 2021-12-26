const mongoose = require('mongoose');

const prediSchema = mongoose.Schema({
  msgId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  }

})

module.exports = mongoose.model('predictions', prediSchema);