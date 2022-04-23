const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const reponseSchema = mongoose.Schema({
  userId:  {
    type: String,
    required: true
  }, 
  pronoId:  {
    type: String,
    required: true
  },
  reponse: {
    type: String,
    required: true
  },
  reponses: [{ type: Schema.Types.ObjectId, ref:'Pronos' }],

})

module.exports = mongoose.model('Reponses', reponseSchema);