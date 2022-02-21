const { MessageEmbed, MessageAttachment } = require("discord.js");
require('dotenv').config();
const teamBDD = require("../../Game/Json/team.json")
//const clubBDD = require("../../Game/Json/club.json")
//const goalStrikerBDD = require("../../Game/Json/goalstriker.json")

module.exports = {
  name: "event",
  description: "Permet de lancer un evenement d'animation",
  permission: "KICK_MEMBERS",
  options: [{
		name: "new",
		description: "Créer un event",
		type: "SUB_COMMAND",
		options: [{
				name: "type",
				description: "Le type d'event que vous souhaitez créer",
				type: "STRING",
				require: true,
				choices: [{
						name: "Devine l'equipe avec les drapeaux",
						value: "drapeaux"
					},
					{
						name: "Devine joueur par les clubs passés",
						value: "joueur"
					},
					{
						name: "Devine l'equipe avec l'attaquant et le goal",
						value: "goal"
					},
				]
			},
			{
				name: "valeur",
				description: "Saisissez la valeur de l'event",
				type: "STRING",
				require: true,
			},
		]
	}],

  async execute(interaction) {
    const {guild} = interaction;
    const equipe = interaction.options.getString("valeur")

    const imgTeam = teamBDD[equipe][0]["image"];
    const nomTeam = teamBDD[equipe][0]["nom"];
    const difficulty = teamBDD[equipe][0]["difficulty"];

    const img = new MessageAttachment(imgTeam);

    const embed = new MessageEmbed()
    .setTitle("Devinez l'équipe en fonction des nationalités des joueurs")
    .setImage(`attachment://${equipe}.png`);

    guild.channels.cache.get(process.env.EVENT).send({
      embeds: [embed],
      files: [img]
  })
  }
}