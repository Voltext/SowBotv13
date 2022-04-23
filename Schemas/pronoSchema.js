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

const reponseSchema = mongoose.Schema({
  userId:  {
    type: String,
    required: true
  }, 
  prono: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Pronos"
 },
  reponse: {
    type: String,
    required: true
  },

})

const Reponses = mongoose.model('Reponses', reponseSchema);
const Pronos = mongoose.model('Pronos', pronoSchema);

module.exports = {Reponses, Pronos}

