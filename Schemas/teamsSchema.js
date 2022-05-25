const mongoose = require('mongoose');

const teamsSchema = mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  idCapitaine: {
    type: String,
    required: true
  },
})

module.exports = mongoose.model('teams', teamsSchema);