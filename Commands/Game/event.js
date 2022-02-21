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
    let color = "";
    let sec = "";

    const imgTeam = teamBDD[0][equipe][0]["image"];
    const nomTeam = teamBDD[0][equipe][0]["nom"];
    const difficulty = teamBDD[0][equipe][0]["difficulty"];

    const img = new MessageAttachment(imgTeam);
    const time = 10000 * difficulty

    if(difficulty === 1) {
      color="GREEN";
      sec= "10 secondes";
    }
    else if(difficulty === 2) {
      color="ORANGE";
      sec= "20 secondes";
    }
    else if(difficulty === 3) {
      color="RED";
      sec= "30 secondes";
    }

    const embed = new MessageEmbed()
    .setColor(color)
    .setTitle("Devinez l'équipe en fonction des nationalités des joueurs")
    .setDescription(`Vous avez ${sec}`)
    .setImage(`attachment://${equipe}.png`);

    const filter = (m) => m.content === equipe

    interaction.reply({
      embeds: [embed],
      files: [img]
  })
  .then(() => {
    interaction.channel.awaitMessages({
      filter,
      max: 1,
      time: time
    })
    .then(collected => {
      const winner = collected.first().author.username
      interaction.followUp(`Félicitations ${winner} ! `)
    })
    .catch(collected => {
      interaction.followUp(`Personne n'a trouvé la solution dans le temps imparti `)
    })
  })
  }
}