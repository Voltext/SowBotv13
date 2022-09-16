const mongoose = require('mongoose');
const teamsSchema = require("../Schemas/teamsSchema").teamsSchema;

console.log(teamsSchema)

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