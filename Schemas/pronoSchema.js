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
  ecart: {
    type: Number,
    required: false
  },
  isPerfect: {
    type: Boolean,
    required: false
  }
})

module.exports = mongoose.model('Pronos', pronoSchema);