const mongoose = require('mongoose');

const teamsPlayerSchema = mongoose.Schema({
  teamId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
})

module.exports = mongoose.model('teamsPlayer', teamsPlayerSchema);