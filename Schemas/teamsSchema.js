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
  budget: {
    type: Number,
    required: true
  }
})

const Teams = mongoose.model("teams", teamsSchema);

module.exports = { Teams, teamsSchema };