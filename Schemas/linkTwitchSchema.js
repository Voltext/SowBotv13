const mongoose = require('mongoose');

const linkTwitchSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
})

module.exports = mongoose.model('Link', linkTwitchSchema);