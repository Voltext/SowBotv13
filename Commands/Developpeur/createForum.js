const { CommandInteraction, MessageEmbed } = require("discord.js");

module.exports = {
    name: "createForum",
    description: "Souhaiter un bon anniversaire",
    permission: "ADMINISTRATOR",
    options: [
        {
            name: 'channel',
            description: "Channel parent",
            type: "CHANNEL",
            required: true
        },
    ],

    execute(interaction) {
      const { guild } = interaction
      const newChannel = interaction.options.getChannel("channel")

      const forumChannel = await guild.channels.create(member.user.tag, {
        type: "GUILD_FORUM",
        parent: newChannel.parent,
      });

      interaction.reply({
        content: "Salon crée",
        ephemeral: true
      })
    }
}