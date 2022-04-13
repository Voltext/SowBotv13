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
    required: true
  }
})

module.exports = mongoose.model('Pronos', pronoSchema);