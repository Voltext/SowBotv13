const Discord = require("discord.js");

module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
      if(interaction.isAutocomplete()) {
        let entry = interaction.options.getFocused()
        const choices = ['Popular Topics: Threads', 'Sharding: Getting started', 'Library: Voice Connections', 'Interactions: Replying to slash commands', 'Popular Topics: Embed preview'];
		const filtered = choices.filter(choice => choice.startsWith(entry));
		await interaction.respond(
			filtered.map(choice => ({ name: choice, value: choice })),
		);
      }
  }
}