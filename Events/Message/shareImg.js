const {
  Message,
  MessageEmbed,
  MessageButton,
  MessageActionRow,
  Client
} = require('discord.js');

module.exports = {
  name: "messageCreate",
  /**
   * @param {Message} message
   * @param {Client} client
   */
  async execute(message, client) {
    if (message.author.bot) return

    if(message.content == '#PREDICTSEASON') {

      const predictEmbed = new MessageEmbed()
			.setTitle('Nouveau fichier partagé')
			.setDescription(
				`<@${message.author.id}> a partagé ses prédictions pour la saison.`,
      )
      .setImage(message.attachments.first().url)
			.setColor('RED');

      guild.channels.cache.get(process.env.ADMIN_FEED).send({
        content: `<@${message.author.id}> a partagé un fichier :`,
        embeds: [predictEmbed],
      });
    }
  }
}