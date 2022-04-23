const mongoose = require('mongoose');

const reponseSchema = mongoose.Schema({
  userId:  {
    type: String,
    required: true
  }, 
  pronoId:  {
    type: String,
    required: true
  },
  reponses: {
    type: String,
    required: true
  }

})

module.exports = mongoose.model('reponses', reponseSchema);