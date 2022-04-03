const mongoose = require('mongoose');

const filtreSchema = mongoose.Schema({
  Guild: {
    type: String,
    required: true
  },
  Log: {
    type: String,
    required: true
  },
  Words: {
    type: [String],
    required: true
  },

})

module.exports = mongoose.model('Filtre', filtreSchema);