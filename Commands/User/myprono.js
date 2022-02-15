const { MessageEmbed } = require("discord.js");
const mongo = require('../../mongo');
const rankPrediSchema = require('../../Schemas/rankPredictSchema')

module.exports = {
    name: "myprono",
    description: "Permet a un utilisateur proposer un pronostique",
    options: [
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

    const embed = new MessageEmbed()
    .setColor('DARKBLUE')
    .setTitle(`${score}`)
    .setAuthor(`${interaction.user.username}`)
    .setDescription('Pour le match PSG - REAL');

    guild.channels.cache.get(process.env.ADMIN_FEED).send({
      content: `${embed}`
  })
    }
}