const {
  MessageEmbed
} = require("discord.js");
const mongo = require('../../mongo');
const rankPrediSchema = require('../../Schemas/rankPredictSchema')

module.exports = {
  name: "myprono",
  description: "Permet a un utilisateur proposer un pronostique",
  options: [{
      name: "matchs",
      description: "Les matchs dispos",
      type: "STRING",
      require: true,
      choices: [{
          name: "PSG - REAL",
          value: "psg"
        },
        {
          name: "OM - QARABAG",
          value: "om"
        },
        {
          name: "CHELSEA - LILLE",
          value: "chelsea"
        },
      ]
    },
    {
      name: 'score',
      description: "Score de l'utilisateur",
      type: "STRING",
      required: true
    },
  ],

  execute(interaction) {
    const {
      guild
    } = interaction;
    const score = interaction.options.getString('score');
    const match = options.getString('matchs')

    const embed = new MessageEmbed()
      .setColor('DARKBLUE')
      .setTitle(`${score}`)
      .setAuthor(`${match}`);

    guild.channels.cache.get(process.env.ADMIN_FEED).send({
      content: `Message de ${interaction.user.username}`,
      embeds: [embed],
    })
    interaction.reply({
      content: 'Prédiction envoyé',
      ephemeral: true,
    })
  }
}