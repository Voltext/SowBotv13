const mongoose = require('mongoose');


const battleSchema = mongoose.Schema({
  guildId:  {
    type: String,
    required: true
  }, 
  battleId: {
    type: String,
    required: true
  },
  infos: {
    type: [Object],
    required: true
  },
  pronos: {
    type: [Object],
    required: true
  },
  player1: {
    type: [Object],
    required: true
  },
  player2: {
    type: [Object],
    required: true
  }

})

module.exports = mongoose.model('battle', battleSchema);