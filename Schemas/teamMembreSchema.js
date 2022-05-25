const mongoose = require('mongoose');

const teamMembreSchema = mongoose.Schema({
  userId:  {
    type: String,
    required: true
  }, 
  teamId: {
    type: Number,
    required: true
  },

})

module.exports = mongoose.model('teamMembre', teamMembreSchema);