const { MessageEmbed } = require("discord.js");
require('dotenv').config();
const Moment = require("moment");

module.exports = {
  name: "calendrier",
  description: "Affiche le calendrier de l'avent du jour",
  permission: "ADMINISTRATOR",

  async execute(interaction) {
    Moment.locale("fr");

    const embed = new MessageEmbed()
    .setTitle("Calendrier de l'Avent : " + Moment(new Date()).format('DD-MM'))

    interaction.reply({
        embeds: [embed],
    })

  }
}