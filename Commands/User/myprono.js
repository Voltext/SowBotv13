const {
  MessageEmbed
} = require("discord.js");

module.exports = {
  name: "myprono",
  description: "Permet a un utilisateur proposer un pronostique",
  options: [{
      name: "matchs",
      description: "Les matchs dispos",
      type: "SUB_COMMAND",
      options: [{
        name: "type",
        description: "Le type de prédiction que vous souhaitez créer",
        type: "STRING",
        require: true,
        choices: [{
            name: "PSG - REAL",
            value: "psgvsreal"
          },
          {
            name: "OM - QARABAG",
            value: "omvsqarabag"
          },
          {
            name: "CHELSEA - LILLE",
            value: "chelseavslille"
          },
        ],
      }, ],
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
    const match = options.getString('type')

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