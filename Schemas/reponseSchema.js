const mongoose = require('mongoose');

const reponseSchema = mongoose.Schema({
  userId:  {
    type: String,
    required: true
  }, 
  pronoId: {type: Number, ref: "Pronos"},
  reponse: {
    type: String,
    required: true
  },

})

module.exports = mongoose.model('Reponses', reponseSchema);