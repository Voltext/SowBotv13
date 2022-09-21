const { CommandInteraction, MessageEmbed } = require("discord.js");

module.exports = {
    name: "createforum",
    description: "Creer un forum",
    permission: "ADMINISTRATOR",
    options: [
        {
            name: 'channel',
            description: "Channel parent",
            type: "CHANNEL",
            required: true
        },
    ],

    async execute(interaction) {
      const { guild } = interaction
      const newChannel = interaction.options.getChannel("channel")

      const forumChannel = await guild.channels.create("Forum", {
        type: 15,
        parent: newChannel.parent,
      });

      interaction.reply({
        content: "Salon crée",
        ephemeral: true
      })
    }
}