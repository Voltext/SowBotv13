const mongoose = require('mongoose');

const playerSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  poste: {
    type: String,
    required: true
  },
  genre: {
    type: String,
    required: true
  },
  profil: {
    type: String,
    required: true
  },
  isInjured: {
    type: Boolean,
    required: true
  },
  stat1: {
    type: Number,
    required: true
  },
  stat2: {
    type: Number,
    required: true
  },
  stat3: {
    type: Number,
    required: true
  },
  stat4: {
    type: Number,
    required: true
  },
  stat5: {
    type: Number,
    required: true
  },
  stat6: {
    type: Number,
    required: true
  },
  stamina: {
    type: Number,
    required: true
  }
})

module.exports = mongoose.model('players', playerSchema);