const {
  MessageEmbed
} = require("discord.js");

module.exports = {
  name: "myprono",
  description: "Permet d'envoyer une prediction score exact",
  options: [{
    name: "new",
    description: "Créer une prédiction",
    type: "SUB_COMMAND",
    options: [{
        name: "match",
        description: "Le type de prédiction que vous souhaitez créer",
        type: "STRING",
        require: true,
        choices: [{
            name: "PSG - REAL",
            value: "psg vs real"
          },
          {
            name: "OM - QARABAG",
            value: "om vs qarabag"
          },
          {
            name: "CHELSEA - LILLE",
            value: "chelsea vs lille"
          },
        ]
      },
      {
        name: "score",
        description: "Saisissez le score",
        type: "STRING",
        require: true,
      },
    ]
  }],

  execute(interaction) {
    const {
      guild
    } = interaction;
    const score = interaction.options.getString('score');
    const match = interaction.options.getString('match');

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