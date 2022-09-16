const mongoose = require('mongoose');

const teamsPlayerSchema = mongoose.Schema({
  teamId: {
    type: String,
    required: true
  },
  userId: {
    type: ObjectId,
    required: true
  },
})

module.exports = mongoose.model('teamsPlayer', teamsPlayerSchema);