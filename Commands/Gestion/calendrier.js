const { MessageEmbed } = require("discord.js");
require('dotenv').config();
const Moment = require("moment");

module.exports = {
  name: "calendrier",
  description: "Affiche le calendrier de l'avent du jour",
  permission: "ADMINISTRATOR",

  async execute(interaction) {
    Moment.locale("fr");
    const jour = Moment(new Date()).format('DD')
    let kdo = "";
    let pourcent= ""
    if(jour < 24) {
      pourcent="80%\n10%\n5%\n2%\n1%\n1%\n0.5%\n0.5%"
      kdo = "Points prédis\nUne carte aléatoire\nCarte spéciale Noel\nSub tier 1\nSub tier 3\nNitro Discord\nVIP 1 an\nGagne la carte de Sowdred sur Discord";
    }
    else {
      pourcent="80%\n10%\n5%\n3%\n1%\n0.5%\n0.4%\n0.1%"
      kdo = "Points prédis (entre 1 et 10)\nCarte aléatoire\nCarte spéciale Noel\nVIP\nSub\nNitro\nMaillot de son choix\n2 places matchs de son choix ";
    }
    

    const embed = new MessageEmbed()
    .setTitle("Calendrier de l'Avent : " + jour + " Décembre")
    .setDescription("Nous sommes le " + jour + " Décembre. Un nouveau jour pour gagner des petits cadeaux sur le Discord. Voici les cadeaux disponibles aujourd'hui")
    .addFields(
			{ name: 'Probabilités', value: pourcent, inline: true },
			{ name: 'Lot', value: kdo, inline: true },
		);

    interaction.reply({
        embeds: [embed],
    })

  }
}