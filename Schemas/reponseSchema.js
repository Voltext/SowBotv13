const mongoose = require('mongoose');

const reponseSchema = mongoose.Schema({
  userId:  {
    type: String,
    required: true
  }, 
  warnings: {
    type: [Object],
    required: true
  }

})

module.exports = mongoose.model('reponses', reponseSchema);