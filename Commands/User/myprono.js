const {
  MessageEmbed
} = require("discord.js");

module.exports = {
  name: "prediction",
  description: "Permet de créer une prédiction",
  permission: "KICK_MEMBERS",
  options: [{
    name: "new",
    description: "Créer une prédiction",
    type: "SUB_COMMAND",
    options: [{
        name: "type",
        description: "Le type de prédiction que vous souhaitez créer",
        type: "STRING",
        require: true,
        choices: [{
            name: "Résultat final",
            value: "final"
          },
          {
            name: "+/- de buts",
            value: "but"
          },
          {
            name: "Cartons",
            value: "cartons"
          },
        ]
      },
      {
        name: "team1",
        description: "Saisissez la première équipe qui joue à domicile",
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