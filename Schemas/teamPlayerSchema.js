const mongoose = require('mongoose');
const teamsSchema = require("../Schemas/teamsSchema").teamsSchema;

const teamsPlayerSchema = mongoose.Schema({
  team: teamsSchema,
  userId: {
    type: String,
    required: true
  },
})

module.exports = mongoose.model('teamsPlayer', teamsPlayerSchema);