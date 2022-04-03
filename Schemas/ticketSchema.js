const mongoose = require('mongoose');

const ticketSchema = mongoose.Schema({
  GuildID: {
    type: String,
    required: true
  },
  MemberID: {
    type: String,
    required: true
  },
  TicketID: {
    type: String,
    required: true
  },
  ChannelID: {
    type: String,
    required: true
  },
  Closed: {
    type: Boolean,
    required: true
  },
  Locked: {
    type: Boolean,
    required: true
  },
  Type: {
    type: String,
    required: true
  },
  Modo: {
    type: String,
    default: null,
    required: true
  }

})

module.exports = mongoose.model('tickets', ticketSchema);