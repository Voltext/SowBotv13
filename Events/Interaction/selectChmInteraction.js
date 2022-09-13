const {
  MessageEmbed
} = require("discord.js");

module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    if (!interaction.isSelectMenu()) return;

    if (interaction.customId === 'select') {
      await interaction.update({ content: 'Something was selected!', components: [] });
    }
  }
}