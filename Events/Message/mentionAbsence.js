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
        const {
            content,
            guild,
            author,
            channel
          } = message
      if (message.author.bot) return
  
      if(message.mentions.members.first()) {
        console.log(message.mentions.members.first())
      }
  
        
    }
  }