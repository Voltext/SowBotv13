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

    if(message.author.id == '246595347101515776') {
      console.log(message)
    }
  }
}