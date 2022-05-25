const mongoose = require('mongoose');

const teamsSchema = mongoose.Schema({
  teamName: {
    type: String,
    required: true
  },
  idCapitaine: {
    type: String,
    required: true
  },
})

module.exports = mongoose.model('teams', teamsSchema);