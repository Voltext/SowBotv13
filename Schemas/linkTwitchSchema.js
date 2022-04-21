const mongoose = require('mongoose');

const linkTwitchSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  twitchName: {
    type: String,
    required: true
  },
})

module.exports = mongoose.model('Link', linkTwitchSchema);