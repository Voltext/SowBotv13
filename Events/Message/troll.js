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
  
      if(messageContent[messageContent.length -1] === "quoi" || messageContent[messageContent.length -1] === "quoi?" || messageContent[messageContent.length -1] === "Quoi?" || messageContent[messageContent.length -1] === "Quoi") {
          message.channel.send("Feur...");
      }
      if(messageContent[messageContent.length -1] === "hein?" || messageContent[messageContent.length -1] === "hein" || messageContent[messageContent.length -1] === "Hein" || messageContent[messageContent.length -1] === "Hein?") {
        message.channel.send("2.");
    }
    if(messageContent[messageContent.length -1] === "Non" || messageContent[messageContent.length -1] === "non") {
        message.channel.send("Bril...");
    }
    }
  }