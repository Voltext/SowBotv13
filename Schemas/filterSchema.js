const { model, Schema } = require('mongoose')

module.exports = model(
  "Filtre",
  new Schema({
    Guild: String,
    Log: String,
    Words: [String],
  })
)