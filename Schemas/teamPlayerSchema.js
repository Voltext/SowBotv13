const mongoose = require('mongoose');
console.log(require("../Schemas/teamsSchema").teamsSchema)

const teamsPlayerSchema = mongoose.Schema({
  team: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
})

module.exports = mongoose.model('teamsPlayer', teamsPlayerSchema);