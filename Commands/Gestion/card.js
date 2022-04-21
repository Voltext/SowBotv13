const { MessageEmbed } = require("discord.js");
const Cards = require("../../Api/card");
require('dotenv').config();

module.exports = {
  name: "card",
  description: "Affiche les nouvelles recuperations",
  permission: "ADMINISTRATOR",

  async execute(interaction) {
      const { guild } = interaction

    const getUsers = new Cards()

    const card = await getUsers.getUserCard()
    if (card.data !== null) {
        const data = card.data

        data.forEach(function (elem) {
            const embed = new MessageEmbed()
            .setTitle("Nouvelle demande de carte")
            .setDescription(`${elem.user_name} vient de récupérer une carte ! Félicitations`)

            guild.channels.cache.get(process.env.ADMIN_FEED).send({
                embeds: [embed]
            })
        })

    }
    else {
        interaction.reply({
            content: "Aucune demande de carte n'a été faites récemment"
        })
    }
  }
}