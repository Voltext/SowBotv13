const mongoose = require('mongoose');

const counterSchema = mongoose.Schema({
  id: {
    type: Number,
    required: true
  },
})

module.exports = mongoose.model('counters', counterSchema);