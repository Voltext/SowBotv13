const {
  Client,
  CommandInteraction,
  MessageEmbed
} = require("discord.js");
const fs = require('fs')

module.exports = {
  name: "guildMemberRemove",
  async execute(interaction) {
    const {
      options,
      guild,
      channel
    } = interaction;

    let memberCount = interaction.guild.memberCount

    const memberChannel = guild.channels.cache.get(process.env.MEMBER_COUNT);
    memberChannel.send({
      content: "Un membre vient de quitter le serveur (" + interaction.user.username + "). Nous sommes " + memberCount + " membres sur le serveur."
    });
    memberChannel.edit({
      name: `${memberCount} Membres`,
    });

  }
}