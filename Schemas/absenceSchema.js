const mongoose = require('mongoose');

const absenceSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    raison: {
        type: String,
        required: true
    },
    date_depart: {
        type: Number,
        required: true
    },
    date_retour: {
        type: Number,
        required: true
    },
    etat: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('absence', absenceSchema);