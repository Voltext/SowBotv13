const mongoose = require('mongoose');

const transfertSchema = mongoose.Schema({
  demandeurId:  {
    type: String,
    required: true
  }, 
  receveurId: {
    type: String,
    required: true
  },
  joueurId: {
    type: String,
    required: true
  },
  montant: {
    type: Number,
    required: true
  },
  threadId: {
    type: String,
    required: true
  }

})

module.exports = mongoose.model('Transfert', transfertSchema);