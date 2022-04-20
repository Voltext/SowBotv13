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
    const {
      guild
    } = interaction
    const msgId = interaction.options.getString("msgid")
    const channel = await guild.channels.fetch('932438149739737089');

    const member = await guild.members.fetch(interaction.user.id);

    if (member.roles.cache.has('966251610248470528') === true) {
      channel.messages.fetch(msgId).then(async (msg) => {
        await msg.pin();
      })
      interaction.reply({
        content: "Message épinglé",
        ephemeral: true,
      })
    }
    else {
      interaction.reply({
        content: "Vous n'avez pas la permission de faire ça",
        ephemeral: true,
      })
    }

  }
}