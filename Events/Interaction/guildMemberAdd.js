const {
  Client,
  CommandInteraction,
  MessageEmbed
} = require("discord.js");

module.exports = {
  name: "guildMemberAdd",
  async execute(interaction, client) {
    const {
      options,
      member,
      guild,
      channel
    } = interaction;

    let memberCount = interaction.guild.memberCount

    const memberChannel = guild.channels.cache.get(process.env.MEMBER_COUNT);
    memberChannel.send({
      content: "Un membre vient de rejoindre le serveur. Nous sommes " + memberCount + " membres sur le serveur."
    });
    memberChannel.edit({
      name: `${memberCount} Membres`,
    });
  }
}