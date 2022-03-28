const {
  Client,
  CommandInteraction,
  MessageEmbed
} = require("discord.js");

module.exports = {
  name: "guildMemberRemove",
  async execute(interaction, member) {
    const {
      options,
      guild,
      channel
    } = interaction;

    let memberCount = interaction.guild.memberCount

    const memberChannel = guild.channels.cache.get(process.env.MEMBER_COUNT);
    memberChannel.send({
      content: "Un membre vient de quitter le serveur. Nous sommes " + memberCount + " membres sur le serveur."
    });
    memberChannel.edit({
      name: `${memberCount} Membres`,
    });

    fs.unlink(`./Assets/Cards/${interaction.user.id}.png`, function (err) {
      if (err) throw err;
      // if no error, file has been deleted successfully
      console.log('Carte supprimée');
  });
  }
}