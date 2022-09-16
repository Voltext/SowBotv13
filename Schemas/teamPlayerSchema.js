const mongoose = require('mongoose');

const teamsPlayerSchema = mongoose.Schema({
  teamId: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
})

module.exports = mongoose.model('teamsPlayer', teamsPlayerSchema);