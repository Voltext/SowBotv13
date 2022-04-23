const mongoose = require('mongoose');

const reponseSchema = mongoose.Schema({
  userId:  {
    type: String,
    required: true
  }, 
  pronoId: {type: mongoose.Schema.Types.ObjectId, ref: "Pronos"},
  reponse: {
    type: String,
    required: true
  },

})

module.exports = mongoose.model('Reponses', reponseSchema);