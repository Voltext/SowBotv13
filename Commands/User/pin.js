const {
  CommandInteraction,
  MessageEmbed,
  MessageAttachment
} = require("discord.js");
const fs = require('fs')
const path = require('path');

module.exports = {
  name: "pin",
  description: "Souhaiter un bon anniversaire",
  options: [{
    name: 'msgid',
    description: "L'utilisateur a souhaiter",
    type: "STRING",
    required: true
  }, ],

  async execute(interaction) {
    const { guild } = interaction
    const msgId = interaction.options.getString("msgid")
    const channel = await guild.channels.fetch('932438149739737089');
    //const pseudos = message.embeds[0].fields
    channel.messages.fetch(msgId).then(async (msg) => {
      console.log(msg)
      await msg.pin();
    })
    interaction.reply({
      content: "Message épinglé",
      ephemeral: true,
    })
  }
}