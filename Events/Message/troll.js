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
  
      const {
        content,
        guild,
        author,
        channel
      } = message
      const messageContent = content.toLowerCase().split(" ");
  
      if(messageContent[messageContent.length -1] === "quoi" || messageContent[messageContent.length -1] === "quoi?") {
          message.channel.send("Feur ");
      }
    }
  }