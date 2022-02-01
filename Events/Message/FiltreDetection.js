const { Message, MessageEmbed, MessageButton, MessageActionRow, Client } = require('discord.js');

module.exports = {
  name: "messageCreate",
  /**
   * @param {Message} message
   * @param {Client} client
   */
  async execute(message, client) {
    if(message.author.bot) return

    const {content, guild, author, channel} = message
    const messageContent = content.toLowerCase().split(" ");

    const Filter = client.filters.get(guild.id)
    if(!Filter) return;

    const wordsUsed = [];
    let deleted = false;

    messageContent.forEach((word) => {
      if(Filter.includes(word)) {
        wordsUsed.push(word)
        deleted = true
      }
    });

    if(deleted) {
      if(wordsUsed.length) {
        const channelId = client.filtersLog.get(guild.id)
        if(!channelId) return
        const channelObject = guild.channels.cache.get(channelId)
        if(!channelObject) return

        const Embed = new MessageEmbed()
        .setColor("RED")
        .setAuthor({
          name: author.tag,
          iconURL: author.displayAvatarURL({dynamic: true})
        })
        .setDescription(
          [
            `A utilisé ${wordsUsed.length} mots interdits dans ${channel} =>`,
            `\`${wordsUsed.map((w) => w)}\``,
          ].join("\n")
        );
        const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('un')
					.setLabel('Primary')
          .setStyle('PRIMARY'),
        new MessageButton()
					.setCustomId('deux')
					.setLabel('Primary')
					.setStyle('WARNING'),
      );

        channelObject.send({ content: 'Nouveau mot interdit detecté', embeds: [Embed], components: [row] })
      }
    };





  }
}