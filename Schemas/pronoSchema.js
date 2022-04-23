const mongoose = require('mongoose');

const pronoSchema = mongoose.Schema({
  libelle: {
    type: String,
    required: true
  },
  pointMax: {
    type: Number,
    required: true
  },
  isPerfect: {
    type: Boolean,
    required: true
  },
  reponses: [{ 
    type: mongoose.Schema.Types.ObjectId,
    ref: "Reponses"
 }],
  ecart: {
    type: Number,
    required: false
  }
})

module.exports = mongoose.model('Pronos', pronoSchema);