const mongoose = require('mongoose');

const awardsSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  membre: {
    type: String,
    required: true
  },
  emblematique: {
    type: String,
    required: true
  },
  supporter: {
    type: String,
    required: true
  },
  prono: {
    type: String,
    required: true
  },
  modo: {
    type: String,
    required: true
  },
  equipe: {
    type: String,
    required: true
  },
  avis: {
    type: String,
    required: true
  },
  devoue: {
    type: String,
    required: true
  },
  dynamique: {
    type: String,
    required: true
  },
  avis: {
    type: String,
    required: true
  },
  compris: {
    type: String,
    required: true
  },
  ouest: {
    type: String,
    required: true
  },
  flop: {
    type: String,
    required: true
  },
})

module.exports = mongoose.model('awards', awardsSchema);