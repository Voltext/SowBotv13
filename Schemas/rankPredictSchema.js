const mongoose = require('mongoose');


const rankPrediSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  points: {
    type: Number,
    required: true
  }

})

module.exports = mongoose.model('rankPredictions', rankPrediSchema);